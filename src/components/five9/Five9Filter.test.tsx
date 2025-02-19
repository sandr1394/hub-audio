import * as React from 'react';
import { mount } from '@cypress/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import CacheContextProvider from '../../utils/CacheContextProvider';
import Five9Filter from './Five9Filter';
import NetworkService from '../../network-service';

describe('Five9Filter', () => {
  before(() => {
    NetworkService.setupInterceptors();
  });

  beforeEach(() => {
    cy.clock(new Date('2020-10-12T03:24:00'));
    cy.intercept(
      'GET',
      '/audio/api/v1/campaign/all',
      cy
        .stub()
        .as('campaigns')
        .callsFake((req) => req.reply({ statusCode: 200, fixture: 'campaigns.json' })),
    );
    cy.intercept(
      'GET',
      '/audio/api/v1/agent/100003',
      cy
        .stub()
        .as('agent')
        .callsFake((req) => req.reply({ statusCode: 200, fixture: 'agent100003.json' })),
    );
    cy.intercept(
      'GET',
      '/audio/api/v1/agent/?agentInfo=*',
      cy
        .stub()
        .as('agentAgentSearchEmpty')
        .callsFake((req) => req.reply({ statusCode: 200, body: [] })),
    );
    cy.intercept(
      'GET',
      '/audio/api/v1/agent/?agentInfo=Jack&agentInfo=Smith',
      cy
        .stub()
        .as('agentAgentSearch')
        .callsFake((req) =>
          req.reply({
            statusCode: 200,
            body: [{ id: 1, email: 'test@test.com', firstName: 'Jack', lastName: 'Smith' }],
          }),
        ),
    );
  });

  const render = (props: React.ComponentProps<typeof Five9Filter>) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CacheContextProvider>
            <Five9Filter {...props} />
          </CacheContextProvider>
        </LocalizationProvider>
      </ThemeProvider>,
    );
  };

  it('should not submit without dateFrom', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.contains('At least one field should be filled').should('exist');
  });

  it('should validate dateFrom', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dateFrom').type('1010');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.get('#dateFrom-helper-text').should('have.text', 'Please enter a valid date (MM/DD/YYYY)');
    cy.get('#dateFrom').clear().type('10/10/2012');
    cy.get('#dateFrom-helper-text').should('have.text', 'Search is available only for the last 7 years');
    cy.get('#dateFrom').clear().type('10/10/2025');
    cy.get('#dateFrom-helper-text').should('have.text', 'Please enter a date from the past');
  });

  it('should validate dateTo', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dateTo').type('1010');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('#dateTo-helper-text').should('have.text', 'Please enter a valid date (MM/DD/YYYY)');
    cy.get('#dateTo').clear().type('10/10/2012');
    cy.get('#dateTo-helper-text').should('have.text', 'Search is available only for the last 7 years');
    cy.get('#dateTo').clear().type('10/10/2025');
    cy.get('#dateTo-helper-text').should('have.text', 'Please enter a date from the past');
    cy.get('#dateTo').clear().type('10/10/2019');
    cy.get('button').contains('Submit').click();
    cy.get('#dateTo-helper-text').should('not.exist');
    cy.contains('At least one additional field should be filled')
      .should('exist')
      .then(() => expect(onSubmit).not.to.be.called);
  });

  it('should validate dateTo+dateFrom', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dateFrom').type('10102019');
    cy.get('#dateTo').type('10102018');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('#dateTo-helper-text').should('have.text', 'Date should be after Date From');
    cy.get('#dateFrom-helper-text').should('have.text', 'Date should be before Date To');
    cy.get('#dateFrom').clear().type('10102017');
    cy.get('#dateTo-helper-text').should('not.exist');
    cy.get('#dateFrom-helper-text').should('not.exist');
  });

  it('submits with only dateFrom', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dateFrom').type('10102020');
    cy.get('#dateFrom').should('have.value', '10/10/2020');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: null,
          ani: null,
          dnis: null,
          agentId: null,
          campaignId: null,
          dateFrom: '2020-10-10T04:00:00.000Z',
          dateTo: null,
        });
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
  });

  it('submits with callId', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#callId').type('a123');
    cy.get('#callId').should('have.value', '123');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: '123',
          sessionId: null,
          ani: null,
          dnis: null,
          agentId: null,
          campaignId: null,
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('submits with sessionId', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#sessionId').type('test123');
    cy.get('#sessionId').should('have.value', 'test123');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: 'test123',
          ani: null,
          dnis: null,
          agentId: null,
          campaignId: null,
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('submits with ani', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#ani').type('8888888888');
    cy.get('#ani').should('have.value', '(888) 888-8888');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: null,
          ani: '8888888888',
          dnis: null,
          agentId: null,
          campaignId: null,
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('validates ani', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#ani').type('88888');
    cy.get('#ani').should('have.value', '(888) 88');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('#ani-helper-text').should('have.text', 'Phone number is not valid');
    cy.get('#ani').clear().type('8888888888');
    cy.get('#ani-helper-text').should('not.exist');
  });

  it('submits with dnis', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dnis').type('8888888888');
    cy.get('#dnis').should('have.value', '(888) 888-8888');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: null,
          ani: null,
          dnis: '8888888888',
          agentId: null,
          campaignId: null,
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('validates dnis', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#dnis').type('88888');
    cy.get('#dnis').should('have.value', '(888) 88');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('#dnis-helper-text').should('have.text', 'Phone number is not valid');
    cy.get('#dnis').clear().type('8888888888');
    cy.get('#dnis-helper-text').should('not.exist');
  });

  it('submits with agent', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#agentId').type('Jack Smith');
    cy.tick(300);
    cy.get('li').contains('test@test.com').click();
    cy.tick(1000);
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: null,
          ani: null,
          dnis: null,
          agentId: '1',
          campaignId: null,
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('submits with campaign', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#campaignId').click();
    cy.selectOption('Verification Outbound');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: null,
          sessionId: null,
          ani: null,
          dnis: null,
          agentId: null,
          campaignId: '100003',
          dateFrom: null,
          dateTo: null,
        });
      });
  });

  it('submits with full info', () => {
    const onSubmit = cy.stub();
    render({ onSubmit });
    cy.get('#callId').type('1234');
    cy.get('#sessionId').type('test123');
    cy.get('#agentId').type('Jack Smith ');
    cy.tick(300);
    cy.selectOption('test@test.com');
    cy.get('#ani').type('6213232424');
    cy.get('#dnis').type('9812232233');
    cy.get('#dateFrom').type('10102020');
    cy.get('#dateTo').type('10112020');
    cy.get('#campaignId').click();
    cy.get('li[role="option"]').should('have.length', 2);
    cy.selectOption('Verification Outbound');
    cy.get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWithExactly({
          callId: '1234',
          sessionId: 'test123',
          ani: '6213232424',
          dnis: '9812232233',
          agentId: '1',
          campaignId: '100003',
          // Users enter data according to their local zone, but it is proceeded as UTC time
          dateFrom: '2020-10-10T04:00:00.000Z',
          dateTo: '2020-10-12T03:59:59.999Z',
        });
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.get('@agentAgentSearch').its('callCount').should('equal', 2);
    cy.get('@agent').its('callCount').should('equal', 0);
    cy.get('@agentAgentSearchEmpty').its('callCount').should('equal', 0);
  });

  it('prepopulates filter', () => {
    const onSubmit = cy.stub();
    render({
      onSubmit,
      callId: '1234',
      sessionId: 'a1',
      ani: '6901233434',
      dnis: '9812232233',
      agentId: '100003',
      campaignId: '100003',
      dateFrom: '2020-10-10T04:00:00.000Z',
      dateTo: '2020-10-11T23:59:59.999Z',
    });
    cy.tick(1000);
    cy.get('#callId').should('have.value', '1234');
    cy.get('#sessionId').should('have.value', 'a1');
    cy.get('#ani').should('have.value', '(690) 123-3434');
    cy.get('#dnis').should('have.value', '(981) 223-2233');
    cy.get('#agentId').should('have.value', 'Jack Smith');
    cy.get('#campaignId').should('have.value', 'Verification Outbound');
    cy.get('#dateFrom').should('have.value', '10/10/2020');
    cy.get('#dateTo')
      .should('have.value', '10/11/2020')
      .then(() => {
        expect(onSubmit).not.to.be.called;
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.get('@agentAgentSearch').its('callCount').should('equal', 0);
    cy.get('@agent').its('callCount').should('equal', 1);
    cy.get('@agentAgentSearchEmpty').its('callCount').should('equal', 0);
  });
});

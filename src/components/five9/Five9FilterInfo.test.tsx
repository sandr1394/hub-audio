import * as React from 'react';
import { mount } from '@cypress/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import CacheContextProvider from '../../utils/CacheContextProvider';
import Five9FilterInfo from './Five9FilterInfo';
import NetworkService from '../../network-service';

describe('Five9FilterInfo', () => {
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
      '/audio/api/v1/agent/*',
      cy
        .stub()
        .as('agent')
        .callsFake((req) => req.reply({ statusCode: 200, fixture: 'agent100003.json' })),
    );
  });

  const render = (props: React.ComponentProps<typeof Five9FilterInfo>) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CacheContextProvider>
            <Five9FilterInfo {...props} />
          </CacheContextProvider>
        </LocalizationProvider>
      </ThemeProvider>,
    );
  };

  it('should show only date', () => {
    render({
      callId: null,
      sessionId: null,
      ani: null,
      dnis: null,
      agentId: null,
      campaignId: null,
      dateFrom: '2020-10-10T04:00:00.000Z',
      dateTo: null,
    });
    cy.contains('p', 'Date:').should('exist').and('have.text', 'Date: from 10/10/2020 to 10/12/2020');
    cy.contains('p', 'Call Id:').should('not.exist');
    cy.contains('p', 'Session Id:').should('not.exist');
    cy.contains('p', 'Agent:').should('not.exist');
    cy.contains('p', 'Campaign:').should('not.exist');
    cy.contains('p', 'Phone Number (ANI):').should('not.exist');
    cy.contains('p', 'DNIS:').should('not.exist');
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.get('@agent').its('callCount').should('equal', 0);
  });

  it('should show all data', () => {
    render({
      callId: '123',
      sessionId: 'test123',
      ani: '8888888888',
      dnis: '9999999999',
      agentId: '100003',
      campaignId: '100003',
      dateFrom: '2020-10-10T04:00:00.000Z',
      dateTo: '2020-10-11T04:00:00.000Z',
    });
    cy.contains('p', 'Date:').should('exist').and('have.text', 'Date: from 10/10/2020 to 10/11/2020');
    cy.contains('p', 'Call Id:').should('exist').and('have.text', 'Call Id: 123');
    cy.contains('p', 'Session Id:').should('exist').and('have.text', 'Session Id: test123');
    cy.contains('p', 'Agent:').should('exist').and('have.text', 'Agent: Jack Smith');
    cy.contains('p', 'Campaign:').should('exist').and('have.text', 'Campaign: Verification Outbound');
    cy.contains('p', 'Phone Number (ANI):').should('exist').and('have.text', 'Phone Number (ANI): (888) 888-8888');
    cy.contains('p', 'DNIS:').should('exist').and('have.text', 'DNIS: (999) 999-9999');
    cy.get('@campaigns').its('callCount').should('equal', 1);
    cy.get('@agent').its('callCount').should('equal', 1);
  });

  it('should show loading state data', () => {
    let campaignResolve: () => void;
    let agentResolve: () => void;
    const campaignPromise = new Promise<void>((resolve) => {
      campaignResolve = resolve;
    });
    const agentPromise = new Promise<void>((resolve) => {
      agentResolve = resolve;
    });
    cy.intercept('GET', '/audio/api/v1/campaign/all', (req) => {
      return campaignPromise.then(() => {
        req.reply({ statusCode: 200, fixture: 'campaigns.json' });
      });
    });
    cy.intercept('GET', '/audio/api/v1/agent/100003', (req) => {
      return agentPromise.then(() => {
        req.reply({ statusCode: 200, fixture: 'agent100003.json' });
      });
    });
    render({
      callId: null,
      sessionId: null,
      ani: null,
      dnis: null,
      agentId: '100003',
      campaignId: '100003',
      dateFrom: null,
      dateTo: null,
    });
    cy.get('[data-testid="filter-info-campaign-loading"]').should('exist');
    cy.get('[data-testid="filter-info-agent-loading"]')
      .should('exist')
      .then(() => {
        campaignResolve();
        agentResolve();
      });
    cy.get('[data-testid="filter-info-campaign-loading"]').should('not.exist');
    cy.get('[data-testid="filter-info-agent-loading"]').should('not.exist');
  });

  it('should show unknown agent in a right way', () => {
    cy.intercept('GET', '/audio/api/v1/agent/100023', { fixture: 'unknownAgent.json' });
    render({
      callId: null,
      sessionId: null,
      ani: null,
      dnis: null,
      agentId: '100023',
      campaignId: null,
      dateFrom: null,
      dateTo: null,
    });
    cy.contains('p', 'Agent:').should('exist').and('have.text', 'Agent: UNKNOWN');
  });
});

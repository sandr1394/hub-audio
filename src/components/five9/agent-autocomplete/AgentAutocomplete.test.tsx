import * as React from 'react';
import { mount } from '@cypress/react';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import CacheContextProvider from '../../../utils/CacheContextProvider';
import AgentAutocomplete from './AgentAutocomplete';
import NetworkService from '../../../network-service';

describe('AgentAutocomplete', () => {
  before(() => {
    NetworkService.setupInterceptors();
  });

  beforeEach(() => {
    cy.clock();
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

  const render = (props: React.ComponentProps<typeof AgentAutocomplete>) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <CacheContextProvider>
          <AgentAutocomplete {...props} />
        </CacheContextProvider>
      </ThemeProvider>,
    );
  };

  it('should open on first symbol only', () => {
    render({ value: null });
    cy.get('input').focus();
    cy.get('[role="presentation"]').should('not.exist');
    cy.focused().type('1');
    cy.get('[role="presentation"]').should('exist');
    cy.focused().clear();
    cy.get('[role="presentation"]').should('not.exist');
  });

  it('should close and clear on blur', () => {
    render({ value: null });
    cy.get('input').focus().type('test');
    cy.get('input').should('have.value', 'test');
    cy.get('[role="presentation"]').should('exist');
    cy.focused().blur();
    cy.get('[role="presentation"]').should('not.exist');
    cy.get('input').should('have.value', '');
  });

  it('should show loading', () => {
    render({ value: null });
    cy.get('input').focus().type('test');
    cy.get('[role="presentation"]').should('contain', 'Loading');
    cy.tick(300);
    cy.get('[role="presentation"]').should('contain', 'No options');
    cy.get('@agentAgentSearchEmpty').its('callCount').should('equal', 1);
    cy.get('@agentAgentSearch').its('callCount').should('equal', 0);
  });

  it('should submit option', () => {
    const onSelect = cy.stub();
    render({ onSelect, value: null });
    cy.get('input').focus().type('Jack Smith');
    cy.tick(300);
    cy.get('[role="presentation"]').should('contain', 'test@test.com');
    cy.get('li')
      .contains('test@test.com')
      .click()
      .then(() => {
        expect(onSelect).to.be.calledOnce;
        expect(onSelect).to.be.calledWithExactly('1');
        cy.get('input').should('have.value', '');
      });
    cy.get('@agentAgentSearchEmpty').its('callCount').should('equal', 0);
    cy.get('@agentAgentSearch').its('callCount').should('equal', 1);
    cy.get('@agent').its('callCount').should('equal', 0);
  });

  it('should prepopulate option', () => {
    const onSelect = cy.stub();
    render({ onSelect, value: '100003' });
    cy.tick(500);
    cy.get('input')
      .should('have.value', 'Jack Smith')
      .then(() => {
        expect(onSelect).not.to.be.called;
      });
    cy.get('@agentAgentSearchEmpty').its('callCount').should('equal', 0);
    cy.get('@agentAgentSearch').its('callCount').should('equal', 0);
    cy.get('@agent').its('callCount').should('equal', 1);
  });
});

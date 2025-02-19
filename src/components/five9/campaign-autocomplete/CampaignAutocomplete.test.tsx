import * as React from 'react';
import { mount } from '@cypress/react';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import CacheContextProvider from '../../../utils/CacheContextProvider';
import NetworkService from '../../../network-service';
import CampaignAutocomplete from './CampaignAutocomplete';

describe('CampaignAutocomplete', () => {
  before(() => {
    NetworkService.setupInterceptors();
  });

  beforeEach(() => {
    cy.clock();
    cy.intercept(
      'GET',
      '/audio/api/v1/campaign/all',
      cy
        .stub()
        .as('campaigns')
        .callsFake((req) => req.reply({ statusCode: 200, fixture: 'campaignsMiddleSize.json' })),
    );
  });

  const render = (props: React.ComponentProps<typeof CampaignAutocomplete>) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <CacheContextProvider>
          <CampaignAutocomplete {...props} />
        </CacheContextProvider>
      </ThemeProvider>,
    );
  };

  it('should open on click', () => {
    render({ value: null });
    cy.get('[role="presentation"]').should('not.exist');
    cy.get('input').click();
    cy.get('[role="presentation"]').should('exist');
  });

  it('should close and clear on blur', () => {
    render({ value: null });
    cy.get('input').click().type('ver');
    cy.get('input').should('have.value', 'ver');
    cy.get('[role="presentation"]').should('exist');
    cy.focused().blur();
    cy.get('[role="presentation"]').should('not.exist');
    cy.get('input').should('have.value', '');
  });

  it('should submit option', () => {
    const onSelect = cy.stub();
    render({ onSelect, value: null });
    cy.get('input').click();
    cy.get('li').should('have.length', 8);
    cy.get('input').type('ver');
    cy.get('li').should('have.length', 3);
    cy.get('li')
      .contains('Outbound')
      .click()
      .then(() => {
        expect(onSelect).to.be.calledOnce;
        expect(onSelect).to.be.calledWithExactly('100033');
        cy.get('input').should('have.value', 'Verification Outbound');
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
  });

  it('should prepopulate option', () => {
    const onSelect = cy.stub();
    render({ onSelect, value: '100030' });
    cy.get('input')
      .should('have.value', 'Email Marketing Active Offer')
      .then(() => {
        expect(onSelect).not.to.be.called;
      });
    cy.get('@campaigns').its('callCount').should('equal', 1);
  });
});

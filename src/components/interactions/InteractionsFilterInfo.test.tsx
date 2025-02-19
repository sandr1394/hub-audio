import * as React from 'react';
import { mount } from '@cypress/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import InteractionsFilterInfo from './InteractionsFilterInfo';

describe('InteractionsFilterInfo', () => {
  beforeEach(() => {
    cy.clock(new Date('2020-10-12T03:24:00'));
  });

  const render = (props: React.ComponentProps<typeof InteractionsFilterInfo>) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <InteractionsFilterInfo {...props} />
        </LocalizationProvider>
      </ThemeProvider>,
    );
  };

  it('should show only date', () => {
    render({
      callId: null,
      segmentId: null,
      ani: null,
      dnis: null,
      dateFrom: '2020-10-10T04:00:00.000Z',
      dateTo: null,
    });
    cy.contains('p', 'Date:').should('exist').and('have.text', 'Date: from 10/10/2020 to 10/12/2020');
    cy.contains('p', 'Call Id:').should('not.exist');
    cy.contains('p', 'Segment Id:').should('not.exist');
    cy.contains('p', 'Phone Number (ANI):').should('not.exist');
    cy.contains('p', 'DNIS:').should('not.exist');
  });

  it('should show all data', () => {
    render({
      callId: '123',
      segmentId: 'test123',
      ani: '8888888888',
      dnis: '9999999999',
      dateFrom: '2020-10-10T04:00:00.000Z',
      dateTo: '2020-10-11T04:00:00.000Z',
    });
    cy.contains('p', 'Date:').should('exist').and('have.text', 'Date: from 10/10/2020 to 10/11/2020');
    cy.contains('p', 'Call Id:').should('exist').and('have.text', 'Call Id: 123');
    cy.contains('p', 'Segment Id:').should('exist').and('have.text', 'Segment Id: test123');
    cy.contains('p', 'Phone Number (ANI):').should('exist').and('have.text', 'Phone Number (ANI): (888) 888-8888');
    cy.contains('p', 'DNIS:').should('exist').and('have.text', 'DNIS: (999) 999-9999');
  });
});

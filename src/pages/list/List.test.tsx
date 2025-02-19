import * as React from 'react';
import { mount } from '@cypress/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { Container, ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { MemoryRouter, Route } from 'react-router-dom';
import List from './List';
import * as Player from './player/Player';
import CacheContextProvider from '../../utils/CacheContextProvider';
import * as InteractionsFilterInfo from '../../components/interactions/InteractionsFilterInfo';
import * as Five9FilterInfo from '../../components/five9/Five9FilterInfo';
import { Source } from '../../types';
import NetworkService from '../../network-service';
import * as InteractionsFilter from '../../components/interactions/InteractionsFilter';
import * as Five9Filter from '../../components/five9/Five9Filter';
import { five9Table } from '../../../cypress/support/selectors';

describe('List', () => {
  const getListUrl = (source: Source, page: number, size: number) =>
    `/audio/api/v1/filter/${source}?dateFrom=2021-07-02T08%3A57%3A36.000Z&page=${page}&size=${size}&sortField=dateOfCall&sortDirection=DESC`;

  before(() => {
    NetworkService.setupInterceptors();
  });

  beforeEach(() => {
    cy.clock(new Date('2020-10-12T03:24:00'));
    cy.stub(Player, 'default').returns('');
    cy.stub(InteractionsFilterInfo, 'default').returns('');
    cy.stub(InteractionsFilter, 'default').returns('');
    cy.stub(Five9FilterInfo, 'default').returns('');
    cy.stub(Five9Filter, 'default').returns('');
  });

  const render = (source: Source) => {
    const theme = createTheme({});
    return mount(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CacheContextProvider>
            <MemoryRouter initialEntries={[`/audio/list/${source}?dateFrom=2021-07-02T08%3A57%3A36.000Z`]}>
              <Route path="/audio/list/:source">
                <Container sx={{ height: 400 }}>
                  <List />
                </Container>
              </Route>
            </MemoryRouter>
          </CacheContextProvider>
        </LocalizationProvider>
      </ThemeProvider>,
    );
  };

  describe('Interactions', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        getListUrl(Source.INTERACTIONS, 0, 25),
        cy
          .stub()
          .as('getList25')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/interactionspage0size25.json' })),
      ).as('getList25Interceptor');
      cy.intercept(
        'GET',
        getListUrl(Source.INTERACTIONS, 0, 5),
        cy
          .stub()
          .as('getList5')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/interactionspage0size5.json' })),
      ).as('getList5Interceptor');
      cy.intercept(
        'GET',
        getListUrl(Source.INTERACTIONS, 1, 5),
        cy
          .stub()
          .as('getList5second')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/interactionspage1size5.json' })),
      ).as('getList5secondInterceptor');
    });

    it('should show empty list', () => {
      cy.intercept(
        'GET',
        getListUrl(Source.INTERACTIONS, 0, 25),
        cy
          .stub()
          .as('getList')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/emptyList.json' })),
      ).as('getListInterceptor');
      render(Source.INTERACTIONS);
      cy.wait('@getListInterceptor');
      cy.contains(`You're looking through Interactions files`);
      cy.get('table').find('tbody tr').should('have.length', 1).should('have.text', 'No Content');
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '0-0 of 0');
      cy.get('@getList').its('callCount').should('equal', 1);
    });

    it('should show right headers', () => {
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.get('table thead tr').first().find('th').eq(0).should('have.text', 'Call Id');
      cy.get('table thead tr').first().find('th').eq(1).should('have.text', 'Segment Id');
      cy.get('table thead tr').first().find('th').eq(2).should('have.text', 'Ani');
      cy.get('table thead tr').first().find('th').eq(3).should('have.text', 'Date of Call');
    });

    it('should show list', () => {
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.get('table').find('tbody tr').should('have.length', 25);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '1-25 of more than 25');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '2021042800000048406');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', 'd0b3364b75f44c3c09527e507a825c4a');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', '+1 (978) 313-7002');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', '04/28/2021 16:45:08');
      cy.get('@getList25').its('callCount').should('equal', 1);
    });

    it('should switch to 5 page size', () => {
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.contains('Rows per page').siblings('.MuiSelect-root').click();
      cy.selectOption('5');
      cy.wait('@getList5Interceptor');
      cy.get('table').find('tbody tr').should('have.length', 5);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '1-5 of more than 5');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '2021042800000048406');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', 'd0b3364b75f44c3c09527e507a825c4a');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', '+1 (978) 313-7002');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', '04/28/2021 16:45:08');
      cy.get('@getList25').its('callCount').should('equal', 1);
      cy.get('@getList5').its('callCount').should('equal', 1);
    });

    it('should go to second page', () => {
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.contains('Rows per page').siblings('.MuiSelect-root').click();
      cy.selectOption('5');
      cy.wait('@getList5Interceptor');
      cy.get('[aria-label="Go to next page"]').click();
      cy.wait('@getList5secondInterceptor');
      cy.get('table').find('tbody tr').should('have.length', 5);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '6-10 of more than 10');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '2021042800000046708');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', '12cb591b09dcfb38b702a604261f99cb');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', '+1 (678) 591-0124');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', '04/28/2021 15:52:57');
      cy.get('@getList25').its('callCount').should('equal', 1);
      cy.get('@getList5').its('callCount').should('equal', 1);
      cy.get('@getList5second').its('callCount').should('equal', 1);
    });

    it('should listen audio', () => {
      cy.intercept(
        'GET',
        '/audio/api/v1/interactions/getaudio/344',
        cy
          .stub()
          .as('getAudio')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'testaudio.mp3' })),
      ).as('getAudioInterceptor');
      let audio: HTMLAudioElement;
      cy.window().then((win) => {
        const OriginalAudio = win.Audio;
        cy.stub(win, 'Audio').callsFake((...args) => {
          const aud = new OriginalAudio(...args);
          audio = aud;
          return aud;
        });
      });
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.get('table tbody tr').first().find('td').eq(4).find('button').click();
      cy.wait('@getAudioInterceptor');
      cy.wait(500).then(() => {
        expect(audio.paused).eq(false);
      });
      cy.get('table tbody tr').first().find('td').eq(4).find('[data-testid="PlayArrowIcon"]').should('not.exist');
      cy.get('table tbody tr').first().find('td').eq(4).find('[data-testid="PauseIcon"]').should('exist');
      cy.get('table tbody tr')
        .first()
        .find('td')
        .eq(4)
        .find('button')
        .click()
        .then(() => {
          expect(audio.paused).eq(true);
        });
      cy.get('table tbody tr').first().find('td').eq(4).find('[data-testid="PlayArrowIcon"]').should('exist');
      cy.get('table tbody tr').first().find('td').eq(4).find('[data-testid="PauseIcon"]').should('not.exist');
      cy.get('@getAudio').its('callCount').should('equal', 1);
    });

    it('should hide download', () => {
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.get(five9Table.downloadButton).should('not.exist');
    });

    it('should show download', () => {
      cy.window().then((win) => {
        cy.fixture('jwtWithDownload').then((jwt) => win.localStorage.setItem('hub-jwt', jwt));
      });
      render(Source.INTERACTIONS);
      cy.wait('@getList25Interceptor');
      cy.get(five9Table.downloadButton).should('exist');
    });
  });

  describe('Five9', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        getListUrl(Source.FIVE9, 0, 25),
        cy
          .stub()
          .as('getList25')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/five9page0size25.json' })),
      ).as('getList25Interceptor');
      cy.intercept(
        'GET',
        getListUrl(Source.FIVE9, 0, 5),
        cy
          .stub()
          .as('getList5')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/five9page0size5.json' })),
      ).as('getList5Interceptor');
      cy.intercept(
        'GET',
        getListUrl(Source.FIVE9, 1, 5),
        cy
          .stub()
          .as('getList5second')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/five9page1size5.json' })),
      ).as('getList5secondInterceptor');
    });

    it('should show empty list', () => {
      cy.intercept(
        'GET',
        getListUrl(Source.FIVE9, 0, 25),
        cy
          .stub()
          .as('getList')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'list/emptyList.json' })),
      ).as('getListInterceptor');
      render(Source.FIVE9);
      cy.wait('@getListInterceptor');
      cy.contains(`You're looking through Five9 files`);
      cy.get('table').find('tbody tr').should('have.length', 1).should('have.text', 'No Content');
      cy.get('@getList').its('callCount').should('equal', 1);
    });

    it('should show right headers', () => {
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.get('table thead tr').first().find('th').eq(0).should('have.text', 'Call Id');
      cy.get('table thead tr').first().find('th').eq(1).should('have.text', 'Session Id');
      cy.get('table thead tr').first().find('th').eq(2).should('have.text', 'Agent');
      cy.get('table thead tr').first().find('th').eq(3).should('have.text', 'Campaign');
      cy.get('table thead tr').first().find('th').eq(4).should('have.text', 'Ani');
      cy.get('table thead tr').first().find('th').eq(5).should('have.text', 'Date of Call');
    });

    it('should show list', () => {
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.get('table').find('tbody tr').should('have.length', 25);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '1-25 of more than 25');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '25888705');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', '2F6267090B254DE69CFECED587BEC58E');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', 'CVT Jolisa Mackie');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', 'Verification Outbound');
      cy.get('table tbody tr').first().find('td').eq(4).should('have.text', '(716) 697-5331');
      cy.get('table tbody tr').first().find('td').eq(5).should('have.text', '08/30/2021 05:57:32');
      cy.get('@getList25').its('callCount').should('equal', 1);
    });

    it('should switch to 5 page size', () => {
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.contains('Rows per page').siblings('.MuiSelect-root').click();
      cy.selectOption('5');
      cy.wait('@getList5Interceptor');
      cy.get('table').find('tbody tr').should('have.length', 5);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '1-5 of more than 5');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '25888705');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', '2F6267090B254DE69CFECED587BEC58E');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', 'CVT Jolisa Mackie');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', 'Verification Outbound');
      cy.get('table tbody tr').first().find('td').eq(4).should('have.text', '(716) 697-5331');
      cy.get('table tbody tr').first().find('td').eq(5).should('have.text', '08/30/2021 05:57:32');
      cy.get('@getList25').its('callCount').should('equal', 1);
      cy.get('@getList5').its('callCount').should('equal', 1);
    });

    it('should go to second page', () => {
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.contains('Rows per page').siblings('.MuiSelect-root').click();
      cy.selectOption('5');
      cy.wait('@getList5Interceptor');
      cy.get('[aria-label="Go to next page"]').click();
      cy.wait('@getList5secondInterceptor');
      cy.get('table').find('tbody tr').should('have.length', 5);
      cy.get('.MuiTablePagination-displayedRows').should('have.text', '6-10 of more than 10');
      cy.get('table tbody tr').first().find('td').eq(0).should('have.text', '25877449');
      cy.get('table tbody tr').first().find('td').eq(1).should('have.text', 'D46D692B3FD44E34BE2C510E7B62BB90');
      cy.get('table tbody tr').first().find('td').eq(2).should('have.text', 'BGO Tim Israel');
      cy.get('table tbody tr').first().find('td').eq(3).should('have.text', 'Outbound TIL Abandonment - Predictive');
      cy.get('table tbody tr').first().find('td').eq(4).should('have.text', '(866) 615-6319');
      cy.get('table tbody tr').first().find('td').eq(5).should('have.text', '08/30/2021 01:06:55');
      cy.get('@getList25').its('callCount').should('equal', 1);
      cy.get('@getList5').its('callCount').should('equal', 1);
      cy.get('@getList5second').its('callCount').should('equal', 1);
    });

    it('should listen audio', () => {
      cy.intercept(
        'GET',
        '/audio/api/v1/five9/getaudio/1568',
        cy
          .stub()
          .as('getAudio')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'testaudio.mp3' })),
      ).as('getAudioInterceptor');
      let audio: HTMLAudioElement;
      cy.window().then((win) => {
        const OriginalAudio = win.Audio;
        cy.stub(win, 'Audio').callsFake((...args) => {
          const aud = new OriginalAudio(...args);
          audio = aud;
          return aud;
        });
      });
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.get('table tbody tr').first().find('td').eq(6).find('button').click();
      cy.wait('@getAudioInterceptor');
      cy.wait(500).then(() => {
        expect(audio?.paused).eq(false);
      });
      cy.get('table tbody tr').first().find('td').eq(6).find('[data-testid="PlayArrowIcon"]').should('not.exist');
      cy.get('table tbody tr').first().find('td').eq(6).find('[data-testid="PauseIcon"]').should('exist');
      cy.get('table tbody tr')
        .first()
        .find('td')
        .eq(6)
        .find('button')
        .click()
        .then(() => {
          expect(audio?.paused).eq(true);
        });
      cy.get('table tbody tr').first().find('td').eq(6).find('[data-testid="PlayArrowIcon"]').should('exist');
      cy.get('table tbody tr').first().find('td').eq(6).find('[data-testid="PauseIcon"]').should('not.exist');
      cy.get('@getAudio').its('callCount').should('equal', 1);
    });

    it('should hide download', () => {
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.get(five9Table.downloadButton).should('not.exist');
    });

    it('should show download', () => {
      cy.window().then((win) => {
        cy.fixture('jwtWithDownload').then((jwt) => win.localStorage.setItem('hub-jwt', jwt));
      });
      render(Source.FIVE9);
      cy.wait('@getList25Interceptor');
      cy.get(five9Table.downloadButton).should('exist');
    });
  });

  describe('Scroll', () => {
    beforeEach(() => {
      cy.intercept('GET', getListUrl(Source.FIVE9, 0, 25), { fixture: 'list/five9page0size25.json' }).as(
        'getList25InterceptorPage0',
      );
      cy.intercept('GET', getListUrl(Source.FIVE9, 1, 25), { fixture: 'list/five9page1size25.json' }).as(
        'getList25InterceptorPage1',
      );
    });

    it('should scroll to the top on page change', () => {
      render(Source.FIVE9);
      cy.wait('@getList25InterceptorPage0');
      cy.get('[aria-label="Go to next page"]').click();
      cy.wait('@getList25InterceptorPage1');
      cy.get('table thead').should('be.visible');
      cy.get('.MuiTableContainer-root').scrollTo('bottom');
      cy.get('table thead').should('not.be.visible');
      cy.get('[aria-label="Go to previous page"]').click();
      cy.get('table thead').should('be.visible');
    });
  });

  describe('Cache audio', () => {
    beforeEach(() => {
      cy.intercept('GET', getListUrl(Source.FIVE9, 0, 25), { fixture: 'list/five9page0size25.json' }).as('getList');
      cy.intercept(
        'GET',
        '/audio/api/v1/five9/getaudio/1568',
        cy
          .stub()
          .as('getAudioSpy')
          .callsFake((req) => req.reply({ statusCode: 200, fixture: 'testaudio.mp3' })),
      ).as('getAudio1');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1570', { fixture: 'testaudio.mp3' }).as('getAudio2');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1571', { fixture: 'testaudio.mp3' }).as('getAudio3');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1572', { fixture: 'testaudio.mp3' }).as('getAudio4');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1569', { fixture: 'testaudio.mp3' }).as('getAudio5');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1731', { fixture: 'testaudio.mp3' }).as('getAudio6');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1730', { fixture: 'testaudio.mp3' }).as('getAudio7');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1729', { fixture: 'testaudio.mp3' }).as('getAudio8');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1728', { fixture: 'testaudio.mp3' }).as('getAudio9');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1727', { fixture: 'testaudio.mp3' }).as('getAudio10');
      cy.intercept('GET', '/audio/api/v1/five9/getaudio/1726', { fixture: 'testaudio.mp3' }).as('getAudio11');
    });

    it('should cache audio', () => {
      render(Source.FIVE9);
      cy.wait('@getList');
      cy.get(five9Table.playButton).eq(0).click();
      cy.wait('@getAudio1');
      cy.get(five9Table.playButton).eq(1).click();
      cy.wait('@getAudio2');
      cy.get(five9Table.playButton).eq(0).click();
      cy.get(five9Table.playButton).eq(0).should('be.enabled');
      cy.get(five9Table.playButton).eq(0).click();
      cy.get('@getAudioSpy').its('callCount').should('equal', 1);
    });

    it('should cache audio only 10 audio', () => {
      render(Source.FIVE9);
      cy.wait('@getList');
      Array.from(Array(11).keys()).forEach((i) => {
        cy.get(five9Table.playButton).eq(i).click();
        cy.wait(`@getAudio${i + 1}`);
      });
      cy.get(five9Table.playButton).eq(0).click();
      cy.wait('@getAudio1');
      cy.get(five9Table.playButton).eq(0).should('be.enabled');
      cy.get(five9Table.playButton).eq(0).click();
      cy.get('@getAudioSpy').its('callCount').should('equal', 2);
    });
  });
});

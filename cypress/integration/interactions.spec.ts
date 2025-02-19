import { common, filterInfo, interactionsFilter, interactionsTable, player } from '../support/selectors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

describe('Interactions', () => {
  it('get List and update filter', () => {
    cy.clock(new Date('2020-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/interactions?*', {
      fixture: 'list/interactionssearchByCallId.json',
    }).as('getList');
    cy.visit('/audio/interactions');
    cy.get(interactionsFilter.callId).type('2021042800000047919');
    cy.get(interactionsFilter.segmentId).type('173cae2265eb22e7dec288e2d0e3955b');
    cy.get(interactionsFilter.ani).type('9783137000');
    cy.get(interactionsFilter.dateFrom).type('03/10/2020');
    cy.get(interactionsFilter.dateTo).type('10/12/2020');
    cy.clickButton('Submit');
    const search = `?callId=2021042800000047919&segmentId=173cae2265eb22e7dec288e2d0e3955b&ani=9783137000&dateFrom=${encodeURIComponent(
      '2020-03-10T04:00:00.000Z',
    )}&dateTo=${encodeURIComponent('2020-10-13T03:59:59.999Z')}`;
    cy.url().should('eq', `${Cypress.config().baseUrl}/audio/list/interactions${search}`);
    cy.wait('@getList');
    cy.get(filterInfo.container)
      .should('contain', 'Date: from 03/10/2020 to 10/12/2020')
      .should('contain', 'Phone Number (ANI): (978) 313-7000')
      .should('contain', 'Call Id: 2021042800000047919')
      .should('contain', 'Segment Id: 173cae2265eb22e7dec288e2d0e3955b');
    cy.get(interactionsTable.row).should('have.length', 1);
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.callIdCell).should('have.text', '2021042800000047919');
    cy.get(interactionsTable.row)
      .eq(0)
      .find(interactionsTable.segmentIdCell)
      .should('have.text', '173cae2265eb22e7dec288e2d0e3955b');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.aniCell).should('have.text', '+1 (978) 313-7000');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.dateCell).should('have.text', '04/28/2021 16:30:51');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.duration).should('have.text', '00:27');
    cy.clickButton('Update Parameters');
    cy.intercept('GET', '/audio/api/v1/filter/interactions?*', {
      fixture: 'list/interactionspage0size25.json',
    }).as('getList');
    cy.get(interactionsFilter.callId).should('have.value', '2021042800000047919').clear();
    cy.get(interactionsFilter.segmentId).should('have.value', '173cae2265eb22e7dec288e2d0e3955b').clear();
    cy.get(interactionsFilter.ani).should('have.value', '(978) 313-7000').clear();
    cy.get(interactionsFilter.dateFrom).should('have.value', '03/10/2020');
    cy.get(interactionsFilter.dateTo).should('have.value', '10/12/2020').clear();
    cy.clickButton('Submit');
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}/audio/list/interactions?dateFrom=${encodeURIComponent('2020-03-10T04:00:00.000Z')}`,
    );
    cy.wait('@getList');
    cy.get(filterInfo.container)
      .should('contain', 'Date: from 03/10/2020 to 10/14/2020')
      .should('not.contain', 'Phone Number (ANI)')
      .should('not.contain', 'Call Id')
      .should('not.contain', 'Segment Id');
    cy.get(interactionsTable.row).should('have.length', 25);
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.callIdCell).should('have.text', '2021042800000048406');
    cy.get(interactionsTable.row)
      .eq(0)
      .find(interactionsTable.segmentIdCell)
      .should('have.text', 'd0b3364b75f44c3c09527e507a825c4a');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.aniCell).should('have.text', '+1 (978) 313-7002');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.dateCell).should('have.text', '04/28/2021 16:45:08');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.duration).should('have.text', '00:27');
  });

  it('share audio', () => {
    cy.allowClipboardRead();
    cy.clock(new Date('2020-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/interactions?*', {
      fixture: 'list/interactionspage0size25.json',
    }).as('getList');
    cy.visit('/audio/list/interactions?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(filterInfo.container).should('contain', 'Date: from 03/10/2020 to 10/14/2020');
    cy.get(interactionsTable.row).should('have.length', 25);
    cy.get(interactionsTable.row).eq(1).find(interactionsTable.shareButton).click();
    cy.get(common.snackbar).should('be.visible').and('have.text', 'Link copied');
    cy.tick(3000);
    cy.get(common.snackbar).should('not.be.visible');
    cy.window()
      .then((win) => win.navigator.clipboard.readText())
      .then((text) => cy.visit(text));
    cy.get(filterInfo.container)
      .should('contain', 'Call Id: 2021042800000047919')
      .should('contain', 'Segment Id: 173cae2265eb22e7dec288e2d0e3955b');
  });

  it('play/pause audio', () => {
    cy.clock(new Date('2020-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/interactions?*', {
      fixture: 'list/interactionspage0size25.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/interactions/getaudio/344', {
      fixture: 'testaudio.mp3',
    }).as('getAudio');
    cy.visit('/audio/list/interactions?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(interactionsTable.row).should('have.length', 25);
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.playButton).click();
    cy.wait('@getAudio');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.pauseIcon).should('exist');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.playIcon).should('not.exist');
    cy.get(player.pause).should('be.enabled');
    cy.get(player.play).should('not.exist');
    cy.get(player.pause).click();
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.playIcon).should('exist');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.pauseIcon).should('not.exist');
    cy.get(player.play).should('be.enabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.play).click();
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.pauseIcon).should('exist');
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.playIcon).should('not.exist');
    cy.get(player.pause).should('be.enabled');
    cy.get(player.play).should('not.exist');
    cy.get(player.pause).click();
  });

  it('download audio', () => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
    cy.intercept('GET', '/audio/api/v1/filter/interactions?*', {
      fixture: 'list/interactionspage0size25.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/interactions/downloadaudio/344', {
      headers: {
        'content-disposition': 'attachment; filename=test344.mp3;',
      },
      fixture: 'testaudio.mp3',
    }).as('downloadAudio');
    cy.window().then((win) => {
      cy.fixture('jwtWithDownload').then((jwt) => win.localStorage.setItem('hub-jwt', jwt));
    });
    cy.visit('/audio/list/interactions?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(interactionsTable.row).should('have.length', 25);
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.downloadButton).click();
    cy.wait('@downloadAudio');

    const downloadedFilename = path.join(downloadsFolder, 'test344.mp3');

    cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should((buffer) => {
      expect(buffer.length).equal(764176);
    });
  });
});

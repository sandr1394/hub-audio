import { common, filterInfo, five9Filter, five9Table, interactionsTable, player } from '../support/selectors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

describe('Five9', () => {
  beforeEach(() => {
    cy.intercept('GET', '/audio/api/v1/campaign/all', {
      fixture: 'campaigns.json',
    }).as('getCampaigns');
  });

  it('get List and update filter', () => {
    cy.clock(new Date('2021-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/five9searchByCallId.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/agent/?agentInfo=*', {
      fixture: 'agents.json',
    }).as('getAgents');
    cy.visit('/audio/five9');
    cy.get(five9Filter.campaign).should('not.exist');
    cy.get(five9Filter.campaignLoading).should('exist');
    cy.wait('@getCampaigns');
    cy.get(five9Filter.campaign).should('exist');
    cy.get(five9Filter.campaignLoading).should('not.exist');
    cy.get(five9Filter.callId).type('25888706');
    cy.get(five9Filter.sessionId).type('C9830B6B78A3441291ED06BE68E67C99');
    cy.get(five9Filter.ani).type('8666156319');
    cy.get(five9Filter.agent).type('jack');
    cy.tick(300);
    cy.wait('@getAgents');
    cy.selectOption('Jack Black');
    cy.get(five9Filter.campaign).click().selectOption('Verification Outbound');
    cy.get(five9Filter.dateFrom).type('07/10/2021');
    cy.get(five9Filter.dateTo).type('10/12/2021');
    cy.clickButton('Submit');
    const search = `?callId=25888706&sessionId=C9830B6B78A3441291ED06BE68E67C99&ani=8666156319&agentId=100004&campaignId=100003&dateFrom=${encodeURIComponent(
      '2021-07-10T04:00:00.000Z',
    )}&dateTo=${encodeURIComponent('2021-10-13T03:59:59.999Z')}`;
    cy.url().should('eq', `${Cypress.config().baseUrl}/audio/list/five9${search}`);
    cy.wait('@getList');
    cy.get(filterInfo.container)
      .should('contain', 'Date: from 07/10/2021 to 10/12/2021')
      .should('contain', 'Phone Number (ANI): (866) 615-6319')
      .should('contain', 'Call Id: 25888706')
      .should('contain', 'Session Id: C9830B6B78A3441291ED06BE68E67C99')
      .should('contain', 'Agent: Jack Black')
      .should('contain', 'Campaign: Verification Outbound');
    cy.get(five9Table.row).should('have.length', 1);
    cy.get(five9Table.row).eq(0).find(five9Table.callIdCell).should('have.text', '25888706');
    cy.get(five9Table.row).eq(0).find(five9Table.sessionIdCell).should('have.text', 'C9830B6B78A3441291ED06BE68E67C99');
    cy.get(five9Table.row).eq(0).find(five9Table.aniCell).should('have.text', '(866) 615-6319');
    cy.get(five9Table.row).eq(0).find(five9Table.agentCell).should('have.text', 'Jack Black');
    cy.get(five9Table.row).eq(0).find(five9Table.campaignCell).should('have.text', 'Verification Outbound');
    cy.get(five9Table.row).eq(0).find(five9Table.dateCell).should('have.text', '08/30/2021 05:47:39');
    cy.get(five9Table.row).eq(0).find(five9Table.duration).should('have.text', '00:27');
    cy.clickButton('Update Parameters');
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/five9page0size25.json',
    }).as('getList');
    cy.get(five9Filter.callId).should('have.value', '25888706').clear();
    cy.get(five9Filter.sessionId).should('have.value', 'C9830B6B78A3441291ED06BE68E67C99').clear();
    cy.get(five9Filter.ani).should('have.value', '(866) 615-6319').clear();
    cy.get(five9Filter.agent).should('have.value', 'Jack Black').clear();
    cy.get(five9Filter.campaign).should('have.value', 'Verification Outbound').clear().blur();
    cy.get(five9Filter.dateFrom).should('have.value', '07/10/2021');
    cy.get(five9Filter.dateTo).should('have.value', '10/12/2021').clear();
    cy.clickButton('Submit');
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}/audio/list/five9?dateFrom=${encodeURIComponent('2021-07-10T04:00:00.000Z')}`,
    );
    cy.wait('@getList');
    cy.get(filterInfo.container)
      .should('contain', 'Date: from 07/10/2021 to 10/14/2021')
      .should('not.contain', 'Phone Number (ANI)')
      .should('not.contain', 'Call Id')
      .should('not.contain', 'Campaign')
      .should('not.contain', 'Agent')
      .should('not.contain', 'Session Id');
    cy.get(five9Table.row).should('have.length', 25);
    cy.get(five9Table.row).eq(0).find(five9Table.callIdCell).should('have.text', '25888705');
    cy.get(five9Table.row).eq(0).find(five9Table.sessionIdCell).should('have.text', '2F6267090B254DE69CFECED587BEC58E');
    cy.get(five9Table.row).eq(0).find(five9Table.aniCell).should('have.text', '(716) 697-5331');
    cy.get(five9Table.row).eq(0).find(five9Table.agentCell).should('have.text', 'CVT Jolisa Mackie');
    cy.get(five9Table.row).eq(0).find(five9Table.campaignCell).should('have.text', 'Verification Outbound');
    cy.get(five9Table.row).eq(0).find(five9Table.dateCell).should('have.text', '08/30/2021 05:57:32');
    cy.get(five9Table.row).eq(0).find(five9Table.duration).should('have.text', '00:27');
  });

  it('loads agents and campaigns', () => {
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/emptyList.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/agent/?agentInfo=*', {
      fixture: 'agents.json',
    }).as('getAgents');
    cy.intercept('GET', '/audio/api/v1/agent/100003', {
      fixture: 'agent100003.json',
      delay: 3000,
    }).as('getAgent');
    cy.intercept('GET', '/audio/api/v1/campaign/all', {
      fixture: 'campaigns.json',
      delay: 3000,
    }).as('getCampaigns');
    cy.visit('/audio/list/five9?agentId=100003&campaignId=100003');
    cy.get(filterInfo.container).should('contain', 'Agent:').should('contain', 'Campaign:');
    cy.get(filterInfo.agentLoading).should('exist');
    cy.get(filterInfo.campaignLoading).should('exist');
    cy.clickButton('Update Parameters');
    cy.get(five9Filter.agentLoading).should('exist');
    cy.get(five9Filter.campaignLoading).should('exist');
    cy.wait('@getAgent');
    cy.get(five9Filter.agentLoading).should('not.exist');
    cy.get(five9Filter.campaignLoading).should('not.exist');
    cy.get(five9Filter.agent).should('have.value', 'Jack Smith');
    cy.get(five9Filter.campaign).should('have.value', 'Verification Outbound');
    cy.get('.MuiBackdrop-root').click({ force: true });
    cy.get(filterInfo.agentLoading).should('not.exist');
    cy.get(filterInfo.campaignLoading).should('not.exist');
    cy.get(filterInfo.container)
      .should('contain', 'Agent: Jack Smith')
      .should('contain', 'Campaign: Verification Outbound');
  });

  it('share audio', () => {
    cy.allowClipboardRead();
    cy.clock(new Date('2020-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/five9page0size25.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/segment/1570', {
      fixture: 'list/five9element.json',
    }).as('getElement');
    cy.visit('/audio/list/five9?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(filterInfo.container).should('contain', 'Date: from 03/10/2020 to 10/14/2020');
    cy.get(five9Table.row).should('have.length', 25);
    cy.get(five9Table.row).eq(1).find(five9Table.shareButton).click();
    cy.get(common.snackbar).should('be.visible').and('have.text', 'Link copied');
    cy.tick(3000);
    cy.get(common.snackbar).should('not.be.visible');
    cy.window()
      .then((win) => win.navigator.clipboard.readText())
      .then((text) => cy.visit(text));
    cy.get(filterInfo.container)
      .should('contain', 'Call Id: 25888706')
      .should('contain', 'Session Id: C9830B6B78A3441291ED06BE68E67C99');
  });

  it('play/pause audio', () => {
    cy.clock(new Date('2020-10-14T03:24:00'));
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/five9page0size25.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/five9/getaudio/1568', {
      fixture: 'testaudio.mp3',
    }).as('getAudio');
    cy.visit('/audio/list/five9?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(five9Table.row).should('have.length', 25);
    cy.get(five9Table.row).eq(0).find(five9Table.playButton).click();
    cy.wait('@getAudio');
    cy.get(five9Table.row).eq(0).find(five9Table.pauseIcon).should('exist');
    cy.get(five9Table.row).eq(0).find(five9Table.playIcon).should('not.exist');
    cy.get(player.pause).should('be.enabled');
    cy.get(player.play).should('not.exist');
    cy.get(player.pause).click();
    cy.get(five9Table.row).eq(0).find(five9Table.playIcon).should('exist');
    cy.get(five9Table.row).eq(0).find(five9Table.pauseIcon).should('not.exist');
    cy.get(player.play).should('be.enabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.play).click();
    cy.get(five9Table.row).eq(0).find(five9Table.pauseIcon).should('exist');
    cy.get(five9Table.row).eq(0).find(five9Table.playIcon).should('not.exist');
    cy.get(player.pause).should('be.enabled');
    cy.get(player.play).should('not.exist');
    cy.get(player.pause).click();
  });

  it('download audio', () => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
    cy.intercept('GET', '/audio/api/v1/filter/five9?*', {
      fixture: 'list/five9page0size25.json',
    }).as('getList');
    cy.intercept('GET', '/audio/api/v1/five9/downloadaudio/1568', {
      headers: {
        'content-disposition': 'attachment; filename=test1568.mp3;',
      },
      fixture: 'testaudio.mp3',
    }).as('downloadAudio');
    cy.window().then((win) => {
      cy.fixture('jwtWithDownload').then((jwt) => win.localStorage.setItem('hub-jwt', jwt));
    });
    cy.visit('/audio/list/five9?dateFrom=2020-03-10T08%3A42%3A06.000Z');
    cy.get(interactionsTable.row).should('have.length', 25);
    cy.get(interactionsTable.row).eq(0).find(interactionsTable.downloadButton).click();
    cy.wait('@downloadAudio');

    const downloadedFilename = path.join(downloadsFolder, 'test1568.mp3');

    cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should((buffer) => {
      expect(buffer.length).equal(764176);
    });
  });
});

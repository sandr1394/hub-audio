// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('clickButton', (text: string) => {
  cy.get('button').contains(text).click();
});

Cypress.Commands.add('selectOption', (text: string) => {
  cy.get('li[role="option"]').contains(text).click();
  cy.tick(500);
});

Cypress.Commands.add('getError', { prevSubject: 'element' }, (subject) => {
  return subject.parent('.MuiFormControl-root, .MuiGrid-root').find('.Mui-error');
});

Cypress.Commands.add('login', () => {
  cy.request({
    url: 'https://simplicity.qa32.circleone.com/graphql/',
    method: 'POST',
    body: {
      query:
        '\nquery hubLogin($username: String, $password: String) {\n  hubLogin(username: $username, password: $password)\n}',
      variables: { username: 'qaautomation1', password: 'Pro5p3r!7822' },
    },
  }).then((response: any) => {
    cy.window().then((window) => {
      window.localStorage.setItem('hub-jwt', response.body.data.hubLogin);
    });
  });
});

Cypress.Commands.add('allowClipboardRead', () => {
  cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        // make the permission tighter by allowing the current origin only
        // like "http://localhost:56978"
        origin: window.location.origin,
      },
    }),
  );
});

Cypress.Commands.add('mockOptimizely', () => {
  cy.intercept('GET', '/optimizelyproxy/v1/datafiles', {
    statusCode: 404,
  });
});

export {};

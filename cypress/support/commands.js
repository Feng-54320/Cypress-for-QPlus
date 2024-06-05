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

//封装自定义命令：

//登陆命令：loginCommand()
import LoginPage from "../e2e/page/login_page.cy";

Cypress.Commands.add("loginCommand", () => {
  let loginPage;
  let qplusUrl;

  cy.fixture("/env/qplus_url.json").then((data) => {
    qplusUrl = data.url;
  });

  cy.fixture("/locator/loginpage_elements.json").then((elements) => {
    loginPage = new LoginPage(elements);
    loginPage.visitQplus(qplusUrl);
    loginPage.typeUsername("admin");
    loginPage.typePassword("Passw0rd!");
    loginPage.typeCaptcha("$$$$");
    loginPage.clickLoginButton();
  });
});

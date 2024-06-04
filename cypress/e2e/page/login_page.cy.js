import qAssert from '../../support/qassert.js';

class LoginPage {
    constructor(loginElements){
        this.elements = loginElements;
    }

    visitQplus(url) {
        cy.visit(url);
        cy.get(this.elements.login_text)
        .should('have.text', '登录')
    }

    typeUsername(username) {
        cy.get(this.elements.username_inputbox)
        .type(username)
        .should('have.value', username)

    }

    typePassword(pwd) {
        cy.get(this.elements.password_inputbox)
        .type(pwd)
        .should('have.value', pwd)
    }

    typeCaptcha(captcha){
        cy.get(this.elements.captcha_inputbox)
        .type(captcha)
        .should('have.value', captcha)
    }

    clickLoginButton(){
        cy.get(this.elements.login_button)
        .click()
    }

    assertLogin(){
        qAssert.assertText(this.elements.qplus_control_panel, 'QPlus 控制台', 'be.visible', 'exist')
    }
}

export default LoginPage;
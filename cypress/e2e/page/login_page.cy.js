import qAssert from "../../support/qassert.js";

class LoginPage {
  constructor(loginElements) {
    this.elements = loginElements;
  }

  //访问Qplus
  visitQplus(url) {
    cy.visit(url);
    cy.get(this.elements.login_text, { timeout: 10000 }).should(
      "have.text",
      "登录"
    );
  }

  //输入登录用户
  typeUsername(username) {
    cy.get(this.elements.username_inputbox)
      .type(username)
      .should("have.value", username);
  }

  //输入密码
  typePassword(pwd) {
    cy.get(this.elements.password_inputbox).type(pwd).should("have.value", pwd);
  }

  //输入验证码
  typeCaptcha(captcha) {
    cy.get(this.elements.captcha_inputbox)
      .type(captcha)
      .should("have.value", captcha);
  }

  //点击登录
  clickLoginButton() {
    cy.get(this.elements.login_button).click();
  }

  //断言登录成功
  assertLogin() {
    qAssert.assertTextExist(this.elements.qplus_control_panel, "QPlus 控制台");
  }
}

export default LoginPage;

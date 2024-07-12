import LoginPage from "../page/login_page.cy";

describe("module：验证登录功能", () => {
  let loginPage;
  let login_url;
  let valid_user;
  let invalid_user;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  before(() => {
    cy.fixture("/locator/loginpage_elements.json").then((elements) => {
      loginPage = new LoginPage(elements);
    });

    cy.fixture("/env/qplus_url.json").then((data) => {
      login_url = data.url;
    });

    cy.fixture("/data/user.json").then((datas) => {
      valid_user = datas[1];
    });

    cy.fixture("/data/user.json").then((datas) => {
      invalid_user = datas[2];
    });
  });

  //用例前置：访问url
  beforeEach(() => {
    cy.visit("10.10.90.37:21080")
  });

  //用例1
  it("case 1： 验证合法用户名登录", () => {
    //step1: 输入合法用户名
    loginPage.typeUsername(valid_user.name);
    //step2: 输入合法密码
    loginPage.typePassword(valid_user.pwd);
    //等待10s
    loginPage.typeCaptcha("$$$$");
    //step3: 点击登陆
    loginPage.clickLoginButton();
    //step4: 断言登录成功
    loginPage.assertLogin();
  });

  //用例2
  it.skip("case 1： 验证非法用户名登录", () => {
    loginPage.typeUsername(invalid_user.name);
    loginPage.typePassword(invalid_user.pwd);
    loginPage.typeCaptcha("$$$$");
    loginPage.clickLoginButton();
    loginPage.assertLogin();
  });
});

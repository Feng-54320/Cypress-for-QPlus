import qAssert from "../../../../support/qassert";
class SrcDBConfigPage {
  constructor(gsElements) {
    this.elements = gsElements;
  }

  //点击GS数据保护
  clickGaussDB() {
    cy.log("点击GS数据保护");
    cy.get(this.elements.gs_panel).should("have.text", "GaussDB").click();
    cy.get(this.elements.data_protect).should("have.text", "数据保护").click();
  }

  //断言创建备库按钮存在并点击
  assertCreateBakDBButton() {
    cy.log("断言创建备库按钮存在并点击");
    qAssert.assertButtonYes(this.elements.create_bakDB);
    cy.get(this.elements.create_bakDB).click();
  }

  typeOBSrcInfo() {
    cy.log("输入源库配置信息");
    cy.fixture("/env/gaussdb_env.json").then((env) => {
      cy.get(this.elements.gs_ip).type(env.ip);
      cy.get(this.elements.gs_port).clear().type(env.port);
      cy.get(this.elements.dba_account).clear().type(env.dba_account);
      cy.get(this.elements.dba_password).clear().type(env.dba_password);
    });
  }

  //断言测试连接按钮可用,并点击
  clickTestConnButton() {
    cy.log("断言测试连接按钮可用,并点击");
    qAssert.assertButtonYes(this.elements.test_conn_button);
    cy.get(this.elements.test_conn_button).click();
  }

  //断言测试连接成功
  assertConnDB() {
    cy.log("断言测试连接成功");
    qAssert.assertTextExist(this.elements.conn_success, "连接成功");
  }


  //断言出现数据库版本
  assertDBVersion() {
    cy.log("断言出现数据库版本");
    qAssert.assertTextExist(this.elements.db_version, "503");
  }

  //断言下一步可用,并点击
  clickNextStepButton() {
    cy.log("断言下一步可用,并点击");
    qAssert.assertButtonYes(this.elements.next_step_button);
    cy.get(this.elements.next_step_button).click();
  }
}
export default SrcDBConfigPage;

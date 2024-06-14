import qAssert from "../../../../support/qassert";
class SrcDBConfigPage {
  constructor(obelements) {
    this.elements = obelements;
  }

  //点击OB数据保护
  clickOceanBase() {
    cy.log("点击OB数据保护");
    cy.get(this.elements.ob_panel).should("have.text", "OceanBase").click();
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
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.ob_ip).type(obEnv.ip);
      cy.get(this.elements.ob_port).clear().type(obEnv.port);
      cy.get(this.elements.rpc_ip).clear().type(obEnv.rpc_ip);
      cy.get(this.elements.rpc_port).clear().type(obEnv.rpc_port);
      cy.get(this.elements.sys_tenant_name).type(obEnv.sys_tenant_name);
      cy.get(this.elements.sys_tenant_password).type(obEnv.sys_tenant_password);
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
    cy.wait(5000);
    qAssert.assertTextExist(this.elements.conn_success, "连接成功");
  }

  //选择租户
  selectBakTenant() {
    cy.log("选择租户");
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.bak_tenant).type(`${obEnv.bak_tenant}{enter}`);
    });
  }

  //断言出现数据库版本
  assertDBVersion() {
    cy.log("断言出现数据库版本");
    qAssert.assertTextExist(this.elements.db_version, "数据库版本: ");
  }

  //断言下一步可用,并点击
  clickNextStepButton() {
    cy.log("断言下一步可用,并点击");
    qAssert.assertButtonYes(this.elements.next_step_button);
    cy.get(this.elements.next_step_button).click();
  }
}
export default SrcDBConfigPage;

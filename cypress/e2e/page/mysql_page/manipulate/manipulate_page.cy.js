import qAssert from "../../../../support/qassert.js";

class ManipulatePage {
  constructor(MpElements) {
    this.elements = MpElements;
  }

  //关闭数据库
  clickCloseBakDB() {
    cy.log("关闭备库,并断言");
    cy.get(this.elements.close_bakdb_button).eq(0).click();
    cy.get(this.elements.close_confirm_button).click();
    qAssert.assertBakDBStatus(this.elements.bakdb_status, "已关闭");
  }

  //启动数据库
  clickStartUPBakDB() {
    cy.log("启动备库,并断言");
    cy.get(this.elements.startup_bakdb_button).eq(0).click();
    qAssert.assertBakDBStatus(this.elements.bakdb_status, "已启动");
  }

  //点击创建快照
  clickCreateSnapshot(name = "AutoSnapshot") {
    cy.log("创建快照");
    cy.get(this.elements.more_button).eq(0).click();
    cy.contains("创建快照").click();
    cy.get(this.elements.snapshot_name).type(name);
    cy.get(this.elements.confirm_button).click();
  }

  //断言创建快照成功
  assertSnapSuccess() {
    cy.log("断言快照创建成功");
    qAssert.assertTextExist(this.elements.snap_success, "创建快照成功");
    cy.get(this.elements.bakdb_status).eq(0).contains("备份中");
  }

  //关闭快照库
  clickCloseSnapshotDB() {
    cy.log("关闭快照库");
    cy.get(this.elements.close_snapshot_db_button).eq(0).click();
    cy.get(this.elements.close_confirm_button).click();
    qAssert.assertBakDBStatus(this.elements.snapshot_db_status, "已关闭");
  }

  //开启快照库
  clickStartupSnapshotDB() {
    cy.log("开启快照库");
    cy.get(this.elements.startup_snapshot_db_button).eq(0).click();
    qAssert.assertBakDBStatus(this.elements.snapshot_db_status, "已启动");
  }

  //关闭开发测试库
  clickCloseDevTestDB() {
    cy.log("关闭开发测试库");
    cy.get(this.elements.close_snapshot_db_button).eq(0).click();
    cy.get(this.elements.close_confirm_button).click();
    qAssert.assertBakDBStatus(this.elements.dev_test_db_status, "已关闭");
  }

  //开启开发测试库
  clickStartupDevTestDB() {
    cy.log("开启开发测试库");
    cy.get(this.elements.startup_snapshot_db_button).eq(0).click();
    qAssert.assertBakDBStatus(this.elements.dev_test_db_status, "已启动");
  }
}
export default ManipulatePage;

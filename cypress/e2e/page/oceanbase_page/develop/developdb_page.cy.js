import qAssert from "../../../../support/qassert";
import Utils from "../../../../support/utils";

class DevelopDBPage {
  constructor(obElements) {
    this.elements = obElements;
  }

  //点击ob的开发测试库
  clickDevlopDB() {
    cy.get(this.elements.ob_panel).should("have.text", "OceanBase").click();
    cy.get(this.elements.develop_db).should("have.text", "开发测试库").click();
  }

  //断言创建开发测试库按钮存在, 并点击
  assertCreateDevelopDBButton() {
    qAssert.assertButtonYes(this.elements.create_devdb_button);
    cy.get(this.elements.create_devdb_button).click();
  }

  //输入开发测试库名称
  typeDevelopDBName(name = "AutoDevlopDB") {
    cy.get(this.elements.devdb_name).type(name);
  }

  //选择源备库
  selectSrcBakDB(name = "AutoTestOB") {
    cy.get(this.elements.src_bakdb)
      .click()
      .then(() => {
        cy.contains(name).eq(0).click();
      });
  }

  //选择网络
  selectNet() {}

  //选择ip分配方式
  selectIP() {}

  //选择规格
  selectDBScale(cpu = 2, memory = 4) {
    cy.log("选择备库规格");
    let scale = cpu + "Core" + memory + "Gi";

    cy.get(this.elements.select_scale)
      .click()
      .then(() => {
        cy.contains(scale).click();
      });
  }

  //增加数据存储上限
  clickDataStoraAddButton(times = 9) {
    Utils.clickButtonMultipleTimes(
      this.elements.data_storage_add_button,
      times
    );
  }

  //增加redo存储
  clickRedoAddButton(times = 0) {
    Utils.clickButtonMultipleTimes(
      this.elements.redo_storage_add_button,
      times
    );
  }

  //选择读写方式, 参数param可选: 可读写, 只读
  clickReadWrite(param) {
    cy.contains(param).click();
  }

  //选择恢复备份点
  selectSnapshot(name = "AutoSnapshot") {
    cy.get(this.elements.select_snapshot)
      .click()
      .then(() => {
        cy.contains(name).click();
      });
  }

  //点击确认按钮
  clickConfirmButton() {
    cy.get(this.elements.confirm_button).click();
  }

  //断言创建成功
  assertCreateDevDBSuccess() {
    cy.get(this.elements.progress_log).contains("SUCCESS");
  }

  //点击日志进度的确认按钮
  clickLogConfirmButton() {
    cy.get(this.elements.log_confirm_button).click();
  }

  //断言启动成功
  assertStartupSuccess() {
    cy.get(this.elements.status).eq(0).contains("已启动");
  }
}
export default DevelopDBPage;

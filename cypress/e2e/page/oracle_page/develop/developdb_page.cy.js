import qAssert from "../../../../support/qassert";
import Utils from "../../../../support/utils";

class DevelopDBPage {
  constructor(oracleElements) {
    this.elements = oracleElements;
  }

  //点击oracle的开发测试库
  clickDevlopDB() {
    cy.get(this.elements.oracle_panel).should("have.text", "Oracle").click();
    cy.get(this.elements.develop_db).should("have.text", "开发测试库").click();
  }

  //断言恢复数据库按钮存在, 并点击
  assertCreateDevelopDBButton() {
    qAssert.assertButtonYes(this.elements.create_devdb_button);
    cy.get(this.elements.create_devdb_button).click();
  }

  //输入开发测试库名称
  typeDevelopDBName() {
    cy.get(this.elements.devdb_name).type("AutoDevlopDB");
  }

  //选择源备库
  selectSrcBakDB() {
    cy.get(this.elements.src_bakdb)
      .click()
      .then(() => {
        cy.contains("FengAutoTest").click();
      });
  }

  //选择网络
  selectNet() {}

  //选择ip分配方式
  selectIP() {}

  //规格选择
  selectDBScale() {
    cy.get(this.elements.select_scale)
      .click()
      .then(() => {
        cy.contains("2Core4Gi").click();
      });
  }

  //增加数据存储上限
  clickDataStoraAddButton(times = 0) {
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
  selectSnapshot() {
    cy.get(this.elements.select_snapshot)
      .click()
      .then(() => {
        cy.contains("定时快照").click();
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
}
export default DevelopDBPage;

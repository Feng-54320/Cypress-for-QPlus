import qAssert from "../../../../support/qassert";
import Utils from "../../../../support/utils.js";

class RecoveryDBPage {
  constructor(obElements) {
    this.elements = obElements;
  }

  //点击OB数据恢复
  clickOceanBase() {
    cy.log("点击OB数据恢复");
    cy.get(this.elements.ob_panel).should("have.text", "OceanBase").click();
    cy.get(this.elements.data_recovery).should("have.text", "数据恢复").click();
  }

  //断言恢复数据库按钮存在
  assertRecoveryButton() {
    qAssert.assertButtonYes(this.elements.recovery_db_button);
  }

  //点击恢复数据库按钮
  clickRecoveryButton() {
    cy.get(this.elements.recovery_db_button).click();
  }

  //点击时间点恢复
  clickTimeRecovery() {
    cy.contains("时间点恢复").click();
  }

  //点击备份点恢复
  clickBakRecovery() {
    cy.contains("备份点恢复").click();
  }

  //输入快照库名
  typeRecoveryDBName() {
    cy.get(this.elements.recovery_db_name).type("AutoRCY_Time");
  }

  //选择源备库
  selectSrcBakDB(name = "AutoTestOB") {
    cy.get(this.elements.src_bak_db)
      .click()
      .then(() => {
        cy.contains(name).click();
      });
  }

  //选择规格
  selectSnapDBScale(cpu = 8, memory = 8) {
    cy.log("选择备库规格");
    let scale = cpu + "Core" + memory + "Gi";

    cy.get(this.elements.select_scale)
      .click()
      .then(() => {
        cy.contains(scale).click();
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

  getTimeLimit() {
    cy.get(this.elements.time_limit)
      .invoke("text")
      .then((text) => {
        cy.log(text);
      });
  }

  clickConfirmButton() {
    cy.get(this.elements.confirm_button).click();
  }

  assertCreateRCYDBSuccess() {
    cy.get(this.elements.progress_log).contains("SUCCESS");
  }

  clickLogConfirmButton() {
    cy.get(this.elements.log_confirm_button).click();
  }

  //断言启动成功
  assertStartupSuccess() {
    cy.get(this.elements.status).eq(0).contains("已启动");
  }

}
export default RecoveryDBPage;

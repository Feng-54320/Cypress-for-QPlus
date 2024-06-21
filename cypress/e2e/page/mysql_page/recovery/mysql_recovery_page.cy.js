import qAssert from "../../../../support/qassert";
import Utils from "../../../../support/utils.js";

class RecoveryDBPage {
  constructor(mysqlElements) {
    this.elements = mysqlElements;
  }

  //点击数据恢复
  clickMysql() {
    cy.get(this.elements.mysql_panel).should("have.text", "MySQL").click();
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
  selectSrcBakDB() {
    cy.get(this.elements.src_bak_db)
      .click()
      .then(() => {
        cy.contains("AutoTest").click();
      });
  }

  //选择规格
  selectSnapDBScale() {
    cy.get(this.elements.scale_input)
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

  getTimeLimit() {
    cy.get(this.elements.time_limit).invoke("text").then((text) =>{
        cy.log(text);
    })
  }

  clickConfirmButton(){
    cy.get(this.elements.confirm_button).click();
  }

  assertCreateRCYDBSuccess(){
    cy.get(this.elements.progress_log).contains("SUCCESS");
  }

  clickLogConfirmButton(){
    cy.get(this.elements.log_confirm_button).click();
  }

}
export default RecoveryDBPage;

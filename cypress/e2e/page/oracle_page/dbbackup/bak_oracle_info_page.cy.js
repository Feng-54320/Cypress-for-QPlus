import Utils from "../../../../support/utils.js";

class BakOracleInfoPage {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
    cy.fixture("/env/oracle_env.json").then((env) => {
      this.OracleHome = env.oracle_home;
    });
  }
  //输入备库名
  typeBakDBName() {
    cy.get(this.elements.bakDB_name).type("FengAutoTest");
  }

  //选择备库规格
  selectComputerInstance() {
    cy.get(this.elements.computer_box)
      .click()
      .then(() => {
        cy.get(this.elements.computer_dropdown).contains("2Core4Gi").click();
      });
  }

  //选择网络地址池
  selectAddressPool() {}

  //清空redo空间, 恢复成1
  typeRedoZone() {
    cy.get(this.elements.redo_zone).clear();
  }

  //清空data空间, 再点两次加号按钮
  typeDataZone() {
    cy.get(this.elements.data_zone).clear();
    Utils.clickButtonMultipleTimes(this.elements.data_zone_add, 2);
  }

  //清空archive空间, 恢复成1
  typeArchiveZone() {
    cy.get(this.elements.archive_zone).clear();
  }

  //点击下一步
  clickNextStep() {
    cy.get(this.elements.next_step_button).click();
  }
}
export default BakOracleInfoPage;

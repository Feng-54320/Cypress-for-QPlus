import Utils from "../../../../support/utils.js";

class BakOracleInfoPage {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
    cy.fixture("/env/oracle_env.json").then((env) => {
      this.OracleHome = env.oracle_home;
    });
  }
  //输入备库名
  typeBakDBName(name = "AutoTestOrac") {
    cy.log("输入备库名");
    cy.get(this.elements.bakDB_name).type(name);
  }

  //选择备库规格
  selectComputerInstance(cpu = 2, memory = 4) {
    cy.log("选择备库规格");
    let scale = cpu + "Core" + memory + "Gi";

    cy.get(this.elements.select_scale)
      .click()
      .then(() => {
        cy.contains(scale).click();
      });
  }

  //选择网络地址池
  selectAddressPool() {}

  //清空redo空间, 恢复成1
  typeRedoZone(times = 0) {
    cy.log("增加redo空间");
    Utils.clickButtonMultipleTimes(this.elements.redo_add_button, times);
  }

  //清空data空间, 再点两次加号按钮
  typeDataZone(times = 8) {
    cy.log("增加数据卷空间");
    Utils.clickButtonMultipleTimes(this.elements.data_add_button, times);
  }

  //清空archive空间, 恢复成1
  typeArchiveZone(times = 0) {
    cy.log("增加archive空间");
    Utils.clickButtonMultipleTimes(this.elements.archive_add_button, times);
  }

  //点击下一步
  clickNextStep() {
    cy.log("点击下一步");
    cy.get(this.elements.next_step_button).click();
  }
}
export default BakOracleInfoPage;

import Utils from "../../../../support/utils.js";

class BakMysqlInfoPage {
  constructor(mysqlDBElements) {
    this.elements = mysqlDBElements;
    cy.fixture("/env/mysql_env.json").then((env) => {
      this.mysqlconf = env.config_Path;
    });
  }

  typeBakDBName(name = "AutoTestMySQL") {
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
  selectAddressPool() {}

  typeDataZone() {
    cy.get(this.elements.data_zone).clear();
    Utils.clickButtonMultipleTimes(this.elements.data_zone_add, 5);
  }
  typeLogZone() {
    cy.get(this.elements.log_zone).clear();
    Utils.clickButtonMultipleTimes(this.elements.log_zone_add, 5);
  }

  clickSubmit() {
    cy.get(this.elements.submit_button).click();
  }
  clickConfirm() {
    cy.get(this.elements.confirm_button).click();
  }

  //断言创建成功
  assertCreateSuccess(){
    cy.get(this.elements.progress_log).contains("SUCCESS");
  }
}
export default BakMysqlInfoPage;

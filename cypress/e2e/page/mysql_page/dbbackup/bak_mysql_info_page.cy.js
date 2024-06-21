import Utils from "../../../../support/utils.js";

class BakMysqlInfoPage {
  constructor(mysqlDBElements) {
    this.elements = mysqlDBElements;
    cy.fixture("/env/mysql_env.json").then((env) => {
      this.mysqlconf = env.config_Path;
    });
  }

  typeBakDBName() {
    cy.get(this.elements.bakDB_name).type("AutoTest");
  }

  selectComputerInstance() {
    cy.get(this.elements.computer_box)
      .click()
      .then(() => {
        cy.get(this.elements.computer_dropdown).contains("2Core4Gi").click();
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
}
export default BakMysqlInfoPage;

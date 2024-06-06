import Utils from "../../../support/utils.js";
class BakOracleInfoPage {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
  }

  typeBakDBName() {
    cy.get(this.elements.bakDB_name).type("FengAutoTest");
  }

  selectComputerInstance() {
    cy.get(this.elements.computer_box)
      .click()
      .then(() => {
        cy.get(this.elements.computer_dropdown).contains("2Core4Gi").click();
      });
  }

  selectAddressPool() {}

  typeRedoZone() {
    cy.get(this.elements.redo_zone).clear();
  }

  typeDataZone() {
    cy.get(this.elements.data_zone).clear();
    Utils.clickButtonMultipleTimes(this.elements.data_zone_add, 2);
  }

  typeArchiveZone() {
    cy.get(this.elements.archive_zone).clear();
  }

  clickNextStep(){
    cy.get(this.elements.next_step_button).click();
  }
}
export default BakOracleInfoPage;

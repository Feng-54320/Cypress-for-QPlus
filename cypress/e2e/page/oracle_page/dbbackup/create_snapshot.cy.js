import qAssert from "../../../../support/qassert.js";
class CreateSnapshotPage {
  constructor(oracleElements) {
    this.elements = oracleElements;
  }

  //点击创建快照
  clickCreateSnapshot() {
    cy.get(this.elements.more_button).eq(0).click();
    cy.contains("创建快照").click();
    cy.get(this.elements.snapshot_name).type("AutoSnapshot");
    cy.get(this.elements.confirm_button).click();
  }

  //断言创建快照成功
  assertSnapSuccess() {
    qAssert.assertTextExist(this.elements.snap_success, "创建快照成功");
    cy.wait(3000);
    cy.contains("备份中");
  }

}

export default CreateSnapshotPage;

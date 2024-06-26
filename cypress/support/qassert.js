class qAssert {
  //断言指定位置的文本存在
  assertTextExist(element, text) {
    cy.get(element, { timeout: 10000 })
      .should("be.visible")
      .and("contain", text);
  }

  //断言页面文本不存在
  assertTextNotExist(text) {
    cy.contains(text).should("not.exist");
  }

  //断言某按钮可用
  assertButtonYes(element) {
    cy.get(element, { timeout: 10000 })
      .should("be.visible")
      .should("not.be.disabled");
  }

  //断言某按钮不可用
  assertButtonNO(element) {
    cy.get(element, { timeout: 10000 })
      .should("be.visible")
      .should("be.disabled");
  }

  //断言备库状态
  assertBakDBStatus(element, status) {
    cy.get(element).eq(0).contains(status);
  }
}

export default new qAssert();

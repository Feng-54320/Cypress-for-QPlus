class qAssert {
  //断言指定位置的文本是否存在
  assertText(element, text, ifvisible, ifexist) {
    cy.get(element).should("have.text", text).should(ifvisible).should(ifexist);
  }

  //断言某按钮是否可用
  assertButton(element, ifvisible, ifdisabled) {
    cy.get(element).should(ifvisible).should(ifdisabled);
  }

  //断言页面上有指定文本
  assertContains(text) {
    cy.contains(text).should("be.visible");
  }
}

export default new qAssert();

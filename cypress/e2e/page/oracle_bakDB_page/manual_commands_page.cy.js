class ManualCommandPage {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
  }

  clickMore() {
    //cy.contains('更多').click();
    cy.get(this.elements.more_button).eq(0).click();
    cy.contains("手动操作文档").click();
  }

  getTnsnameText() {
    cy.get(this.elements.tnsname_text)
      .invoke("text")
      .then((text) => {
        cy.log("获取到配置tnsname命令: " + text);
        const lines = text.split("复");
        let tnsCommand = lines[1];

        if (tnsCommand) {
          const bashCommand = `cd /opt/oracle/product/19.3.0/db_1/network/admin && echo '${tnsCommand}' >> /home/oracle/feng/feng_test.txt`;
          return cy
            .task("writeFile", {
              filePath: "cypress/command_file/tnsname_cmd.txt",
              text: bashCommand,
            })
            .then(() => {
              cy.log("提取到tnsname配置内容: " + bashCommand);
            });
        } else {
          cy.log("提取tns配置内容失败");
        }
      });
  }


  execAutoTnsname() {
    cy.exec("node ./cypress/task/ssh2_tnsname.js").then((result) => {
      cy.log(result.stdout);
      expect(result.code).to.equal(0);
    });
  }
}
export default ManualCommandPage;

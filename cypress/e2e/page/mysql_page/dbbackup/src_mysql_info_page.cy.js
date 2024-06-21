import qAssert from "../../../../support/qassert.js";

class SrcMysqlInfo {
  constructor(mysqlDBElements) {
    this.elements = mysqlDBElements;
    // 预先加载 mysqlEnv 并保存为类的一个属性
    cy.fixture("/env/mysql_env.json").then((mysqlEnv) => {
      this.mysqlEnv = mysqlEnv;
    });
  }

  //点击Qplus主页的mysql创建备库
  clickMysql() {
    cy.get(this.elements.mysql_panel).should("have.text", "MySQL").click();
    cy.get(this.elements.data_protect).should("have.text", "数据保护").click();
  }

  //输入mysql主库的表单信息
  createMysqlBakdb() {
    cy.fixture("/env/mysql_env.json").then((mysqlEnv) => {
      cy.get(this.elements.create_bakDB)
        .should("have.text", "创建备库")
        .click();

      cy.get(this.elements.mysql_ip).type(mysqlEnv.ip);
      cy.get(this.elements.mysql_port).clear().type(mysqlEnv.port);
      cy.get(this.elements.mysql_managementUser).type(mysqlEnv.managementUser);
      cy.get(this.elements.mysql_managementPassword).type(mysqlEnv.managementPassword);
      cy.get(this.elements.mysql_transmissionUser).type(mysqlEnv.transmissionUser);
      cy.get(this.elements.mysql_transmissionPassword).type(mysqlEnv.transmissionPassword);
      cy.get(this.elements.mysql_conn).click();
    });
  }

  //断言测试连接成功
  assertConnDB() {
    qAssert.assertButtonYes(
      this.elements.mysql_success,
    );
    cy.contains("主库校验通过");
  }
  //输入主机用户名ssh端口点击下一步
  clickNextStep() {
    cy.get(this.elements.ssh_password).type(this.mysqlEnv.ssh_password);
    cy.get(this.elements.config_path).type(this.mysqlEnv.config_Path);
    cy.get(this.elements.next_step).click();
  }
}

export default SrcMysqlInfo;

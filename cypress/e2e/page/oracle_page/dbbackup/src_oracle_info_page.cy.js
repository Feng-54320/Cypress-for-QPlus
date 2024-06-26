import qAssert from "../../../../support/qassert.js";

class SrcOracleInfo {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
    //读取$ORACLE_HOME
    cy.fixture("/env/oracle_env.json").then((env) => {
      this.OracleHome = env.oracle_home;
    });
  }

  //点击Qplus主页的Oracle创建备库
  clickOracle() {
    cy.get(this.elements.oracle_panel).should("have.text", "Oracle").click();

    cy.get(this.elements.data_protect).should("have.text", "数据保护").click();
  }

  //输入oracle主库的表单信息
  createOracleBakdb() {
    cy.fixture("/env/oracle_env.json").then((oracleEnv) => {
      cy.get(this.elements.create_bakDB)
        .should("have.text", "创建备库")
        .click();

      cy.get(this.elements.oracle_ip).type(oracleEnv.ip);

      cy.get(this.elements.oracle_port).clear().type(oracleEnv.port);

      cy.get(this.elements.oracle_password).type(oracleEnv.orapwd);

      cy.get(this.elements.oracle_servicename).type(oracleEnv.service);

      cy.get(this.elements.oracle_test_conn).click();
    });
  }

  //断言测试连接成功
  assertConnDB() {
    qAssert.assertButtonYes(
      this.elements.conn_success,
    );
    cy.contains("连接测试成功");
  }

  //获取oracle密码文件的上传路径
  getOrapwText() {
    cy.get(this.elements.orapw_span)
      .invoke("text")
      .then((text) => {
        const lines = text.split(/\r?\n/);
        let curlCommand = "";

        // 找到包含 'curl' 的行
        lines.forEach((line) => {
          if (line.includes("curl")) {
            curlCommand = line.trim();
          }
        });
        // 检查 curlCommand 是否正确赋值
        if (curlCommand) {
          // 返回异步命令并写入文件
          return cy.wrap(curlCommand).then((cmd) => {
            cy.log(cmd);
            return cy
              .task("writeFile", {
                filePath: "cypress/command_file/oracle/oracle_orapw_cmd.txt",
                text: `cd ${this.OracleHome}/dbs && ` + cmd,
              })
              .then(() => cmd);
          });
        } else {
          throw new Error("No curl command found");
        }
      });
  }

  //执行js脚本，上传密码文件
  uploadOrapwFile() {
    cy.exec("node ./cypress/task/oracle/ssh2_orapw.js").then((result) => {
      cy.log(result.stdout);
      expect(result.code).to.equal(0);
    });
  }

  //点击检测按钮
  clickDetectionbutton() {
    cy.get(this.elements.detection_button).click();
  }

  //断言上传成功
  assertUploadSuccess() {
    cy.get(this.elements.success_sign).should("be.visible");
  }

  //点击数据库许可
  clickDBlicense() {
    cy.get(this.elements.DBlicense).click();
  }


  //点击下一步
  clickNextStep() {
    cy.get(this.elements.next_step_button).click();
  }
}
export default SrcOracleInfo;

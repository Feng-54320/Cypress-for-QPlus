class ManualCommandPage {
  constructor(oracleDBElements) {
    this.elements = oracleDBElements;
    cy.fixture("/env/oracle_env.json").then((env) => {
      this.OracleHome = env.oracle_home;
    });
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
          const bashCommand = `echo '${tnsCommand}' >> ${this.OracleHome}/network/admin/tnsnames.ora`;
          cy.task("writeFile", {
            filePath: "cypress/command_file/tnsname_cmd.txt",
            text: bashCommand,
          });
          cy.log("提取到tnsname配置内容: " + bashCommand);
        } else {
          cy.fail("提取tns配置内容失败");
        }
      });
  }

  execAutoTnsname() {
    cy.exec("node ./cypress/task/oracle/ssh2_tnsname.js").then((result) => {
      cy.log(result.stdout);
      //expect(result.code).to.equal(0);
    });
  }

  getSyncDataText() {
    cy.get(this.elements.multi_channel).click();
    cy.get(this.elements.sync_data_text)
      .invoke("text")
      .then((text) => {
        cy.log("获取到同步数据文档内容: " + text);
        const rmanRegex = /rman target '([^']+)' auxiliary '([^']+)'/;
        const duplicateRegex = /run\s*\{[^}]*\}/;

        // 查找匹配项
        const rmanMatch = text.match(rmanRegex);
        const duplicateMatch = text.match(duplicateRegex);

        // 找到匹配项，将它们写入文件
        let rmanCommand = "";
        if (rmanMatch) {
          rmanCommand = rmanMatch[0];
          cy.task("writeFile", {
            filePath: "cypress/command_file/rman_cmd.txt",
            text: rmanCommand,
          });
          cy.log("RMAN命令提取成功: " + rmanCommand);
        } else {
          cy.fail("RMAN命令提取失败");
        }

        let duplicateCommand = "";
        if (duplicateMatch) {
          duplicateCommand = duplicateMatch[0];
          cy.task("writeFile", {
            filePath: "cypress/command_file/duplicate_cmd.txt",
            text: duplicateCommand,
          });
          cy.log("DUPLICATE命令提取成功: " + duplicateCommand);
        } else {
          cy.log("DUPLICATE命令提取失败");
        }
      });
  }

  execSyncDataScript() {
    cy.task("execWithTimeout", {
      command: "node ./cypress/task/oracle/ssh2_syncdata.js",
      time: 300000,
    }).then((result) => {
      cy.log(result.stdout);
      expect(result.code).to.equal(0);
    });
  }

  getLogArchiveDest() {
    cy.get(this.elements.log_archive_dest_text)
      .invoke("text")
      .then((text) => {
        cy.log("获取配置归档传输路径文档内容：" + text);
        const lines = text.split("sysdba");
        let sqlCommand = "";

        lines.forEach((line) => {
          if (line.includes("alter")) {
            sqlCommand = line.trim();
          }
        });

        if (sqlCommand) {
          cy.log("获取配置归档路径alter命令: " + sqlCommand);
          return cy.task("writeFile", {
            filePath: "cypress/command_file/alter_sql.txt",
            text: sqlCommand,
          });
        } else {
          throw new Error("未找到配置归档路径alter命令");
        }
      });
  }

  execSqlScript() {
    cy.exec("node ./cypress/task/oracle/ssh2_oracle_sql.js").then((result) => {
      cy.log(result.stdout);
      expect(result.code).to.equal(0);
    });
  }

  clickNextStep() {
    cy.get(this.elements.next_step_button).click();
    cy.get(this.elements.yes_button).click();
  }

  execArchiveScript() {
    cy.exec("node ./cypress/task/oracle/ssh2_archive.js").then((result) => {
      cy.log(result.stdout);
      expect(result.code).to.equal(0);
    });
  }
}
export default ManualCommandPage;

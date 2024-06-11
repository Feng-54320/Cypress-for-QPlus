const { Client } = require("ssh2");
const fs = require("fs");

const conn = new Client();

//读取oracle环境配置文件
const oracleJson = fs.readFileSync(
  "cypress/fixtures/env/oracle_env.json",
  "utf8"
);
const oracleEnv = JSON.parse(oracleJson);

//获取oracle环境变量
const user = oracleEnv.sys;
const password = oracleEnv.orapwd;
const connectString = oracleEnv.connString;

//读取文档sql命令
const showCommand = "show parameter log_archive_config;";
const alterSetCommand = fs.readFileSync(
  "cypress/command_file/alter_sql.txt",
  "utf8"
);
const alterArchiveCommand = "ALTER SYSTEM ARCHIVE LOG CURRENT;";

//组装远程sql命令
const remoteShowCommand = `
su - oracle -c "echo \\"${showCommand}\\" | sqlplus -S ${user}/${password}@${connectString} as sysdba"
`;
const remoteAlterSetCommand = `su - oracle -c "echo \\"${alterSetCommand}\\" | sqlplus -S ${user}/${password}@${connectString} as sysdba"`;
const remoteAlterArchiveCommand = `su - oracle -c "echo \\"${alterArchiveCommand}\\" | sqlplus -S ${user}/${password}@${connectString} as sysdba"`;

conn
  .on("ready", () => {
    console.log("Client :: ready");
    conn.exec(remoteShowCommand, (err, stream) => {
      if (err) throw err;
      stream
        .on("data", (data) => {
          console.log("STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.error("STDERR: " + data);
        });
    });

    conn.exec(remoteAlterSetCommand, (err, stream) => {
      if (err) throw err;
      stream
        .on("data", (data) => {
          console.log("STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.error("STDERR: " + data);
        });
    });

    conn.exec(remoteAlterArchiveCommand, (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal
          );
          conn.end();
        })
        .on("data", (data) => {
          console.log("STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.error("STDERR: " + data);
        });

    });
  })
  .connect({
    host: oracleEnv.ip,
    port: 22,
    username: oracleEnv.username,
    password: oracleEnv.password,
  });

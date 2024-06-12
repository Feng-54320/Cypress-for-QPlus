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

const alterArchiveCommand = "ALTER SYSTEM ARCHIVE LOG CURRENT;";

//组装远程sql命令
const remoteAlterArchiveCommand = `su - oracle -c "echo \\"${alterArchiveCommand}\\" | sqlplus -S ${user}/${password}@${connectString} as sysdba"`;

conn
  .on("ready", () => {
    console.log("[Info] Client :: ready");
    conn.exec(remoteAlterArchiveCommand, (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "[Info] Stream :: close :: code: " + code + ", signal: " + signal
          );
          conn.end();
        })
        .on("data", (data) => {
          console.log("[Info] STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.error("[Error] STDERR: " + data);
        });
    });
  })
  .connect({
    host: oracleEnv.ip,
    port: 22,
    username: oracleEnv.username,
    password: oracleEnv.password,
  });

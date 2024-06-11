const { Client } = require("ssh2");
const fs = require("fs");

//读取oracle环境配置文件
const oracleJson = fs.readFileSync(
  "cypress/fixtures/env/oracle_env.json",
  "utf8"
);
const oracleEnv = JSON.parse(oracleJson);

fs.readFile(
  "cypress/command_file/oracle_Orapw_cmd.txt",
  "utf8",
  (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const cmdContent = data;
    console.log("File Content is: " + cmdContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready");

        const scriptPath = "/home/oracle/feng/orapw.sh";
        const scriptContent = cmdContent;

        // 写入脚本文件
        conn.exec(`su - oracle`, (err, suStream) => {
          console.log("exec: su - oracle");
          if (err) {
            console.error("Error executing su:", err);
            return;
          }
          suStream.on("data", (data) => {
            console.log(`STDOUT: ${data}`);
          });
          suStream.stderr.on("data", (data) => {
            console.error(`STDERR: ${data}`);
          });
          suStream.on("close", (code, signal) => {
            console.log(`su executed with code: ${code}`);
            if (code !== 0) {
              console.error("Error executed with code:", code);
            }
            conn.end();
          });
          conn.exec(
            `echo '${scriptContent}' > ${scriptPath}`,
            (err, stream) => {
              console.log("command: " + scriptContent);
              if (err) {
                console.error("Error writing file:", err);
                return;
              }
              stream.on("data", (data) => {
                console.log(`STDOUT (echo command): ${data.toString()}`);
              });
              stream.on("close", (code, signal) => {
                if (code !== 0) {
                  console.error("Error executing command:", code);
                  return;
                }
                console.log("File written successfully.");

                // 执行脚本
                conn.exec(`sh ${scriptPath}`, (err, execStream) => {
                  console.log("exec script: sh " + scriptPath);
                  if (err) {
                    console.error("Error executing script:", err);
                    return;
                  }
                  execStream.on("data", (data) => {
                    console.log(`STDOUT: ${data}`);
                  });
                  execStream.stderr.on("data", (data) => {
                    console.error(`STDERR: ${data}`);
                  });
                  execStream.on("close", (code, signal) => {
                    console.log(`Script executed with code: ${code}`);
                    if (code !== 0) {
                      console.error("Error executed with code:", code);
                    }
                    conn.end();
                  });
                });
              });
            }
          );
        });
      })
      .connect({
        host: oracleEnv.ip,
        port: 22,
        username: oracleEnv.username,
        password: oracleEnv.password,
      });
  }
);

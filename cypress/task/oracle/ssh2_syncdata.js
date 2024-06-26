const { Client } = require("ssh2");
const fs = require("fs").promises;

async function main() {
  try {
    //读取oracle环境配置文件
    const oracleJson = await fs.readFile(
      "cypress/fixtures/env/oracle_env.json",
      "utf8"
    );

    const rmanCmd = await fs.readFile(
      "cypress/command_file/oracle/rman_cmd.txt",
      "utf8"
    );
    const duplicateCmd = await fs.readFile(
      "cypress/command_file/oracle/duplicate_cmd.txt",
      "utf8"
    );

    const oracleEnv = JSON.parse(oracleJson);
    const rmanContent = rmanCmd;
    const duplicateContent = duplicateCmd;

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready" + "\n");

        const rmanScriptPath = "/home/oracle/autotest/rman.sh";
        const duplicateScript = "/home/oracle/autotest/duplicate.rman";
        const rmanSshContent = `
        export ORACLE_SID=${oracleEnv.service} &&
        echo "${rmanContent} cmdfile=${duplicateScript}" > ${rmanScriptPath}`;
        const duplicateSshContent = `echo "${duplicateContent}" > ${duplicateScript}`;

        conn.exec(`su - oracle`, (err, suStream) => {
          console.log("[Info] exec: su - oracle");
          if (err) {
            console.error("[Error] su命令执行出错:", err + "\n");
            return;
          }
          suStream.on("data", (data) => {
            console.log(`[Info] STDOUT: ${data}` + "\n");
          });
          suStream.stderr.on("data", (data) => {
            console.error(`[Error] STDERR: ${data}` + "\n");
          });

          // 写入duplicate命令
          conn.exec(duplicateSshContent, (err, duplicateStream) => {
            if (err) {
              console.error("[Error] 写入duplicate file出错:", err + "\n");
              conn.end();
              return;
            }
            duplicateStream.on("data", (data) => {
              console.log(`[Info] STDOUT: ${data}` + "\n");
            });
            duplicateStream.stderr.on("data", (data) => {
              console.error(`[Error] STDERR: ${data}` + "\n");
              conn.end();
            });
            duplicateStream.on("close", (code, signal) => {
              if (code !== 0) {
                console.error("[Error] 写入duplicate file出错:", code + "\n");
                conn.end();
                return;
              }
              console.log("[Info] duplicate File 写入成功." + "\n");

              //写入rman命令
              conn.exec(rmanSshContent, (err, rmanStream) => {
                //console.log("rmanSshContent命令: " + rmanSshContent + "\n");
                if (err) {
                  console.error("[Error] 写入rman file出错:", err + "\n");
                  conn.end();
                  return;
                }
                rmanStream.on("data", (data) => {
                  console.log(`[Info] STDOUT: ${data}` + "\n");
                });
                rmanStream.stderr.on("data", (data) => {
                  console.error(`[Error] STDERR: ${data}` + "\n");
                  conn.end();
                });
                rmanStream.on("close", (code, signal) => {
                  if (code !== 0) {
                    console.error("[Error] 写入rman file出错:", code + "\n");
                    conn.end();
                    return;
                  }
                  console.log("[Info] rman文件写入成功");

                  //执行rman脚本
                  conn.exec(
                    `su - oracle -c "sh ${rmanScriptPath}"`,
                    (err, execStream) => {
                      console.log(
                        "[Info] rman远程脚本: " + `[sh ${rmanScriptPath}]`
                      );
                      if (err) {
                        console.error(
                          "[Error] rman远程脚本执行出错:",
                          err
                        );
                        conn.end();
                        return;
                      }
                      execStream.on("data", (data) => {
                        console.log(`[Info] STDOUT: ${data}`);
                      });
                      execStream.stderr.on("data", (data) => {
                        console.error(`[Error] STDERR: ${data}`);
                        conn.end();
                      });
                      execStream.on("close", (code, signal) => {
                        if (code !== 0) {
                          console.error(
                            `[Error] rman远程脚本执行出错: ${code}`
                          );
                          conn.end();
                          return;
                        }
                        console.log(
                          `[Info] rman远程脚本执行退出码: ${code}`
                        );
                        conn.end();
                      });
                    }
                  );
                });
                suStream.on("data", (data) => {
                  console.log(`[Info] STDOUT (echo command): ${data}`);
                });
                suStream.stderr.on("data", (data) => {
                  console.error(`[Error] STDERR (echo command): ${data}`);
                });
              });
            });
          });
        });
      })
      .connect({
        host: oracleEnv.ip,
        port: 22,
        username: oracleEnv.username,
        password: oracleEnv.password,
      });
  } catch (error) {
    console.error("[Error]:", error);
  }
}

main();

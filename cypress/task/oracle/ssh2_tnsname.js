const { Client } = require("ssh2");
const fs = require("fs").promises;

async function main() {
  try {
    //读取oracle环境配置文件
    const oracleJson = await fs.readFile(
      "cypress/fixtures/env/oracle_env.json",
      "utf8"
    );
    const oracleEnv = JSON.parse(oracleJson);

    //读取tns配置命令
    const tnsContent = await fs.readFile(
      "cypress/command_file/oracle/tnsname_cmd.txt",
      "utf8"
    );
    //console.log("tnsping Content is: " + tnsContent);

    //匹配service name
    const match = tnsContent.match(/SERVICE_NAME\s*=\s*(\w+)/);
    var serviceName = "";
    if (match) {
      serviceName = match[1];
      console.log("[Info] Find SERVICE_NAME = " + serviceName);
    } else {
      console.error("[Error] SERVICE_NAME not found");
    }

    //建立ssh连接
    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("[Info] Client :: ready");

        const scriptPath = "/home/oracle/autotest/auto_tnsname.sh";
        const scriptDir = "/home/oracle/autotest";
        const sshContent = `echo "${tnsContent}" > ${scriptPath}`;

        conn.exec("su - oracle", (err, suStream) => {
          console.log("[Info] exec: su - oracle");
          if (err) {
            console.error("[Error] executing su:", err);
            return;
          }
          suStream.on("data", (data) => {
            console.log(`[Info] STDOUT: ${data}`);
          });
          suStream.stderr.on("data", (data) => {
            console.error(`[Error] STDERR: ${data}`);
          });

          // 检查并创建目录
          conn.exec(
            `su - oracle -c "mkdir -p ${scriptDir}"`,
            (err, mkdirStream) => {
              if (err) {
                console.error("[Error] creating directory:", err);
                conn.end();
                return;
              }
              console.log(`[Info] Directory checked/created successfully`);

              // 写入脚本文件
              conn.exec(sshContent, (err, stream) => {
                if (err) {
                  console.error("[Error] writing file:", err);
                  conn.end();
                  return;
                }
                console.log("[Info] File written successfully.");

                // 执行脚本
                conn.exec(`sh ${scriptPath}`, (err, execStream) => {
                  if (err) {
                    console.error("[Error] executing tns script:", err);
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

                  // 执行 tnsping
                  conn.exec(
                    `su - oracle -c "tnsping ${serviceName}"`,
                    (err, pingStream) => {
                      console.log(
                        `[Info] exec tnsping command: [su - oracle -c tnsping "${serviceName}"]`
                      );
                      if (err) {
                        console.error("[Error] executing ORACLE_SID:", err);
                        conn.end();
                        return;
                      }
                      pingStream.on("data", (data) => {
                        console.log(`[Info] STDOUT: ${data}`);
                      });
                      pingStream.stderr.on("data", (data) => {
                        console.error(`[Error] STDERR: ${data}`);
                      });
                      pingStream.on("close", (code, signal) => {
                        if (code !== 0) {
                          console.error(
                            `[Error] tnsping executed with code: ${code}`
                          );
                        } else {
                          console.log(
                            `[Info] tnsping executed with code: ${code}`
                          );
                        }
                        conn.end();
                      });
                    }
                  );
                });

                stream.on("data", (data) => {
                  console.log(`[Info] STDOUT (echo command): ${data}`);
                });
                stream.stderr.on("data", (data) => {
                  console.error(`[Error] STDERR (echo command): ${data}`);
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
  } catch (error) {
    console.error("[Error]", error);
  }
}

main();

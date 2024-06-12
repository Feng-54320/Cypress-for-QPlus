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

    const tnsContent = await fs.readFile(
      "cypress/command_file/tnsname_cmd.txt",
      "utf8"
    );
    console.log("tnsping Content is: " + tnsContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready");

        const scriptPath = "/home/oracle/feng/auto_tnsname.sh";
        const sshContent = `echo "${tnsContent}" > ${scriptPath}`;

        conn.exec("su - oracle", (err, suStream) => {
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
          // suStream.on("close", (code, signal) => {
          //   console.log(`su executed with code: ${code}`);
          //   if (code !== 0) {
          //     console.error("Error executed with code:", code);
          //   }
          //   conn.end();
          // });
          //

          // 写入脚本文件
          conn.exec(sshContent, (err, stream) => {
            if (err) {
              console.error("Error writing file:", err);
              conn.end();
              return;
            }

            stream.on("close", (code, signal) => {
              if (code !== 0) {
                console.error("Error executing command:", code);
                conn.end();
                return;
              }
              console.log("File written successfully.");

              // 执行脚本
              conn.exec(`sh ${scriptPath}`, (err, execStream) => {
                if (err) {
                  console.error("Error executing script:", err);
                  conn.end();
                  return;
                }
                execStream.on("data", (data) => {
                  console.log(`STDOUT: ${data}`);
                });
                execStream.stderr.on("data", (data) => {
                  console.error(`STDERR: ${data}`);
                  conn.end();
                });
                execStream.on("close", (code, signal) => {
                  if (code !== 0) {
                    console.error(`Script executed with code: ${code}`);
                    conn.end();
                    return;
                  }
                  console.log(`Script executed with code: ${code}`);

                  // 执行 tnsping
                  conn.exec(
                    `su - oracle -c tnsping master1BKdb1`,
                    (err, pingStream) => {
                      console.log("exec tnsping command");
                      if (err) {
                        console.error("Error executing ORACLE_SID:", err);
                        conn.end();
                        return;
                      }
                      pingStream.on("data", (data) => {
                        console.log(`STDOUT: ${data}`);
                      });
                      pingStream.stderr.on("data", (data) => {
                        console.error(`STDERR: ${data}`);
                      });
                      pingStream.on("close", (code, signal) => {
                        if (code !== 0) {
                          console.error(`tnsping executed with code: ${code}`);
                        } else {
                          console.log(`tnsping executed with code: ${code}`);
                        }
                        conn.end();
                      });
                    }
                  );
                });
              });
            });

            stream.on("data", (data) => {
              console.log(`STDOUT (echo command): ${data}`);
            });
            stream.stderr.on("data", (data) => {
              console.error(`STDERR (echo command): ${data}`);
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
    console.error("Error:", error);
  }
}

main();

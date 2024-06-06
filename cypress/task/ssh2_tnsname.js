const { Client } = require("ssh2");
const fs = require("fs").promises;

async function main() {
  try {
    const data = await fs.readFile(
      "cypress/command_file/tnsname_cmd.txt",
      "utf8"
    );
    const tnsContent = data;
    console.log("File Content is: " + tnsContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready");

        const scriptPath = "/home/oracle/feng/auto_tnsname.sh";
        const sshContent = `echo "${tnsContent}" > ${scriptPath}`;

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
                  `export ORACLE_SID=yusys`,
                  (err, pingStream) => {
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
                        console.error(`ORACLE_SID executed with code: ${code}`);
                      } else {
                        console.log(`ORACLE_SID executed with code: ${code}`);
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
      })
      .connect({
        host: "10.10.168.45",
        port: 22,
        username: "oracle",
        password: "oracle",
      });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

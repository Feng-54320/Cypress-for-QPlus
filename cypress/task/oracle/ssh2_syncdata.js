const { Client } = require("ssh2");
const fs = require("fs").promises;

//读取oracle环境配置文件
const oracleJson = fs.readFileSync(
  "cypress/fixtures/env/oracle_env.json",
  "utf8"
);
const oracleEnv = JSON.parse(oracleJson);

async function main() {
  try {
    const rmanCmd = await fs.readFile(
      "cypress/command_file/rman_cmd.txt",
      "utf8"
    );
    const duplicateCmd = await fs.readFile(
      "cypress/command_file/duplicate_cmd.txt",
      "utf8"
    );
    const rmanContent = rmanCmd;
    const duplicateContent = duplicateCmd;
    //console.log("Rman Content is: " + rmanContent);
    //console.log("Duplicate Content is: " + duplicateContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready" + "\n");

        const rmanScriptPath = "/home/oracle/feng/rman.sh";
        const duplicateScript = "/home/oracle/feng/duplicate.rman";
        const rmanSshContent = `
        export ORACLE_SID=master1 &&
        echo "${rmanContent} cmdfile=${duplicateScript}" > ${rmanScriptPath}`;
        const duplicateSshContent = `echo "${duplicateContent}" > ${duplicateScript}`;

        conn.exec(`su - oracle`, (err, suStream) => {
          console.log("exec: su - oracle");
          if (err) {
            console.error("su命令执行出错:", err + "\n");
            return;
          }
          suStream.on("data", (data) => {
            console.log(`STDOUT: ${data}` + "\n");
          });
          suStream.stderr.on("data", (data) => {
            console.error(`STDERR: ${data}` + "\n");
          });

          // 写入duplicate命令
          conn.exec(duplicateSshContent, (err, duplicateStream) => {
            if (err) {
              console.error("写入duplicate file出错:", err + "\n");
              conn.end();
              return;
            }
            duplicateStream.on("data", (data) => {
              console.log(`STDOUT: ${data}` + "\n");
            });
            duplicateStream.stderr.on("data", (data) => {
              console.error(`STDERR: ${data}` + "\n");
              conn.end();
            });
            duplicateStream.on("close", (code, signal) => {
              if (code !== 0) {
                console.error("写入duplicate file出错:", code + "\n");
                conn.end();
                return;
              }
              console.log("duplicate File 写入成功." + "\n");

              //写入rman命令
              conn.exec(rmanSshContent, (err, rmanStream) => {
                console.log("rmanSshContent命令: " + rmanSshContent + "\n");
                if (err) {
                  console.error("写入rman file出错:", err + "\n");
                  conn.end();
                  return;
                }
                rmanStream.on("data", (data) => {
                  console.log(`STDOUT: ${data}` + "\n");
                });
                rmanStream.stderr.on("data", (data) => {
                  console.error(`STDERR: ${data}` + "\n");
                  conn.end();
                });
                rmanStream.on("close", (code, signal) => {
                  if (code !== 0) {
                    console.error("写入rman file出错:", code + "\n");
                    conn.end();
                    return;
                  }
                  console.log("rman文件写入成功.\n");

                  //执行rman脚本
                  conn.exec(
                    `su - oracle -c "sh ${rmanScriptPath}"`,
                    (err, execStream) => {
                      console.log(
                        "rman远程脚本: " + `sh ${rmanScriptPath}` + "\n"
                      );
                      if (err) {
                        console.error("rman远程脚本执行出错:", err + "\n");
                        conn.end();
                        return;
                      }
                      execStream.on("data", (data) => {
                        console.log(`${data}`);
                      });
                      execStream.stderr.on("data", (data) => {
                        console.error(`STDERR: ${data}`);
                        conn.end();
                      });
                      execStream.on("close", (code, signal) => {
                        if (code !== 0) {
                          console.error(`rman远程脚本执行出错: ${code}` + "\n");
                          conn.end();
                          return;
                        }
                        console.log(`rman远程脚本执行退出码: ${code}` + "\n");
                        conn.end();
                      });
                    }
                  );
                });
                suStream.on("data", (data) => {
                  console.log(`STDOUT (echo command): ${data}` + "\n");
                });
                suStream.stderr.on("data", (data) => {
                  console.error(`STDERR (echo command): ${data}` + "\n");
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
    console.error("Error:", error);
  }
}

main();

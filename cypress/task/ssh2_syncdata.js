const { Client } = require("ssh2");
const fs = require("fs").promises;

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
    console.log("Rman Content is: " + rmanContent);
    console.log("Duplicate Content is: " + duplicateContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready");

        const rmanScriptPath = "/home/oracle/feng/rman.sh";
        const duplicateScript = "/home/oracle/feng/duplicate.rman";
        const rmanSshContent = `
        export ORACLE_SID=master1
        echo "${rmanContent} cmdfile=${duplicateScript}" > ${rmanScriptPath}`;
        const duplicateSshContent = `echo "${duplicateContent}" > ${duplicateScript}`;

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

          // 写入duplicate命令
          conn.exec(duplicateSshContent, (err, duplicateStream) => {
            if (err) {
              console.error("Error writing duplicate file:", err);
              conn.end();
              return;
            }
            duplicateStream.on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            });
            duplicateStream.stderr.on("data", (data) => {
              console.error(`STDERR: ${data}`);
              conn.end();
            });
            duplicateStream.on("close", (code, signal) => {
              if (code !== 0) {
                console.error("Error executing command:", code);
                conn.end();
                return;
              }
              console.log("duplicate File written successfully.");

              //写入rman命令
              conn.exec(rmanSshContent, (err, rmanStream) => {
                console.log("rmanSshContent is " + rmanSshContent);
                if (err) {
                  console.error("Error writing rman file:", err);
                  conn.end();
                  return;
                }
                rmanStream.on("data", (data) => {
                  console.log(`STDOUT: ${data}`);
                });
                rmanStream.stderr.on("data", (data) => {
                  console.error(`STDERR: ${data}`);
                  conn.end();
                });
                rmanStream.on("close", (code, signal) => {
                  if (code !== 0) {
                    console.error("Error executing command:", code);
                    conn.end();
                    return;
                  }
                  console.log("rman File written successfully.");

                  //执行rman脚本
                  conn.exec(`su - oracle -c "sh ${rmanScriptPath}"`, (err, execStream) => {
                    console.log("rman script: " + `sh ${rmanScriptPath}`);
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
                      conn.end();
                    });
                  });
                });
                suStream.on("data", (data) => {
                  console.log(`STDOUT (echo command): ${data}`);
                });
                suStream.stderr.on("data", (data) => {
                  console.error(`STDERR (echo command): ${data}`);
                });
              });
            });
          });
        });
      })
      .connect({
        host: "10.10.168.73",
        port: 22,
        username: "root",
        password: "letsg0",
      });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

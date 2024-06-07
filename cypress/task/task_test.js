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
          //   suStream.on("close", (code, signal) => {
          //     console.log(`su executed with code: ${code}`);
          //     if (code !== 0) {
          //       console.error("Error executed with code:", code);
          //     }
          //     conn.end();

          // 写入脚本文件
          conn.exec(duplicateSshContent, (err, stream) => {
            if (err) {
              console.error("Error writing duplicate file:", err);
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
            });
            conn.exec(rmanSshContent, (err, stream) => {
              console.log("rmanSshContent is " + rmanSshContent);
              if (err) {
                console.error("Error writing rman file:", err);
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
              });
              stream.on("data", (data) => {
                console.log(`STDOUT (echo command): ${data}`);
              });
              stream.stderr.on("data", (data) => {
                console.error(`STDERR (echo command): ${data}`);
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

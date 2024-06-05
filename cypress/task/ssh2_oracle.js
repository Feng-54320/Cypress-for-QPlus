const { Client } = require("ssh2");
const fs = require("fs");

fs.readFile(
  "cypress/command_file/oracle_Orapw_cmd.txt","utf8",
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

        const scriptPath = "/home/oracle/feng/script.sh";
        const scriptContent = cmdContent;

        // 写入脚本文件
        conn.exec(`echo '${scriptContent}' > ${scriptPath}`, (err, stream) => {
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
                conn.end();
              });
            });
          });
        });
      })
      .connect({
        host: "10.10.168.45",
        port: 22,
        username: "oracle",
        password: "oracle",
      });
  }
);

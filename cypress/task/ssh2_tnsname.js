const { Client } = require("ssh2");
const fs = require("fs").promises;

async function main() {
  try {
    const data = await fs.readFile(
      "cypress/command_file/tnsname_cmd.txt",
      "utf8"
    );
    const cmdContent = data;
    console.log("File Content is: " + cmdContent);

    const conn = new Client();
    conn
      .on("ready", () => {
        console.log("Client :: ready");

        const scriptPath = "/home/oracle/feng/auto_tnsname.sh";

        // 写入脚本文件
        conn.exec(
          `echo  "${cmdContent.replace(/"/g, '\\"')}" > ${scriptPath}`,
          (err, stream) => {
            console.log("command: " + cmdContent);
            if (err) {
              console.error("Error writing file:", err);
              return;
            }

            stream
              .on("close", (code, signal) => {
                if (code !== 0) {
                  console.error("Error executing command:", code);
                  return;
                }
                console.log("File written successfully.");

                //执行脚本
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
              })
              .on("data", (data) => {
                console.log(`STDOUT (echo command): ${data}`);
              })
              .stderr.on("data", (data) => {
                console.error(`STDERR (echo command): ${data}`);
              });
          }
        );
      })
      .connect({
        host: "10.10.168.45",
        port: 22,
        username: "oracle",
        password: "oracle",
      });
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

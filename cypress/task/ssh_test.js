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
        const scriptContent = `
echo "${tnsContent}" > ${scriptPath}
sh ${scriptPath}
tnsping master1BKe23
`;

        // 将所有命令写入一个脚本文件中
        const remoteScriptPath = "/home/oracle/feng/auto_tnsname.sh";
        conn.exec(
          `echo ${scriptContent} > ${remoteScriptPath}`,
          (err, stream) => {
            if (err) {
              console.error("Error writing remote script file:", err);
              conn.end();
              return;
            }
            console.log("scriptContent is " + scriptContent);
            console.log("File write successfully");

            stream.on("close", (code, signal) => {
              if (code !== 0) {
                console.error("Error writing remote script file, code:", code);
                conn.end();
                return;
              }

              // 切换到 oracle 用户并执行脚本
              conn.exec(
                `su - oracle -c 'sh ${remoteScriptPath}'`,
                (err, suStream) => {
                  if (err) {
                    console.error("Error executing su - oracle:", err);
                    conn.end();
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
                    conn.end();
                  });
                }
              );
            });

            stream.on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            });

            stream.stderr.on("data", (data) => {
              console.error(`STDERR: ${data}`);
            });
          }
        );
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

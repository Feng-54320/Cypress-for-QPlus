const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        // ### 写文件任务START
        writeFile({ filePath, text }) {
          const fullPath = path.resolve(filePath);

          // 确保目录存在
          if (!fs.existsSync(path.dirname(fullPath))) {
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
          }

          // 写入文件
          fs.writeFileSync(fullPath, text);

          return { success: true };
        },
        // ### 写文件任务END

        // ### 执行命令任务START
        execWithTimeout({ command, time }) {
          return new Promise((resolve, reject) => {
            console.log(`Executing command: ${command} with timeout: ${time}`);
            const child = exec(command, (error, stdout, stderr) => {
              if (error) {
                console.log(`Command error: ${error.message}`);
                reject({ code: error.code, stderr });
              } else {
                console.log(`Command stdout: ${stdout}`);
                resolve({ code: 0, stdout });
              }
            });

            setTimeout(() => {
              child.kill();
              reject(
                new Error(`Command timed out after ${time / 1000} seconds.`)
              );
            }, time);
          });
        },
        // ### 执行命令任务END
      });
    },
  },
  // 配置浏览器大小
  viewportWidth: 1600,
  viewportHeight: 820,
  //配置截图路径
  screenshotsFolder: "cypress/screenshots",
  //配置任务超时时间
  defaultCommandTimeout: 240000,
  taskTimeout: 900000,
  //配置测试报告
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: true,
    json: false,
  },
});

const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // ### 写文件任务START
      on("task", {
        writeFile({ filePath, text }) {
          const fullPath = path.resolve(filePath);

          // 确保目录存在
          if (!fs.existsSync(path.dirname(fullPath))) {
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
          }

          // 写入文件
          fs.writeFileSync(fullPath, text);

          return null; // 或者返回写入状态等
        },
      });
      // ### 写文件任务END
    },

    // 配置浏览器大小
    viewportWidth: 1600,
    viewportHeight: 820,
    //配置截图路径
    screenshotsFolder: "cypress/screenshots",
  },
});

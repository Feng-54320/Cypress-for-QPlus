const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // 配置浏览器大小
    viewportWidth: 1600,
    viewportHeight: 820,
  },

   //配置截图路径
   screenshotsFolder: 'cypress/screenshots'
});

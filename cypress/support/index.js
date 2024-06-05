// cypress/support/index.js

// 导入必要的命令
import "./commands";

// 添加全局失败截图处理程序
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    const screenshotPath = `cypress/screenshots/${Cypress.spec.name}/${screenshotFileName}`;
    cy.screenshot(screenshotFileName);
    cy.log("Screenshot saved at:", screenshotPath);
  }
});


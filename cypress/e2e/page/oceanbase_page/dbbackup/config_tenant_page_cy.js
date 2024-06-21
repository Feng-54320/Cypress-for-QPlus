import qAssert from "../../../../support/qassert";
import utils from "../../../../support/utils";

class ConfigTenantPage {
  constructor(obElements) {
    this.elements = obElements;
  }

  //点击备库后面的更多按钮
  clickMoreButton() {
    cy.log("点击备库后面的更多按钮");
    cy.get(this.elements.more_button)
      .eq(0)
      .click()
      .then(() => {
        cy.contains("配置租户").click();
      });
  }

  //断言打开配置租户窗口
  assertAccessTenantWindow() {
    cy.log("断言打开配置租户窗口");
    qAssert.assertTextExist(this.elements.config_tenant_window, "创建备份集");
  }

  //点击配置租户按钮
  clickConfigTenant() {
    cy.log("点击配置租户按钮");
    cy.get(this.elements.tenant_more_button)
      .click()
      .then(() => {
        cy.get(this.elements.config_tenant_button).click();
      });
  }

  //断言打开配置租户信息窗口
  assertAccessTenantInfo() {
    cy.log("断言打开配置租户信息窗口");
    qAssert.assertTextExist(this.elements.tenant_info_window, "配置租户信息");
  }

  //增加CPU
  clickCPUAddButton(times = 1) {
    cy.log("增加CPU");
    utils.clickButtonMultipleTimes(this.elements.cpu_add_button, times);
  }

  //增加内存
  clickMemoryAddButton(times = 3) {
    cy.log("增加内存");
    utils.clickButtonMultipleTimes(this.elements.memory_add_button, times);
  }

  //增加LogSizeDisk
  clickLogSizeDiskAddButton(times = 2) {
    cy.log("LogSizeDisk");
    utils.clickButtonMultipleTimes(
      this.elements.log_disk_size_add_button,
      times
    );
  }

  //填写租户用户名
  typeTenantName() {
    cy.log("填写租户用户名");
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.tenant_name).type(obEnv.config_tenant_name);
    });
  }

  //填写租户密码
  typeTenantPassword() {
    cy.log("填写租户密码");
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.tenant_password).type(obEnv.config_tenant_password);
    });
  }

  //填写路径
  typeSourcePath() {
    cy.log("填写路径");
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.source_path).type(obEnv.source_path);
    });
  }

  //填写路径参数
  typeSourcePathArgs() {
    cy.log("填写路径参数");
    cy.fixture("/env/oceanbase_env.json").then((obEnv) => {
      cy.get(this.elements.source_path_args).type(obEnv.source_path_args);
    });
  }

  //点击保存按钮
  clickSaveButton() {
    cy.log("点击保存按钮");
    cy.get(this.elements.save_button).click();
  }

  //断言保存成功,页面出现待执行
  assertWaitForExec() {
    cy.log("断言保存成功,页面出现待执行");
    qAssert.assertTextExist(this.elements.config_tenant_window, "待执行");
  }

  //点击自动执行
  clickAutoExecButton() {
    cy.log("点击自动执行");
    cy.get(this.elements.auto_exec_button).click();
  }

  //点击刷新状态
  clickRefreshStatusButton() {
    cy.log("点击刷新状态");
    cy.wait(300000);
    cy.get(this.elements.refresh_status_button).click();
  }

  //断言待同步
  assertWaitForSync() {
    cy.log("断言待同步");
    cy.get(this.elements.refresh_status_button).click();
    qAssert.assertTextExist(this.elements.config_tenant_window_2, "待启动同步");
    cy.get(this.elements.refresh_status_button).click();
    qAssert.assertTextExist(this.elements.config_tenant_window_2, "待启动同步");
  }

  //点击启动同步
  clickStartSyncButton() {
    cy.log("点击启动同步");
    cy.get(this.elements.tenant_more_button_2)
      .click()
      .then(() => {
        cy.get(this.elements.start_sync_button).click();
        qAssert.assertTextExist(this.elements.config_tenant_window, "配置完成");
      });
  }

  //点击完成按钮
  clickFinishButton() {
    cy.log("点击完成按钮");
    cy.get(this.elements.finish_button).click();
  }
}
export default ConfigTenantPage;

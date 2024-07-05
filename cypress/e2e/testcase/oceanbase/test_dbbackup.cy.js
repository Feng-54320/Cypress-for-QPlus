import SrcDBConfigPage from "../../page/oceanbase_page/dbbackup/src_db_config_page.cy";
import BakDbConfigPage from "../../page/oceanbase_page/dbbackup/bak_db_config_page.cy";
import ConfigTenantPage from "../../page/oceanbase_page/dbbackup/config_tenant_page_cy";

describe("module：OceanBase 数据保护", () => {
  let srcDBConfigPage;
  let bakDbConfigPage;
  let configTenantPage;

  //用例前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/oceanbase/dbbackup/elements.json").then((elements) => {
      srcDBConfigPage = new SrcDBConfigPage(elements[0]);
      bakDbConfigPage = new BakDbConfigPage(elements[1]);
      configTenantPage = new ConfigTenantPage(elements[2]);
    });
  });

  //用例1
  it("case 1： 输入OB数据源和备库信息", () => {
    //点击OB的数据保护
    srcDBConfigPage.clickOceanBase();
    //断言创建备库按钮可用并点击
    srcDBConfigPage.assertCreateBakDBButton();
    //输入源库配置信息
    srcDBConfigPage.typeOBSrcInfo();
    //点击测试链接按钮
    srcDBConfigPage.clickTestConnButton();
    //断言连接成功
    srcDBConfigPage.assertConnDB();
    //选择备份的租户
    srcDBConfigPage.selectBakTenant();
    //断言数据库版本信息出现
    srcDBConfigPage.assertDBVersion();
    //点击下一步按钮
    srcDBConfigPage.clickNextStepButton();

    //输入备库信息
    //输入备库名, 需要一个参数string类型, 无默认值
    bakDbConfigPage.typeBakDBName("AutoTestOB123_!@#$");
    //选择备库规格, 需要两个参数int, 默认是[6,8], 表示6Core8Gi
    bakDbConfigPage.selectScale();
    //需要一个参数int, 表示增加多少的数据卷空间大小, 默认是0
    bakDbConfigPage.clickDataVolumeAddButton(20);
    //需要一个参数Boolean, 默认false, 表示不启用数据卷压缩
    bakDbConfigPage.selectDataCompression();
    //需要一个参数int, 表示增加多少的快照空间大小, 默认是0
    bakDbConfigPage.clickSnapZoneAddButton(10);
    //需要一个参数int, 表示增加多少的归档空间大小, 默认是0
    bakDbConfigPage.clickArchiveZoneAddButton(10);
    //需要一个参数Boolean, 默认false, 表示不启用归档压缩
    bakDbConfigPage.selectArchiveCompression();
    //需要一个参数int, 表示增加多少的DataFileSize大小, 默认是0
    bakDbConfigPage.clickDataFileSizeAddButton(7);
    //需要一个参数int, 表示增加多少的LogDiskSize大小, 默认是0
    bakDbConfigPage.clickLogDiskSizeAddButton(7);
    //点击下一步
    bakDbConfigPage.clickNextStepButton();
    //断言创建成功
    bakDbConfigPage.assertCreateBakDBSuccess();
    //断言进入手工操作文档
    bakDbConfigPage.assertGetManualDoc();
  });

  it("case 2: 配置租户", () => {
    //点击OB的数据保护
    srcDBConfigPage.clickOceanBase();
    //点击备库列表的更多按钮
    configTenantPage.clickMoreButton();
    //断言出现配置租户窗口
    configTenantPage.assertAccessTenantWindow();
    //点击配置租户
    configTenantPage.clickConfigTenant();
    //断言进入配置租户表单窗口
    configTenantPage.assertAccessTenantInfo();
    //增加CPU数量， 需要一个参数int, 默认为1
    configTenantPage.clickCPUAddButton();
    //增加大小，需要一个参数int，默认为3
    configTenantPage.clickMemoryAddButton();
    //增加logsize大小，需要一个参数int，默认为2
    configTenantPage.clickLogSizeDiskAddButton();
    //输入租户名
    configTenantPage.typeTenantName();
    //输入租户密码
    configTenantPage.typeTenantPassword();
    //输入备份集路径
    configTenantPage.typeSourcePath();
    //输入备份路径参数
    configTenantPage.typeSourcePathArgs();
    //点击保存按钮
    configTenantPage.clickSaveButton();
    //点击自动执行
    configTenantPage.clickAutoExecButton();
    //点击刷新状态
    configTenantPage.clickRefreshStatusButton();
    //断言出现待同步状态
    configTenantPage.assertWaitForSync();
    //点击启动同步按钮
    configTenantPage.clickStartSyncButton();
    //点击完成
    configTenantPage.clickFinishButton();

  });
});

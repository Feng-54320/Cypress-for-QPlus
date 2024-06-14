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
    srcDBConfigPage.clickOceanBase();
    srcDBConfigPage.assertCreateBakDBButton();
    srcDBConfigPage.typeOBSrcInfo();
    srcDBConfigPage.clickTestConnButton();
    srcDBConfigPage.assertConnDB();
    srcDBConfigPage.selectBakTenant();
    srcDBConfigPage.assertDBVersion();
    srcDBConfigPage.clickNextStepButton();

    //输入备库信息
    //输入备库名, 需要一个参数string类型, 无默认值
    bakDbConfigPage.typeBakDBName("AutoTestOB");
    //选择备库规格, 需要两个参数int, 默认是[8,8], 表示8Core8Gi
    bakDbConfigPage.selectScale();
    //需要一个参数int, 表示增加多少的数据卷空间大小, 默认是20
    bakDbConfigPage.clickDataVolumeAddButton();
    //需要一个参数Boolean, 默认false, 表示不启用数据卷压缩
    bakDbConfigPage.selectDataCompression();
    //需要一个参数int, 表示增加多少的快照空间大小, 默认是10
    bakDbConfigPage.clickSnapZoneAddButton();
    //需要一个参数int, 表示增加多少的归档空间大小, 默认是10
    bakDbConfigPage.clickArchiveZoneAddButton();
    //需要一个参数Boolean, 默认false, 表示不启用归档压缩
    bakDbConfigPage.selectArchiveCompression();
    //需要一个参数int, 表示增加多少的DataFileSize大小, 默认是8
    bakDbConfigPage.clickDataFileSizeAddButton();
    //需要一个参数int, 表示增加多少的LogDiskSize大小, 默认是8
    bakDbConfigPage.clickLogDiskSizeAddButton();
    //点击下一步
    bakDbConfigPage.clickNextStepButton();
    //断言创建成功
    bakDbConfigPage.assertCreateBakDBSuccess();
  });

  it("case 2: 配置租户", () => {
    srcDBConfigPage.clickOceanBase();
    configTenantPage.clickMoreButton();
    configTenantPage.assertAccessTenantWindow();
    configTenantPage.clickConfigTenant();
    configTenantPage.assertAccessTenantInfo();
    configTenantPage.clickCPUAddButton();
    configTenantPage.clickMemoryAddButton();
    configTenantPage.clickLogSizeDiskAddButton();
    configTenantPage.typeTenantName();
    configTenantPage.typeTenantPassword();
    configTenantPage.typeSourcePath();
    configTenantPage.typeSourcePathArgs();
    configTenantPage.clickSaveButton();
    configTenantPage.clickAutoExecButton();
    configTenantPage.clickRefreshStatusButton();
    configTenantPage.assertWaitForExec();
    configTenantPage.clickStartSyncButton();
    configTenantPage.clickFinishButton();

  });
});

import SrcDBConfigPage from "../../page/gaussdb_page/dbbackup/src_db_config_page.cy";
import BakDbConfigPage from "../../page/gaussdb_page/dbbackup/bak_db_config_page.cy";
import ConfigTenantPage from "../../page/gaussdb_page/dbbackup/config_tenant_page_cy";

describe("module：GaussDB 数据保护", () => {
  let srcDBConfigPage;
  let bakDbConfigPage;
  let configTenantPage;

  //用例前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/gaussdb/dbbackup/elements.json").then((elements) => {
      srcDBConfigPage = new SrcDBConfigPage(elements[0]);
      bakDbConfigPage = new BakDbConfigPage(elements[1]);
      configTenantPage = new ConfigTenantPage(elements[2]);
    });
  });

  //用例1
  it("case 1： 输入GS数据源和备库信息", () => {
    //点击数据保护
    srcDBConfigPage.clickOceanBase();
    //断言创建备库按钮可用并点击
    srcDBConfigPage.assertCreateBakDBButton();
    //输入源库配置信息
    srcDBConfigPage.typeOBSrcInfo();
    //点击测试链接按钮
    srcDBConfigPage.clickTestConnButton();
    //断言连接成功
    srcDBConfigPage.assertConnDB();
    //断言数据库版本出现
    srcDBConfigPage.assertDBVersion();
    //点击下一步按钮
    srcDBConfigPage.clickNextStepButton();

    //输入备库信息
    //输入备库名, 需要一个参数string类型, 无默认值
    bakDbConfigPage.typeBakDBName("AutoTestGS");
    //选择备库规格, 需要两个参数int, 默认是[4,8], 表示8Core8Gi
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
    //增加WAL储存, 需要一个参数int, 表示增加多少空间大小, 默认是1
    bakDbConfigPage.clickWalAddButton();
    //点击下一步
    bakDbConfigPage.clickNextStepButton();
    //断言创建成功
    bakDbConfigPage.clickConfigFinishButton();
  });
});

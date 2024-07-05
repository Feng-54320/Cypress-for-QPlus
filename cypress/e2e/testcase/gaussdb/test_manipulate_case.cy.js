import ManipulatePage from "../../page/gaussdb_page/manipulate/manipulate_page.cy";
import SrcDBConfigPage from "../../page/gaussdb_page/dbbackup/src_db_config_page.cy";
import DevelopDBPage from "../../page/gaussdb_page/develop/developdb_page.cy";
import RecoveryDBPage from "../../page/gaussdb_page/recovery/gs_recovery_page.cy";

describe("module：GaussDB 备库和快照库操作", () => {
  let srcDBConfigPage;
  let manipulatePage;
  let recoveryDBPage;
  let developDBPage;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/gaussdb/dbbackup/elements.json").then((elements) => {
      srcDBConfigPage = new SrcDBConfigPage(elements[0]);
    });
    cy.fixture("/locator/gaussdb/develop/elements.json").then((elements) => {
      developDBPage = new DevelopDBPage(elements);
    });
    cy.fixture("/locator/gaussdb/recovery/elements.json").then((elements) => {
      recoveryDBPage = new RecoveryDBPage(elements);
    });
    cy.fixture("/locator/gaussdb/manipulate/elements.json").then((elements) => {
      manipulatePage = new ManipulatePage(elements);
    });
  });

  it("case 1: 创建快照", () => {
    //点击Mysql的数据保护
    srcDBConfigPage.clickGaussDB();
    //点击创建快照
    manipulatePage.clickCreateSnapshot();
    //断言创建成功
    manipulatePage.assertSnapSuccess();
  });

  it("case 2: 启停备库", () => {
    //点击OB的数据保护
    srcDBConfigPage.clickGaussDB();
    //关闭备库
    manipulatePage.clickCloseBakDB();
    //开启备库
    manipulatePage.clickStartUPBakDB();
  });

  it("case 3: 启停快照库", () => {
    //点击ob数据恢复
    recoveryDBPage.clickGaussDB();
    //关闭快照库
    manipulatePage.clickCloseSnapshotDB();
    //开启快照库
    manipulatePage.clickStartupSnapshotDB();
    //点击开发测试库
    developDBPage.clickDevlopDB();
    //关闭开发测试库
    manipulatePage.clickCloseDevTestDB();
    //开启开发测试库
    manipulatePage.clickStartupDevTestDB();
  });
});

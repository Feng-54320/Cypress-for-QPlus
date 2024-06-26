import SrcOracleInfoPage from "../../page/oracle_page/dbbackup/src_oracle_info_page.cy";
import RecoveryDBPage from "../../page/oracle_page/recovery/oracle_recovery_page.cy";
import ManipulatePage from "../../page/oracle_page/manipulate/manipulate_page.cy";
import DevelopDBPage from "../../page/oracle_page/develop/developdb_page.cy";

describe("module：Oracle备库和快照库操作", () => {
  let srcOracleInfo;
  let manipulatePage;
  let recoveryDBPage;
  let developDBPage;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/oracle/dbbackup/elements.json").then((elements) => {
      srcOracleInfo = new SrcOracleInfoPage(elements[0]);
    });
    cy.fixture("/locator/oracle/manipulate/elements.json").then((elements) => {
      manipulatePage = new ManipulatePage(elements);
    });
    cy.fixture("/locator/oracle/recovery/elements.json").then((elements) => {
      recoveryDBPage = new RecoveryDBPage(elements);
    });
    cy.fixture("/locator/oracle/develop/elements.json").then((elements) => {
      developDBPage = new DevelopDBPage(elements);
    });
  });

  it("case 1: 创建快照", () => {
    //1. 点击oracle数据保护
    srcOracleInfo.clickOracle();
    //2. 点击创建快照
    manipulatePage.clickCreateSnapshot();
    //3. 断言创建成功
    manipulatePage.assertSnapSuccess();
  });

  it("case 2: 启停备库", () => {
    //点击oracle数据保护
    srcOracleInfo.clickOracle();
    //关闭备库
    manipulatePage.clickCloseBakDB();
    //开启备库
    manipulatePage.clickStartUPBakDB();
  });

  it.only("case 3: 启停快照库", () => {
    //点击oracle数据恢复
    recoveryDBPage.clickOracle();
    //关闭快照库
    //manipulatePage.clickCloseSnapshotDB();
    //开启快照库
    //manipulatePage.clickStartupSnapshotDB();
    //点击oracle的开发测试库
    developDBPage.clickDevlopDB();
    //关闭开发测试库
    manipulatePage.clickCloseDevTestDB();
    //开启开发测试库
    manipulatePage.clickStartupDevTestDB();
  });
});

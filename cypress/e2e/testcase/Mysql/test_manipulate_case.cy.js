import ManipulatePage from "../../page/oceanbase_page/manipulate/manipulate_page.cy";
import SrcMysqlInfoPage from "../../page/mysql_page/dbbackup/src_mysql_info_page.cy.js";
import RecoveryDBPage from "../../page/mysql_page/recovery/mysql_recovery_page.cy";
import DevelopDBPage from "../../page/mysql_page/develop/developdb_page.cy";

describe("module：MySQL备库和快照库操作", () => {
  let srcMysqlInfo;
  let recoveryDBPage;
  let developDBPage;
  let manipulatePage;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/mysql/dbbackup/elements.json").then((elements) => {
      srcMysqlInfo = new SrcMysqlInfoPage(elements[0]);
    });
    cy.fixture("/locator/mysql/develop/elements.json").then((elements) => {
      developDBPage = new DevelopDBPage(elements);
    });
    cy.fixture("/locator/mysql/recovery/elements.json").then((elements) => {
      recoveryDBPage = new RecoveryDBPage(elements);
    });
    cy.fixture("/locator/mysql/manipulate/elements.json").then(
      (elements) => {
        manipulatePage = new ManipulatePage(elements);
      }
    );
  });

  it("case 1: 创建快照", () => {
    //点击Mysql的数据保护
    srcMysqlInfo.clickMysql();
    //点击创建快照
    manipulatePage.clickCreateSnapshot();
    //断言创建成功
    manipulatePage.assertSnapSuccess();
  });

  it("case 2: 启停备库", () => {
    //点击OB的数据保护
    srcMysqlInfo.clickMysql();
    //关闭备库
    manipulatePage.clickCloseBakDB();
    //开启备库
    manipulatePage.clickStartUPBakDB();
  });

  it("case 3: 启停快照库", () => {
    //点击ob数据恢复
    recoveryDBPage.clickMysql();
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

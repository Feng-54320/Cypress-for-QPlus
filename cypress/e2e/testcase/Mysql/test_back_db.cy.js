import SrcMysqlInfoPage from "../../page/mysql_page/dbbackup/src_mysql_info_page.cy.js";
import BakMysqlInfoPage from "../../page/mysql_page/dbbackup/bak_mysql_info_page.cy";

context("module：验证登录功能", () => {
  let srcMysqlInfo;
  let bakMysqlInfo;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/mysql/dbbackup/elements.json").then((elements) => {
      srcMysqlInfo = new SrcMysqlInfoPage(elements[0]);
      bakMysqlInfo = new BakMysqlInfoPage(elements[1]);
    });
  });

  //用例1
  it("case 1： 验证Mysql数据源配置创建备库确认成功", () => {
    //1. 点击数据保护
    srcMysqlInfo.clickMysql();
    //2. 点击创建备库并输入主库信息
    srcMysqlInfo.createMysqlBakdb();
    //3. 断言连接成功
    srcMysqlInfo.assertConnDB();
    //4. 输入主机信息，点击下一步
    srcMysqlInfo.clickNextStep();
    //5. 配置备库信息
    bakMysqlInfo.typeBakDBName();
    //6. 选择规格
    bakMysqlInfo.selectComputerInstance();
    //7. 输入数据空间大小
    bakMysqlInfo.typeDataZone();
    //8. 输入日志空间大小
    bakMysqlInfo.typeLogZone();
    //9. 点击确认
    bakMysqlInfo.clickSubmit();
    cy.wait(20000);
    //断言创建成功
    bakMysqlInfo.assertCreateSuccess();
    //10. 点击确认
    bakMysqlInfo.clickConfirm();
  })

});

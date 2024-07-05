import RecoveryDBPage from "../../page/gaussdb_page/recovery/gs_recovery_page.cy";

describe("module：GasussDB 数据恢复", () => {
  let recoveryDBPage;

  //用例前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/gaussdb/recovery/elements.json").then((elements) => {
      recoveryDBPage = new RecoveryDBPage(elements);
    });
  });

  //用例1
  it("case 1： 验证创建时间点快照库", () => {
    //1. 点击数据恢复
    recoveryDBPage.clickGaussDB();
    //2. 断言恢复数据库按钮存在
    recoveryDBPage.assertRecoveryButton();
    //3. 点击恢复数据库按钮
    recoveryDBPage.clickRecoveryButton();
    //4. 点击时间点恢复
    recoveryDBPage.clickTimeRecovery();
    //5. 输入历史数据库名称
    recoveryDBPage.typeRecoveryDBName();
    //6. 选择源备库
    recoveryDBPage.selectSrcBakDB("gaussbak");
    //7. 选择快照库规模
    recoveryDBPage.selectSnapDBScale();
    //8. 增加数据存储上限, 该函数需要一个参数Times, 默认为0, 参数为几就是点击+号按钮几次
    recoveryDBPage.clickDataStoraAddButton(1);
    //10. 获取时间点范围
    recoveryDBPage.getTimeLimit();
    //11. 点击确认按钮
    recoveryDBPage.clickConfirmButton();
    //12. 断言创建成功
    recoveryDBPage.assertCreateRCYDBSuccess();
    //13. 点击进度日志的确认按钮
    recoveryDBPage.clickLogConfirmButton();
    //14. 断言启动成功
    recoveryDBPage.assertStartupSuccess();
  });
});

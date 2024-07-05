import DevelopDBPage from "../../page/oracle_page/develop/developdb_page.cy";

describe("module：Oracle开发测试库", () => {
  let developDBPage;

  //用例前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/oracle/develop/elements.json").then((elements) => {
      developDBPage = new DevelopDBPage(elements);
    });
  });

  //用例1
  it("case 1： 验证创建Oracle开发测试库", () => {
    //1. 点击oracle的开发测试库
    developDBPage.clickDevlopDB();
    //2. 断言恢复数据库按钮存在, 并点击
    developDBPage.assertCreateDevelopDBButton();
    //3. 输入开发测试库名称
    developDBPage.typeDevelopDBName();
    //4. 选择源备库
    developDBPage.selectSrcBakDB();
    //5. 规格选择
    developDBPage.selectDBScale();
    //6. 增加数据存储上限, 该函数需要一个参数Times, 默认为0, 参数为几就是点击+号按钮几次
    developDBPage.clickDataStoraAddButton();
    //7. 增加redo存储上限, 该函数需要一个参数Times, 默认为0, 参数为几就是点击+号按钮几次
    developDBPage.clickRedoAddButton();
    //8. 选择读写方式, 该函数需要一个参数: [可读写, 已读], 默认可读写
    developDBPage.clickReadWrite();
    //8. 选择恢的备份点
    developDBPage.selectSnapshot();
    //9. 点击确认按钮
    developDBPage.clickConfirmButton();
    //10. 断言创建成功
    developDBPage.assertCreateDevDBSuccess();
    //11. 点击日志进度的确认按钮
    developDBPage.clickLogConfirmButton();
  });
});

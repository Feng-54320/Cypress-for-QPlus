import AuxiliaryPlanPage from "../../page/gaussdb_page/auxiliary/auxiliary_plan_page.cy";

describe("module：GaussDB 辅助计划", () => {
  let auxiliaryPlanPage;

  //用例前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/gaussdb/auxiliary/elements.json").then((elements) => {
      auxiliaryPlanPage = new AuxiliaryPlanPage(elements);
    });
  });

  //用例1
  it("case 1： 创建辅助计划", () => {
    //1. 点击数据恢复
    auxiliaryPlanPage.clickOracle();
    //2. 断言恢复数据库按钮存在
    auxiliaryPlanPage.assertCreatePlanButton();
    //3. 点击恢复数据库按钮
    auxiliaryPlanPage.assertOpenPlanForm();
    //4. 输入计划名
    auxiliaryPlanPage.typePlanName();
    //5. 输入历史数据库名称
    auxiliaryPlanPage.typePlanDescription();
    //6. 选择源备库
    auxiliaryPlanPage.selectTargetBakDB();
    //7. 选择运行时间, 该函数需要参数,string类型, 默认'按周', 可选[按周, 按天]
    auxiliaryPlanPage.clickWeekOrDay("按天");
    //8. 增加数据存储上限, 该函数需要一个参数Time, string类型
    //参数可选: [全选, 反选, 上午, 下午, 晚上, 自定义时间比如: "18:00"] 默认为'全选'
    auxiliaryPlanPage.clickRunTime();
    //9. 选择计划参数, 需要1个参数, string类型:
    // base = ["最新", "最早", "自定义(需要指定快照名)"]
    // 默认为: 最新, 轮替, 只读
    auxiliaryPlanPage.selectParamsBase("最早");
    //cover = ["轮替", "连续"];
    auxiliaryPlanPage.selectParamsCover("连续");
    //readWri = ["只读", "读写"];
    auxiliaryPlanPage.selectParamsReadWrite("读写");
    //10. 选择规模, 需要两个参数, int类型, CPU数和内存大小, 默认为(2, 4): 表示2Core4Gi
    auxiliaryPlanPage.selectScale();
    //12. 增加数据存储, 参数同上
    auxiliaryPlanPage.clickDataStoraAddButton(1);
    //13. 点击保存按钮
    auxiliaryPlanPage.clickSaveButton();
  });
});

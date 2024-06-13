import qAssert from "../../../../support/qassert";
import Utils from "../../../../support/utils";

class AuxiliaryPlanPage {
  constructor(oracleElements) {
    this.elements = oracleElements;
  }

  //点击辅助计划
  clickOracle() {
    cy.get(this.elements.oracle_panel).should("have.text", "Oracle").click();
    cy.get(this.elements.auxiliary_plan)
      .should("have.text", "辅助计划")
      .click();
  }

  //断言创建计划按钮存在并点击
  assertCreatePlanButton() {
    qAssert.assertButtonYes(this.elements.create_plan_button);
    cy.get(this.elements.create_plan_button).click();
  }

  //断言打开创建计划表单成功
  assertOpenPlanForm() {
    qAssert.assertTextExist(this.elements.plan_form, "创建辅助计划");
  }

  //输入辅助计划名称
  typePlanName() {
    cy.get(this.elements.plan_name).type("AutoPlanTest");
  }

  //输入计划描述
  typePlanDescription() {
    cy.get(this.elements.plan_description).type("Auto test description");
  }

  //选择目标
  selectTargetBakDB() {
    cy.get(this.elements.plan_target)
      .click()
      .within(() => {
        cy.contains("Oracle 备库").click();
      });
  }

  //运行方式
  clickWeekOrDay(time = "按周") {
    //time 参数: [按周, 按天]
    cy.contains(time).click();
  }

  //运行时间
  clickRunTime(time = "全选") {
    //取消默认的23:00
    cy.contains("23:00").click()
    //time参数可选: [全选, 反选, 上午, 下午, 晚上], 或者自定义时间
    if (time === "全选") {
      cy.contains("全选").click();
    } else if (time === "反选") {
      cy.contains("反选").click();
    } else if (time === "上午") {
      cy.contains("08:00").click();
      cy.contains("09:00").click();
      cy.contains("10:00").click();
      cy.contains("11:00").click();
      cy.contains("12:00").click();
    } else if (time === "下午") {
      cy.contains("13:00").click();
      cy.contains("14:00").click();
      cy.contains("15:00").click();
      cy.contains("16:00").click();
      cy.contains("17:00").click();
      cy.contains("18:00").click();
      cy.contains("19:00").click();
    } else if (time === "晚上") {
      cy.contains("19:00").click();
      cy.contains("20:00").click();
      cy.contains("21:00").click();
      cy.contains("22:00").click();
      cy.contains("23:00").click();
    } else {
      cy.contains(time).click();
    }
  }

  //选择计划参数基于什么
  selectParamsBase(base = "最新") {
    cy.get(this.elements.param_base)
      .click()
      .then(() => {
        cy.contains(base).should("be.visible").click({ force: true });
      });
  }

  //选择参数轮替 or 连续
  selectParamsCover(cover = "轮替") {
    cy.get(this.elements.param_cover)
      .click()
      .then(() => {
        cy.contains(cover).should("be.visible").click({ force: true });
      });
  }

  //选择参数读写
  selectParamsReadWrite(readWrite = "只读") {
    cy.get(this.elements.param_read_write)
      .click()
      .then(() => {
        cy.contains(readWrite).should("be.visible").click({ force: true });
      });
  }

  //选择主机规格
  selectScale(cpu = 2, memory = 4) {
    let scale = cpu + "Core" + memory + "Gi";

    cy.get(this.elements.db_scale)
      .click()
      .then(() => {
        cy.contains(scale).click();
      });
  }

  //增加redo存储
  clickRedoAddButton(times = 0) {
    Utils.clickButtonMultipleTimes(
      this.elements.redo_storage_add_button,
      times
    );
  }

  //增加数据存储
  clickDataStoraAddButton(times = 0) {
    Utils.clickButtonMultipleTimes(
      this.elements.data_storage_add_button,
      times
    );
  }

  //选择网络地址池
  selectNetPool() {}

  //添加扩展程序, 待补充
  addExtensionScript() {
    cy.get(this.elements.extension_script);
  }

  //点击保存按钮
  clickSaveButton() {
    cy.get(this.elements.save_button).click();
  }
}
export default AuxiliaryPlanPage;

class Utils {
  //自定义工具函数: 点击页面某元素指定次数
  clickButtonMultipleTimes(element, times) {
    for (let i = 0; i < times; i++) {
      cy.get(element).click();
    }
  }
}
export default new Utils();

import SrcOracleInfoPage from "../page/oracle_bakDB_page/src_oracle_info_page.cy";
import BakOracleInfoPage from "../page/oracle_bakDB_page/bak_oracle_info_page.cy";
import ManualCommandPage from "../page/oracle_bakDB_page/manual_commands_page.cy";

context("module：验证登录功能", () => {
  let srcOracleInfo;
  let bakOracleInfo;
  let manualCommand;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/create_oracleDB_elements.json").then((elements) => {
      srcOracleInfo = new SrcOracleInfoPage(elements[0]);
      bakOracleInfo = new BakOracleInfoPage(elements[1]);
      manualCommand = new ManualCommandPage(elements[2]);
    });
  });

  //用例1
  it.skip("case 1： 验证Oracle数据源配置成功", () => {
    //1. 点击oracle数据保护
    srcOracleInfo.clickOracle();
    //2. 点击创建备库并输入主库信息
    srcOracleInfo.createOracleBakdb();
    //3. 断言连接成功
    srcOracleInfo.assertConnDB();
    //4. 获取orapw文件路径
    srcOracleInfo.getOrapwText();
    //5. 上传orapw文件
    srcOracleInfo.uploadOrapwFile();
    //6. 点击检测按钮
    srcOracleInfo.clickDetectionbutton();
    //7. 断言上传成功
    srcOracleInfo.assertUploadSuccess();
    //8. 点击数据库许可
    srcOracleInfo.clickDBlicense();
    //9. 点击下一步
    srcOracleInfo.clickNextStep();
    //10. 配置备库信息
    bakOracleInfo.typeBakDBName();
    bakOracleInfo.selectComputerInstance();
    //bakOracleInfo.typeRedoZone();
    bakOracleInfo.typeDataZone();
    //bakOracleInfo.typeArchiveZone();
    bakOracleInfo.clickNextStep();
  });

  it("case 2: 执行手动操作文档", () =>{
    //1. 点击oracle数据保护
    srcOracleInfo.clickOracle();
    //2. 点击更多按钮
    manualCommand.clickMore();
    //3. 获取tnsname文档内容
    manualCommand.getTnsnameText();
    //4. 在tnsnames.ora配置tnsname
    manualCommand.execAutoTnsname();
    //5. 获取数据同步文档内容
    manualCommand.getSyncDataText();
    //6. 执行脚本同步数据
    manualCommand.execSyncDataScript();
  })

});

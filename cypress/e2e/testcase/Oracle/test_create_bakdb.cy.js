import SrcOracleInfoPage from "../../page/oracle_page/dbbackup/src_oracle_info_page.cy";
import BakOracleInfoPage from "../../page/oracle_page/dbbackup/bak_oracle_info_page.cy";
import ManualCommandPage from "../../page/oracle_page/dbbackup/manual_commands_page.cy";
import CreateSnapshotPage from "../../page/oracle_page/dbbackup/create_snapshot.cy";

describe("module：验证登录功能", () => {
  let srcOracleInfo;
  let bakOracleInfo;
  let manualCommand;
  let createSnapshot;

  //测试套件前置：读取qplus的url和登陆用例的测试数据
  beforeEach(() => {
    cy.loginCommand();
    cy.fixture("/locator/oracle/dbbackup/elements.json").then(
      (elements) => {
        srcOracleInfo = new SrcOracleInfoPage(elements[0]);
        bakOracleInfo = new BakOracleInfoPage(elements[1]);
        manualCommand = new ManualCommandPage(elements[2]);
        createSnapshot = new CreateSnapshotPage(elements[3]);
      }
    );
  });

  //用例1
  it("case 1： 验证Oracle数据源配置成功", () => {
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
    //11. 选择规格
    bakOracleInfo.selectComputerInstance();
    //12. 输入redo空间大小
    //bakOracleInfo.typeRedoZone();
    //13. 输入数据空间大小
    bakOracleInfo.typeDataZone();
    //14. 输入归档空间大小
    //bakOracleInfo.typeArchiveZone();
    //15. 点击下一步
    bakOracleInfo.clickNextStep();
  });

  it("case 2: 执行手动操作文档", () => {
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
    cy.wait(15000)
    manualCommand.execSyncDataScript();
    //7. 获取修改log_archive_config配置文档
    manualCommand.getLogArchiveDest();
    //8. 执行归档路径配置命令
    manualCommand.execSqlScript();
    //9. 点击下一步
    manualCommand.clickNextStep();
    //10. 手动切换归档
    cy.wait(20000);
    manualCommand.execArchiveScript();
  });

  it.only("case 3: 创建快照", () => {
    //1. 点击oracle数据保护
    srcOracleInfo.clickOracle();
    //2. 点击创建快照
    createSnapshot.clickCreateSnapshot();
    //3. 断言创建成功
    createSnapshot.assertSnapSuccess();
  })
});

import LoginPage from '../page/login_page.cy';
import CreateOracleBakDB from '../page/create_bakdb_page.cy'

describe('module：验证登录功能', () => {

    let createBakDB;

    //测试套件前置：读取qplus的url和登陆用例的测试数据
    before(() => {
        cy.loginCommand();
        cy.fixture('/locator/create_oracleDB_elements.json').then((elements) => {
            createBakDB = new CreateOracleBakDB(elements);
        })
    })


    //用例1
    it('case 1： 验证连接Oracle主库成功', () => {
        //1. 点击oracle数据保护
        createBakDB.clickOracle();
        //2. 点击创建备库并输入主库信息
        createBakDB.createOracleBakdb();
        //3. 断言连接成功
        createBakDB.assertConnDB();
        //4. 获取orapw文件路径
        createBakDB.getOrapwText();

    })

})
import qAssert from '../../support/qassert.js';

class CreateOracleBakDB {
    constructor(oracleDBElements) {
        this.elements = oracleDBElements
    }

    clickOracle() {
        cy.get(this.elements.oracle_panel)
            .should('have.text', 'Oracle')
            .click()

        cy.get(this.elements.data_protect)
            .should('have.text', '数据保护')
            .click()

        cy.get(this.elements.create_bakDB)
            .should('have.text', '创建备库')
            .click()
    }

    createOracleBakdb() {
        cy.fixture('/env/oracle_env.json').then((oracleEnv) => {
            cy.get(this.elements.oracle_ip)
                .type(oracleEnv.ip)

            cy.get(this.elements.oracle_port)
                .clear()
                .type(oracleEnv.port)

            cy.get(this.elements.oracle_password)
                .type(oracleEnv.pwd)

            cy.get(this.elements.oracle_servicename)
                .type(oracleEnv.service)

            cy.get(this.elements.oracle_test_conn)
                .click()
        })
    }

    assertConnDB() {
        let element = '.ant-form-item-control-input-content > .ant-btn > span'
        qAssert.assertButton(element, 'be.visible', 'not.be.disabled')
        cy.contains('连接测试成功')
    }

    getOrapwText() {
        cy.get(this.elements.orapw_span)
            .invoke('text')
            .then((text) => {
                const lines = text.split(/\r?\n/);
                let curlCommand = '';

                // 找到包含 'curl' 的行
                lines.forEach(line => {
                    if (line.includes('curl')) {
                        curlCommand = line.trim();
                    }
                });

                cy.task('writeFile', {curlCommand, filePath: 'cypress/command_file/oracle_Orapw_cmd.txt'})

            })
    }

}
export default CreateOracleBakDB;
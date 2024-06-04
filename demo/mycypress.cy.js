

describe('first case', () => {

    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('10.10.98.9:21080')

        cy.get('legend > span')
        .should('have.text', '登录')

        cy.get(':nth-child(2) > .form__control-group > .form__control')
        .type('admin')
        .should('have.value', 'admin')

        cy.get(':nth-child(3) > .form__control-group > .form__control')
        .type('admin')
        .should('have.value', 'admin')

        cy.get('.captcha > .form__control-group > .form__control')
        // .type('czca')

        cy.wait(10000)

        cy.get('.form__btn')
        .click()
    })



    it('case 1: assert dashboard', () => {

        cy.get('.ant-breadcrumb-link')
        .should('have.text', '仪表盘')
    
    })

    it('case2 2: create bak db', () => {

        cy.get(':nth-child(2) > .nav__item--sub > :nth-child(1) > .nav__text')
        .should('have.text', 'Oracle')
        .click()

        cy.get(':nth-child(2) > .nav__item--sub > .nav > :nth-child(1) > .nav__link > .nav__text')
        .should('have.text', '数据保护')
        .click()

        cy.get('.header-action > .ant-space > .ant-space-item > .ant-btn')
        .should('have.text', '创建备库')
        .click()

        cy.readFile('cypress/fixtures/oracle.json').then((data) => {
            cy.get('#ip')
            .type(data.ip)

            cy.get('#port')
            .clear()
            .type(data.port)
            
            cy.get('#password')
            .type(data.pwd)
            
            cy.get('#serviceName')
            .type(data.service)

            cy.get('.ant-form-item-control-input-content > .ant-btn > span')
            .click()

        })
    })

    it.only('case 3: create a new user', () => {
        cy.get(':nth-child(11) > .nav__item--sub > :nth-child(1) > .nav__text')
        .should('have.text', '平台管理')
        .click()

        cy.get(':nth-child(11) > .nav__item--sub > .nav > :nth-child(1) > .nav__link > .nav__text')
        .should('have.text', '用户管理')
        .click()

        cy.get(':nth-child(2) > .ant-space-item > .btn')
        .should('have.text', '创建')
        .click()

        cy.readFile('cypress/fixtures/user_account.json').then((data) => {
            cy.get('#form_name')
            .type(data.name)

            cy.get('#form_password')
            .type(data.pwd)
            
            cy.get('#form_email')
            .type(data.email)
            
            cy.get('#form_phoneNumber')
            .type(data.phone)

            //cy.get('[for="form_service"] > .ant-checkbox-wrapper > :nth-child(2)')
            //.click()

            //点击策略管理
            cy.get('#form_service > :nth-child(2) > :nth-child(2)')
            .should('have.text', '策略管理')
            .click()

            //资源管理
            cy.get('#form_service > :nth-child(3) > :nth-child(2)')
            .click()

            //平台管理
            cy.get('#form_service > :nth-child(5) > :nth-child(2)')
            .click()

            //选择OB
            cy.get('#form_databaseType > :nth-child(4) > :nth-child(2)')
            .click()

            //选择GaussDB
            cy.get('#form_databaseType > :nth-child(5) > :nth-child(2)')
            .click()

            //点击确定
            cy.get('.ant-btn-primary > span')
            .click()

        })

    })

})

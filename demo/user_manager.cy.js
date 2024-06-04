describe('Verify platform management', () => {

    beforeEach(() => {
        cy.readFile('cypress/fixtures/user.json').then((users) => {
            const user = users[0]

            cy.visit('10.10.98.9:21080')

            cy.get('legend > span')
            .should('have.text', '登录')
    
            cy.get(':nth-child(2) > .form__control-group > .form__control')
            .type(user.name)
            .should('have.value', user.name)
    
            cy.get(':nth-child(3) > .form__control-group > .form__control')
            .type(user.pwd)
            .should('have.value', user.pwd)
    
            cy.get('.captcha > .form__control-group > .form__control')
            .click()
    
            cy.wait(10000)
    
            cy.get('.form__btn')
            .click()
        })
    })

    it('case1: Verify new user permissions', () => {
        cy.get(':nth-child(7) > .nav__item--sub > :nth-child(1) > .nav__text')
        .click()
        
        cy.get(':nth-child(7) > .nav__item--sub > .nav > .nav__item > .nav__link > .nav__text')
        .should('not.be.visible')
        .should('not.exist');
    })
})
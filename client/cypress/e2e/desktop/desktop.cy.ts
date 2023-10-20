describe('Desktop', () => {
    describe('Page', () => {
        it('Should redirect desktop agents to desktop page', () => {
            cy.visit('/mobile')
            cy.location('pathname').should('eq', '/')
        })

        it('Should create a game and redirect to page with gameID when visit main page', () => {
            cy.visit('/')
            cy.intercept('POST', '/create').as('createGame')
            cy.wait('@createGame').then((interception) =>
                cy.location('pathname').should('eq', `/${interception.response?.body.game.id}`))
        })

        it('Should create new game and redirect to it when visit non existed game', () => {
            cy.visit('/donotexists')
            cy.intercept('POST', '/create').as('createGame')
            cy.wait('@createGame').then((interception) =>
                cy.location('pathname').should('eq', `/${interception.response?.body.game.id}`))
        })

        it.only('Should show loader on first visit', () => {
            cy.visit('/')
            cy.get('[data-cy="loader"]').should('be.visible')
        })
    })
})
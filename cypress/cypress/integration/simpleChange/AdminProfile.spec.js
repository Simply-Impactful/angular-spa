/// <reference types="cypress" />

//import * as accountsdata from '../../fixtures/accountsdata.json'
const requiredExample = require('../../fixtures/accountsdata.json')

context('Admin user login', () => {
    beforeEach(() => {
        // cy.visit('http://italladdsup.world')
    })

    it('Web Portal Validation', () => {
        cy.visit('http://italladdsup.world')
        cy.url().should('include', '/landing')
        //cy.get('button[title=Navigate to Admin Home Page]').should('contain', 'italladdsup')
        cy.get('mat-grid-tile.plastic.mat-grid-tile').should('contain', 'PLASTIC POLLUTION')
        cy.get('mat-grid-tile.mat-grid-tile').should('contain', 'Being mindful is simple.')
        cy.get('mat-grid-tile.mat-grid-tile').should('contain', 'And impactful.')
    })

    it('login', () => {
        cy.get('input[name=username]').type('superUser')
        cy.get('input[name=password]').type('SuperUser!1')
        cy.get('button.mat-raised-button.mat-primary').click()
        //Verify the Redirection
        // cy.url().should('include', '/adminaccesslanding')

    })

    it('Exit from Admin portal', () => {
        cy.contains('Exit Admin Portal').click()
        cy.url().should('include', '/home')
        cy.contains('Admin Portal').click
        cy.url().should('include', '/home')
        // cy.contains('Take Action').click()
        // cy.url().should('include','/home')

    })
})
/// <reference types="cypress" />

//import * as accountsdata from '../../fixtures/accountsdata.json'
const requiredExample = require('../../fixtures/accountsdata.json')

context('student user login', () => {
    beforeEach(() => {
        // cy.visit('http://italladdsup.world')
    })
    it('redirects to site webPage validation', () => {
        cy.visit('http://italladdsup.world')
        cy.url().should('include', '/landing')
        //cy.get('button[title=Navigate to Admin Home Page]').should('contain', 'italladdsup')
        cy.get('mat-grid-tile.plastic.mat-grid-tile').should('contain', 'PLASTIC POLLUTION')
        cy.get('mat-grid-tile.mat-grid-tile').should('contain', 'Being mindful is simple.')
        cy.get('mat-grid-tile.mat-grid-tile').should('contain', 'And impactful.')
    })

    it('login', () => {
        cy.get('input[name=username]').type('Sgundala')
        cy.get('input[name=password]').type('Sunita@3')
        cy.get('button.mat-raised-button.mat-primary').click()
         //Verify the Redirection
     cy.url().should('include','/home')
     
    })
    it('About and FAQ',() =>{
        cy.contains('About').should('have.attr', 'href', 'https://www.changeissimple.org/about')
        cy.contains('FAQ').should('have.attr', 'href','http://www.changeissimple.org')
     })

    it('levels tab verification',() =>{
        cy.contains('Levels').click()
        cy.url().should('include','/level')
        cy.contains('LEVEL INFO')
        cy.contains('POINTS RANGE')
        cy.contains('LEVEL')
        cy.contains('ICON')
        cy.contains('DESCRIPTION')
    })

    it ('Groups tab verification',() =>{
        cy.visit('http://italladdsup.world/groups')
        cy.url().should('include','/groups')
        cy.contains('Groups')
    })
    xit('Contact tab verification',() =>{
        cy.contains('Contact').click
        cy.url().should('include','/contactus')
       
    })

})
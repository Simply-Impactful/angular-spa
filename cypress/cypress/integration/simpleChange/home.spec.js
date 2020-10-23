/// <reference types="cypress" />

//import * as accountsdata from '../../fixtures/accountsdata.json'
const requiredExample = require('../../fixtures/accountsdata.json')

context('login', () => {
    beforeEach(() => {
        // cy.visit('http://italladdsup.world')
    })
    it('redirects to site on success', () => {
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
     cy.url().should('include','/adminaccesslanding')
     
    })

    it('Actions',() =>{
        cy.contains('Actions').click
        cy.url().should('include','http://italladdsup.world/adminaccesslanding')
        cy.contains('+ Create New').click
        // cy.contains('FAQ').should('have.attr', 'href','http://www.changeissimple.org')
     })


    it('Exit from Admin portal',()=> {
        cy.contains('Exit Admin Portal').click()
       // cy.contains('Exit Admin Portal').should('have.attr','href', 'http://italladdsup.world/login')
        // cy.contains('Take Action').click()
        // cy.url().should('include','/home')

    })

    xit ('logout',()=>{
        cy.contains('Logout').click()
    })
    it('About and FAQ',() =>{
       cy.contains('About').should('have.attr', 'href', 'https://www.changeissimple.org/about')
       cy.contains('FAQ').should('have.attr', 'href','http://www.changeissimple.org')
    })

    it('Sign UP',()=> {
        cy.contains('Sign Up').click()
        cy.get('button#student-toggle.toggle-button').click()
        cy.get('button#teacher-toggle.toggle-button').click()
        cy.contains('First Name')
        // cy.get('#mat-input-13').type('Student1')
        // cy.get('#mat-input-14').type('SStudent1')
        // cy.get('#mat-input-15').type('Sunita123')
        // cy.get('#mat-input-16').type('Sunita123')
        // cy.get('#mat-input-17').type('sunitaranit@gmail.com')
        // cy.get('#mat-input-18').type('01886')
        // cy.get('#mat-input-19').type('Best Schools')

        // cy.contains('Create').click()
    })


})
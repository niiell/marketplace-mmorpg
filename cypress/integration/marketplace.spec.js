describe('Marketplace Home & Auth', () => {
  it('Visits the home page and sees hero', () => {
    cy.visit('/');
    cy.contains(/marketplace mmorpg/i);
  });

  it('Performs login and checks marketplace listing', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/marketplace');
    cy.contains(/listing/i); // Adjust selector/text as needed
  });
});

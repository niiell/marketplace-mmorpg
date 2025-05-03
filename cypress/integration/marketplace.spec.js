describe('Marketplace Page', () => {
  beforeEach(() => {
    cy.visit('/marketplace');
  });

  it('displays marketplace title', () => {
    cy.contains('Marketplace').should('be.visible');
  });

  it('filters listings by category', () => {
    cy.get('select#category').select('SomeCategory');
    cy.url().should('include', 'category=SomeCategory');
    cy.get('.listing-card').should('exist');
  });

  it('shows loading skeleton initially', () => {
    cy.get('.animate-pulse').should('exist');
  });

  it('shows no listings message when no data', () => {
    cy.get('select#category').select('NonExistentCategory');
    cy.contains('No listings found.').should('be.visible');
  });
});

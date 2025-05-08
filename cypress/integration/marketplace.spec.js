describe('Marketplace Page', () => {
  beforeEach(() => {
    cy.visit('/marketplace');
  });

  it('displays marketplace title', () => {
    cy.contains('Marketplace').should('be.visible');
  });

  it('filters listings by category', () => {
    const category = 'SomeCategory';
    cy.get('select#category').select(category);
    cy.url().should('include', `category=${category}`);
    cy.get('.listing-card').should('exist');
  });

  it('shows loading skeleton initially', () => {
    cy.get('.animate-pulse').should('exist');
  });

  it('shows no listings message when no data', () => {
    const nonExistentCategory = 'NonExistentCategory';
    cy.get('select#category').select(nonExistentCategory);
    cy.contains('No listings found.').should('be.visible');
  });

  it('handles error when API call fails', () => {
    cy.intercept('GET', '/api/listings', {
      statusCode: 500,
    });
    cy.visit('/marketplace');
    cy.contains('Error loading listings.').should('be.visible');
  });
});
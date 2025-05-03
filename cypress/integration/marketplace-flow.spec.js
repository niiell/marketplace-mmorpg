describe('Marketplace User Flow', () => {
  it('browse listing, chat, checkout, review, and dispute', () => {
    // Visit marketplace page
    cy.visit('/marketplace');
    // Click on first listing card
    cy.get('[data-testid="listing-card"]').first().click();

    // Chat with seller
    cy.get('[data-testid="chat-button"]').click();
    cy.get('[data-testid="chat-input"]').type('Hello, I am interested in this item{enter}');
    cy.get('[data-testid="chat-message"]').should('contain', 'Hello, I am interested in this item');

    // Proceed to checkout
    cy.get('[data-testid="buy-button"]').click();
    cy.url().should('include', '/checkout');

    // Fill checkout form and submit
    cy.get('[data-testid="checkout-form"]').within(() => {
      cy.get('input[name="address"]').type('123 Test Street');
      cy.get('button[type="submit"]').click();
    });

    // Confirm order success
    cy.get('[data-testid="order-success"]').should('be.visible');

    // Leave a review
    cy.visit('/marketplace');
    cy.get('[data-testid="listing-card"]').first().click();
    cy.get('[data-testid="review-form"]').within(() => {
      cy.get('textarea[name="review"]').type('Great product!');
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="review-list"]').should('contain', 'Great product!');

    // File a dispute
    cy.get('[data-testid="dispute-button"]').click();
    cy.get('[data-testid="dispute-form"]').within(() => {
      cy.get('textarea[name="disputeReason"]').type('Item not as described');
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="dispute-confirmation"]').should('be.visible');
  });
});

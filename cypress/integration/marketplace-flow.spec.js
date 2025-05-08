describe('Marketplace User Flow', () => {
  const listingCardSelector = '[data-testid="listing-card"]';
  const chatButtonSelector = '[data-testid="chat-button"]';
  const chatInputSelector = '[data-testid="chat-input"]';
  const chatMessageSelector = '[data-testid="chat-message"]';
  const buyButtonSelector = '[data-testid="buy-button"]';
  const checkoutFormSelector = '[data-testid="checkout-form"]';
  const addressInputSelector = 'input[name="address"]';
  const submitButtonSelector = 'button[type="submit"]';
  const orderSuccessSelector = '[data-testid="order-success"]';
  const reviewFormSelector = '[data-testid="review-form"]';
  const reviewInputSelector = 'textarea[name="review"]';
  const reviewListSelector = '[data-testid="review-list"]';
  const disputeButtonSelector = '[data-testid="dispute-button"]';
  const disputeFormSelector = '[data-testid="dispute-form"]';
  const disputeReasonInputSelector = 'textarea[name="disputeReason"]';
  const disputeConfirmationSelector = '[data-testid="dispute-confirmation"]';

  it('browse listing, chat, checkout, review, and dispute', () => {
    // Visit marketplace page
    cy.visit('/marketplace');

    // Click on first listing card
    cy.get(listingCardSelector).first().click();

    // Chat with seller
    cy.get(chatButtonSelector).click();
    cy.get(chatInputSelector).type('Hello, I am interested in this item{enter}');
    cy.get(chatMessageSelector).should('contain', 'Hello, I am interested in this item');

    // Proceed to checkout
    cy.get(buyButtonSelector).click();
    cy.url().should('include', '/checkout');

    // Fill checkout form and submit
    cy.get(checkoutFormSelector).within(() => {
      cy.get(addressInputSelector).type('123 Test Street');
      cy.get(submitButtonSelector).click();
    });

    // Confirm order success
    cy.get(orderSuccessSelector).should('be.visible');

    // Leave a review
    cy.visit('/marketplace');
    cy.get(listingCardSelector).first().click();
    cy.get(reviewFormSelector).within(() => {
      cy.get(reviewInputSelector).type('Great product!');
      cy.get(submitButtonSelector).click();
    });
    cy.get(reviewListSelector).should('contain', 'Great product!');

    // File a dispute
    cy.get(disputeButtonSelector).click();
    cy.get(disputeFormSelector).within(() => {
      cy.get(disputeReasonInputSelector).type('Item not as described');
      cy.get(submitButtonSelector).click();
    });
    cy.get(disputeConfirmationSelector).should('be.visible');
  });
});
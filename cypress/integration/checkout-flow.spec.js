describe('Checkout Flow', () => {
  beforeEach(() => {
    // Mock Supabase auth
    cy.intercept('POST', '/auth/v1/token?grant_type=password', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    }).as('login');

    // Mock listing data
    cy.intercept('GET', '/rest/v1/listings*', {
      statusCode: 200,
      body: [{
        id: 'test-listing',
        title: 'Test Item',
        price: 1000,
        image_url: '/test-image.jpg',
        seller_id: 'seller-id',
        stock: 5
      }]
    }).as('getListing');

    // Login before each test
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
  });

  it('completes checkout process successfully', () => {
    // Navigate to product and add to cart
    cy.visit('/product/test-listing');
    cy.get('[data-testid="buy-button"]').click();
    cy.get('[data-testid="cart-icon"]').click();

    // Verify cart contents
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.get('[data-testid="item-title"]').should('contain', 'Test Item');
    cy.get('[data-testid="item-price"]').should('contain', '1,000');

    // Start checkout
    cy.get('[data-testid="checkout-button"]').click();

    // Fill shipping info
    cy.get('#address').type('123 Test Street');
    cy.get('#city').type('Test City');
    cy.get('#postalCode').type('12345');

    // Review order
    cy.get('button').contains('Review Order').click();

    // Verify review page
    cy.get('[data-testid="review-item"]').should('have.length', 1);
    cy.get('[data-testid="shipping-address"]').should('contain', '123 Test Street');
    cy.get('[data-testid="total-amount"]').should('contain', '1,000');

    // Mock payment API call
    cy.intercept('POST', '/api/checkout', {
      statusCode: 200,
      body: {
        payment_url: 'https://test-payment.com'
      }
    }).as('createPayment');

    // Confirm order
    cy.get('button').contains('Confirm & Pay').click();
    cy.wait('@createPayment');

    // Verify redirect to payment
    cy.url().should('include', 'test-payment.com');
  });

  it('handles out of stock items', () => {
    // Mock out of stock listing
    cy.intercept('GET', '/rest/v1/listings*', {
      statusCode: 200,
      body: [{
        id: 'test-listing',
        title: 'Test Item',
        price: 1000,
        image_url: '/test-image.jpg',
        seller_id: 'seller-id',
        stock: 0
      }]
    }).as('getOutOfStockListing');

    cy.visit('/product/test-listing');
    cy.get('[data-testid="buy-button"]').should('be.disabled');
    cy.get('[data-testid="out-of-stock"]').should('be.visible');
  });

  it('validates shipping information', () => {
    cy.visit('/checkout/test-listing');

    // Try to proceed without filling shipping info
    cy.get('button').contains('Review Order').should('be.disabled');

    // Fill invalid postal code
    cy.get('#address').type('123 Test Street');
    cy.get('#city').type('Test City');
    cy.get('#postalCode').type('abc'); // Invalid postal code

    cy.get('[data-testid="postal-error"]').should('be.visible');
    cy.get('button').contains('Review Order').should('be.disabled');

    // Fix postal code
    cy.get('#postalCode').clear().type('12345');
    cy.get('button').contains('Review Order').should('be.enabled');
  });

  it('handles payment failures gracefully', () => {
    // Setup payment failure
    cy.intercept('POST', '/api/checkout', {
      statusCode: 400,
      body: {
        error: 'Payment failed'
      }
    }).as('failedPayment');

    cy.visit('/checkout/test-listing');

    // Fill shipping info
    cy.get('#address').type('123 Test Street');
    cy.get('#city').type('Test City');
    cy.get('#postalCode').type('12345');

    cy.get('button').contains('Review Order').click();
    cy.get('button').contains('Confirm & Pay').click();

    // Verify error handling
    cy.get('[data-testid="error-message"]').should('contain', 'Payment failed');
    cy.get('button').contains('Try Again').should('be.visible');
  });

  it('preserves cart contents after page reload', () => {
    // Add item to cart
    cy.visit('/product/test-listing');
    cy.get('[data-testid="buy-button"]').click();

    // Reload page
    cy.reload();

    // Verify cart still contains item
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });
});
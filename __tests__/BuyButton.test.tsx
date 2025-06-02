import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BuyButton from '../src/components/BuyButton';
import { CartProvider } from '../src/context/CartContext';
import { CurrencyProvider } from '../src/context/CurrencyContext';

// Mock Framer Motion with proper component props handling
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    div: ({ children, animate, initial, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, animate, initial, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CurrencyProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </CurrencyProvider>
);

describe('BuyButton', () => {
  const mockItem = {
    id: '1',
    title: 'Test Item',
    price: 100,
    image_url: 'test.jpg',
    stock: 5
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper });
  };

  it('renders in disabled state when prop is true', () => {
    renderWithProviders(<BuyButton item={mockItem} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockItem = {
      ...mockItem,
      stock: 0,
    };
    renderWithProviders(<BuyButton item={outOfStockItem} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('allows quantity selection when in stock', async () => {
    const inStockItem = {
      ...mockItem,
      stock: 5,
    };
    renderWithProviders(<BuyButton item={inStockItem} />);
    
    // Initial state should show "Add to Cart"
    const addToCartButton = screen.getByRole('button');
    expect(addToCartButton).not.toBeDisabled();
    fireEvent.click(addToCartButton);
    
    // After clicking, quantity controls should be visible
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    });
  });
});
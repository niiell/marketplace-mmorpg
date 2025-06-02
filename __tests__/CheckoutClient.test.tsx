import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckoutClient from '../src/app/checkout/[listingId]/CheckoutClient';
import { supabase } from '../src/lib/supabase';
import { CurrencyProvider } from '../src/context/CurrencyContext';
import { useRouter } from 'next/navigation';

// Mock Supabase client
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
    rpc: jest.fn(),
  },
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CheckoutClient', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <CurrencyProvider>
        {ui}
      </CurrencyProvider>
    );
  };

  it('redirects to login if user is not authenticated', async () => {
    // Mock getUser to return no user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderWithProviders(<CheckoutClient listingId="test-listing" />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('handles insufficient stock error', async () => {
    // Mock authenticated user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    // Mock listing with no stock
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          seller_id: 'seller-id',
          price: 1000,
          stock: 0,
        },
        error: null,
      }),
    });

    renderWithProviders(<CheckoutClient listingId="test-listing" />);

    await waitFor(() => {
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });
  });

  it('handles transaction creation error', async () => {
    // Mock authenticated user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    // Mock listing with stock
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          seller_id: 'seller-id',
          price: 1000,
          stock: 5,
        },
        error: null,
      }),
    });

    // Mock transaction creation error
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Transaction failed' },
    });

    renderWithProviders(<CheckoutClient listingId="test-listing" />);

    await waitFor(() => {
      expect(screen.getByText(/failed to create transaction/i)).toBeInTheDocument();
    });
  });

  it('redirects to payment URL on successful checkout', async () => {
    // Mock authenticated user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    // Mock listing with stock
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          seller_id: 'seller-id',
          price: 1000,
          stock: 5,
        },
        error: null,
      }),
    });

    // Mock successful transaction creation
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: { id: 'trx-id' },
      error: null,
    });

    // Mock fetch for payment URL
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ payment_url: 'https://payment.example.com' }),
    });

    renderWithProviders(<CheckoutClient listingId="test-listing" />);

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith('https://payment.example.com');
    });
  });

  it('displays loading state correctly', () => {
    // Mock authenticated user but delay the response
    (supabase.auth.getUser as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderWithProviders(<CheckoutClient listingId="test-listing" />);

    expect(screen.getByText(/preparing your order/i)).toBeInTheDocument();
  });
});
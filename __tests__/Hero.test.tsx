import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero', () => {
  it('renders the main hero text', () => {
    render(<Hero />);
    expect(screen.getByText(/marketplace mmorpg/i)).toBeInTheDocument();
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders the hero component with correct alt text', () => {
    render(<Hero />);
    expect(screen.getByAltText('hero image')).toBeInTheDocument();
  });

  it('renders the hero component with correct link', () => {
    render(<Hero />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
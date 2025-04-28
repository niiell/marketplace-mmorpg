import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero', () => {
  it('renders the main hero text', () => {
    render(<Hero />);
    expect(screen.getByText(/marketplace mmorpg/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SmokeButton from '../src/components/SmokeButton';

describe('SmokeButton', () => {
  it('renders button with children', () => {
    render(<SmokeButton>Click me</SmokeButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<SmokeButton onClick={handleClick}>Click me</SmokeButton>);
    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional className', () => {
    render(<SmokeButton className="custom-class">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders button with disabled state', () => {
    render(<SmokeButton disabled>Click me</SmokeButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders button with type attribute', () => {
    render(<SmokeButton type="submit">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
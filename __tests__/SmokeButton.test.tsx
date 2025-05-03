import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SmokeButton from '../src/components/SmokeButton';

describe('SmokeButton', () => {
  test('renders button with children', () => {
    render(<SmokeButton>Click me</SmokeButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<SmokeButton onClick={handleClick}>Click me</SmokeButton>);
    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional className', () => {
    render(<SmokeButton className="custom-class">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

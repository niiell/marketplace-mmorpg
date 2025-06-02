import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SmokeButton } from '../src/components/SmokeButton';

jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

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

  it('renders button with different variants', () => {
    const { rerender } = render(<SmokeButton variant="primary">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('from-blue-600', 'to-indigo-600');

    rerender(<SmokeButton variant="secondary">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('from-gray-600', 'to-gray-700');

    rerender(<SmokeButton variant="success">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('from-green-600', 'to-emerald-600');
  });

  it('renders button with different sizes', () => {
    const { rerender } = render(<SmokeButton size="sm">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<SmokeButton size="md">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<SmokeButton size="lg">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('applies fullWidth class when specified', () => {
    render(<SmokeButton fullWidth>Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renders with correct button type', () => {
    const { rerender } = render(<SmokeButton type="submit">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<SmokeButton type="reset">Click me</SmokeButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });
});
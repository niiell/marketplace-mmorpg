import React from 'react';
import { render } from '@testing-library/react';
import SkeletonLoader from '../src/components/SkeletonLoader';

describe('SkeletonLoader', () => {
  test('renders with default props', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  test('applies custom width and height', () => {
    const { container } = render(<SkeletonLoader width="100px" height="50px" />);
    expect(container.firstChild).toHaveStyle('width: 100px');
    expect(container.firstChild).toHaveStyle('height: 50px');
  });

  test('applies additional className', () => {
    const { container } = render(<SkeletonLoader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

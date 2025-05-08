import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SkeletonLoader from '../src/components/SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders with default props', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('applies custom width and height', () => {
    const { container } = render(<SkeletonLoader width="100px" height="50px" />);
    expect(container.firstChild).toHaveStyle('width: 100px');
    expect(container.firstChild).toHaveStyle('height: 50px');
  });

  it('applies additional className', () => {
    const { container } = render(<SkeletonLoader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders without crashing', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container).toMatchSnapshot();
  });
});
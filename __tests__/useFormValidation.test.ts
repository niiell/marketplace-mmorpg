import { renderHook, act } from '@testing-library/react-hooks';
import { useFormValidation } from '../src/hooks/useFormValidation';

const validationRules = {
  username: [
    (value: string) => (value.length === 0 ? 'Username is required' : null),
    (value: string) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
  ],
  email: [
    (value: string) => (value.length === 0 ? 'Email is required' : null),
    (value: string) => (!/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : null),
  ],
};

describe('useFormValidation', () => {
  const setupHook = (initialValues) => {
    return renderHook(() =>
      useFormValidation({ initialValues, validationRules })
    );
  };

  test('initializes with initial values and no errors', () => {
    const { result } = setupHook({ username: '', email: '' });
    expect(result.current.values).toEqual({ username: '', email: '' });
    expect(result.current.errors).toEqual({ username: 'Username is required', email: 'Email is required' });
  });

  test('updates values and validates fields', () => {
    const { result } = setupHook({ username: '', email: '' });

    act(() => {
      result.current.handleChange('username', 'ab');
    });
    expect(result.current.values.username).toBe('ab');
    expect(result.current.errors.username).toBe('Username must be at least 3 characters');

    act(() => {
      result.current.handleChange('username', 'abc');
    });
    expect(result.current.errors.username).toBeNull();

    act(() => {
      result.current.handleChange('email', 'invalid-email');
    });
    expect(result.current.errors.email).toBe('Email is invalid');

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    expect(result.current.errors.email).toBeNull();
  });

  test('handles multiple field updates', () => {
    const { result } = setupHook({ username: '', email: '' });

    act(() => {
      result.current.handleChange('username', 'abc');
      result.current.handleChange('email', 'test@example.com');
    });
    expect(result.current.values).toEqual({ username: 'abc', email: 'test@example.com' });
    expect(result.current.errors).toEqual({ username: null, email: null });
  });
});
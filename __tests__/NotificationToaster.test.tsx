import { render, screen, act, fireEvent } from '@testing-library/react';
import NotificationToaster, { Notification } from '../src/components/NotificationToaster';
import { useFirebaseMessaging } from '../src/hooks/useFirebaseMessaging';

// Mock Firebase messaging hook
jest.mock('../src/hooks/useFirebaseMessaging', () => ({
  useFirebaseMessaging: jest.fn()
}));

// Mock Supabase
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    })),
    removeChannel: jest.fn()
  }
}));

describe('NotificationToaster', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info',
      duration: 5000
    }
  ];

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFirebaseMessaging as jest.Mock).mockReturnValue({ message: null });
  });

  it('renders notifications correctly', () => {
    render(
      <NotificationToaster
        notifications={mockNotifications}
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
  });

  it('handles notification dismissal', () => {
    render(
      <NotificationToaster
        notifications={mockNotifications}
        onDismiss={mockOnDismiss}
      />
    );

    const dismissButton = screen.getByLabelText('Dismiss notification');
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledWith('1');
  });

  it('handles FCM messages', () => {
    const fcmMessage = {
      notification: {
        title: 'FCM Notification',
        body: 'This is from Firebase'
      },
      data: {
        type: 'success',
        url: 'https://example.com'
      }
    };

    (useFirebaseMessaging as jest.Mock).mockReturnValue({ message: fcmMessage });

    render(
      <NotificationToaster
        notifications={[]}
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText('FCM Notification')).toBeInTheDocument();
    expect(screen.getByText('This is from Firebase')).toBeInTheDocument();
  });

  it('handles notification click with URL', () => {
    const notificationWithUrl: Notification[] = [
      {
        id: '2',
        title: 'Clickable Notification',
        message: 'Click me',
        type: 'info',
        url: 'https://example.com'
      }
    ];

    render(
      <NotificationToaster
        notifications={notificationWithUrl}
        onDismiss={mockOnDismiss}
      />
    );

    const notification = screen.getByText('Clickable Notification').parentElement?.parentElement;
    fireEvent.click(notification!);

    expect(window.location.assign).toHaveBeenCalledWith('https://example.com');
    expect(mockOnDismiss).toHaveBeenCalledWith('2');
  });

  it('pauses auto-dismiss on hover', () => {
    jest.useFakeTimers();

    render(
      <NotificationToaster
        notifications={mockNotifications}
        onDismiss={mockOnDismiss}
      />
    );

    const notification = screen.getByText('Test Notification').parentElement?.parentElement;
    expect(notification).toBeTruthy();

    // Hover over notification
    if (notification) {
      fireEvent.mouseEnter(notification);
    }

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    // Notification should still be visible
    expect(mockOnDismiss).not.toHaveBeenCalled();

    // Mouse leave
    if (notification) {
      fireEvent.mouseLeave(notification);
    }

    // Fast-forward time again
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    // Now it should be dismissed
    expect(mockOnDismiss).toHaveBeenCalledWith('1');

    jest.useRealTimers();
  });

  it('groups notifications properly', () => {
    const multipleNotifications: Notification[] = [
      {
        id: '1',
        title: 'First Notification',
        message: 'First message',
        type: 'info'
      },
      {
        id: '2',
        title: 'Second Notification',
        message: 'Second message',
        type: 'success'
      }
    ];

    render(
      <NotificationToaster
        notifications={multipleNotifications}
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText('First Notification')).toBeInTheDocument();
    expect(screen.getByText('Second Notification')).toBeInTheDocument();
  });
});
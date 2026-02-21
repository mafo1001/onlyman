import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

describe('BottomNav', () => {
  it('renders all navigation items', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Radar')).toBeInTheDocument();
    expect(screen.getByText('Spark')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('shows unread badge when unreadCount > 0', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav unreadCount={5} />
      </MemoryRouter>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not show unread badge when count is 0', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav unreadCount={0} />
      </MemoryRouter>
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});

describe('RouteErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(
      <RouteErrorBoundary name="Test">
        <div>Hello World</div>
      </RouteErrorBoundary>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RouteErrorBoundary name="Test">
        <ThrowingComponent />
      </RouteErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});

import { Component } from 'react';

/**
 * Route-level error boundary.
 * Catches rendering errors in individual routes without crashing the entire app.
 * Shows a friendly error message with a retry button.
 */
export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`RouteErrorBoundary [${this.props.name || 'unknown'}]:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,68,68,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            fontSize: 28,
          }}>
            ⚠️
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Something went wrong
          </h3>
          <p style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
            maxWidth: 280, marginBottom: 20,
          }}>
            This page encountered an error. Your data is safe.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent)',
                color: '#000',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.hash = '#/'}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: 14,
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: 24, fontSize: 11, color: '#ff4444',
              textAlign: 'left', maxWidth: '90vw', overflow: 'auto',
              padding: 12, background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}>
              {String(this.state.error)}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

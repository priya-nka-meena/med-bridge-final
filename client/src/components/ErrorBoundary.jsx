import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#F7F9FC',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px',
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0F1F3D', marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <details style={{ textAlign: 'left', margin: '1.5rem 0', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#0F1F3D', marginBottom: '0.5rem', userSelect: 'none' }}>Technical details</summary>
              <pre style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflowY: 'auto' }}>
                {this.state.error && this.state.error.toString()}
                <br /><br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button 
              style={{
                padding: '0.75rem 2rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

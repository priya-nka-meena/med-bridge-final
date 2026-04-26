import React from 'react';

export default function ErrorMessage({ 
  error, 
  onRetry, 
  onDismiss, 
  variant = 'default',
  className = ''
}) {
  const variantClasses = {
    default: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const iconMap = {
    default: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };

  if (!error) return null;

  return (
    <div style={{
      ...variantClasses[variant],
      border: '1px solid',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      ...className && { className }
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '18px', marginRight: '8px', flexShrink: 0 }}>
          {iconMap[variant]}
        </span>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
            {typeof error === 'string' ? 'Error' : error.title || 'Error'}
          </h4>
          <p style={{ fontSize: '14px' }}>
            {typeof error === 'string' ? error : error.message || error.toString()}
          </p>
          {error.details && (
            <details style={{ marginTop: '8px' }}>
              <summary style={{ fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                More details
              </summary>
              <pre style={{ fontSize: '12px', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                {error.details}
              </pre>
            </details>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              fontSize: '18px',
              lineHeight: 1,
              cursor: 'pointer',
              opacity: 0.7
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

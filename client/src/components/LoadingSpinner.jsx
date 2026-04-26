import React from 'react';

export default function LoadingSpinner({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '',
  overlay = false 
}) {
  const sizeStyles = {
    small: { width: '16px', height: '16px' },
    medium: { width: '32px', height: '32px' },
    large: { width: '48px', height: '48px' },
    xlarge: { width: '64px', height: '64px' }
  };

  const textSizes = {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px'
  };

  const spinner = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...className && { className }
    }}>
      <div 
        style={{
          ...sizeStyles[size],
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <span style={{
          marginTop: '8px',
          fontSize: textSizes[size],
          color: '#64748b',
          fontWeight: '500'
        }}>
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

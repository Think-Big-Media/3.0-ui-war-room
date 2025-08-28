import React from 'react';

export default function TestApp() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#00ff00',
      color: '#000000',
      fontSize: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: 999999999
    }}>
      <h1>TEST APP RENDERS!</h1>
      <p>If you see this, React is working!</p>
      <p>URL: {window.location.pathname}</p>
    </div>
  );
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

window.onerror = function (msg, url, line, col, error) {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#991b1b;padding:16px;z-index:99999;font-family:sans-serif;font-size:14px;border-bottom:2px solid #ef4444;';
  errDiv.innerHTML = '<strong>Application Error:</strong> ' + msg + '<br/><small>' + url + ':' + line + '</small>';
  document.body.appendChild(errDiv);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fee2e2', color: '#991b1b', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong rendering the UI:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', marginTop: '10px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07080d',
          color: '#dde1f0',
          fontFamily: 'Outfit, sans-serif',
          padding: '32px',
          gap: '16px',
        }}>
          <div style={{ fontSize: 32 }}>⚠</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Something went wrong</div>
          <pre style={{
            background: '#0e0f17',
            border: '1px solid #1a1b2e',
            borderRadius: 8,
            padding: '16px',
            fontSize: 13,
            color: '#f04f5a',
            maxWidth: 640,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#7c6af7',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

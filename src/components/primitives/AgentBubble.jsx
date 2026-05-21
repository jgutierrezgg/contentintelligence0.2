import { C } from '../../constants/colors'

export default function AgentBubble({ text, typing }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: C.accentGlow, border: `1px solid ${C.accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, flexShrink: 0, marginTop: 2,
      }}>
        AI
      </div>
      <div style={{
        background: C.surfaceHigh,
        border: `1px solid ${C.border}`,
        borderRadius: '0 10px 10px 10px',
        padding: '10px 14px',
        fontSize: 13,
        lineHeight: 1.6,
        color: C.text,
        maxWidth: '85%',
      }}>
        {typing ? (
          <span style={{ color: C.textMuted }}>
            <TypingDots />
          </span>
        ) : text}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#5a607a',
            display: 'inline-block',
            animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </span>
  )
}

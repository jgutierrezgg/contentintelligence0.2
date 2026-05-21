import { useState, useEffect } from 'react'
import { C } from '../../constants/colors'

export default function AutoProcess({ steps, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState([])

  useEffect(() => {
    if (current >= steps.length) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => {
      setDone(d => [...d, current])
      setCurrent(c => c + 1)
    }, 1800)
    return () => clearTimeout(t)
  }, [current, steps.length, onComplete])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((step, i) => {
        const isDone = done.includes(i)
        const isActive = i === current
        return (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              background: isDone ? `${C.green}11` : isActive ? C.accentGlow : 'transparent',
              border: `1px solid ${isDone ? C.green + '33' : isActive ? C.accent + '44' : C.border}`,
              transition: 'all 0.3s',
            }}
          >
            <span style={{ fontSize: 14 }}>
              {isDone ? '✓' : isActive ? '⟳' : '○'}
            </span>
            <span style={{
              fontSize: 13,
              color: isDone ? C.green : isActive ? C.text : C.textMuted,
            }}>
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}

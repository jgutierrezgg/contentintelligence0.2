import { useState, useEffect } from 'react'
import styles from './AutoProcess.module.css'

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
    <div className={styles.list}>
      {steps.map((step, i) => {
        const isDone   = done.includes(i)
        const isActive = i === current
        return (
          <div
            key={i}
            className={[
              styles.step,
              isDone   ? styles.done   : '',
              isActive ? styles.active : '',
            ].filter(Boolean).join(' ')}
          >
            <span className={styles.icon}>
              {isDone ? '✓' : isActive ? '⟳' : '○'}
            </span>
            <span className={styles.label}>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

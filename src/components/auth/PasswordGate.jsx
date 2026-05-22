import { useState } from 'react'
import styles from './auth.module.css'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'

const CORRECT = import.meta.env.VITE_APP_PASSWORD ?? 'c£^$3vJZv8873vJ'

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const attempt = () => {
    if (value === CORRECT) {
      try { sessionStorage.setItem('ci_unlocked', '1') } catch {}
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card} onKeyDown={e => e.key === 'Enter' && attempt()}>
        <div className={styles.logo}>
          <div className={styles.logoName}>Content Intelligence</div>
          <div className={styles.logoSub}>by Marketfully</div>
        </div>

        <Input
          value={value}
          onChange={v => { setValue(v); setError(false) }}
          placeholder="Password"
          type="password"
        />

        {error && <p className={styles.errorText}>Incorrect password.</p>}

        <Btn onClick={attempt}>Enter →</Btn>
      </div>
    </div>
  )
}

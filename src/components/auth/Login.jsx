import { useState, useEffect, useRef } from 'react'
import styles from './auth.module.css'
import Btn from '../primitives/Btn'
import Input from '../primitives/Input'
import { generateSalt, hashPassword, verifyPassword } from '../../utils/crypto'

const AUTH_KEY   = 'ci_auth'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 30_000

function loadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
}
function saveAuth(data) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(data)) } catch {}
}

export default function Login({ onAuthenticated }) {
  const hasPassword = !!loadAuth()
  const [mode, setMode]         = useState(hasPassword ? 'login' : 'register')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockUntil, setLockUntil] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  const locked = lockUntil && Date.now() < lockUntil

  useEffect(() => {
    if (!lockUntil) return
    const tick = () => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockUntil(null)
        setCountdown(0)
        setError('')
        clearInterval(timerRef.current)
      } else {
        setCountdown(remaining)
      }
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => clearInterval(timerRef.current)
  }, [lockUntil])

  const handleRegister = async () => {
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const salt = generateSalt()
      const hash = await hashPassword(password, salt)
      saveAuth({ hash, salt })
      onAuthenticated()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (locked) return
    setError('')
    const stored = loadAuth()
    if (!stored) return setError('No password set.')

    setLoading(true)
    try {
      const valid = await verifyPassword(password, stored.hash, stored.salt)
      if (valid) {
        setAttempts(0)
        onAuthenticated()
      } else {
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) {
          setLockUntil(Date.now() + LOCKOUT_MS)
          setError(`Too many attempts. Wait ${LOCKOUT_MS / 1000} seconds.`)
        } else {
          setError(`Incorrect password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? 's' : ''} remaining.`)
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !loading && !locked)
      mode === 'login' ? handleLogin() : handleRegister()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card} onKeyDown={handleKey}>
        <div className={styles.logo}>
          <div className={styles.logoName}>Content Intelligence</div>
          <div className={styles.logoSub}>by Marketfully</div>
        </div>

        <h2 className={styles.heading}>
          {mode === 'login' ? 'Enter password' : 'Set a password'}
        </h2>
        <p className={styles.subheading}>
          {mode === 'login'
            ? 'Enter your password to access your workspaces.'
            : 'Choose a password to protect your workspaces.'}
        </p>

        {error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠</span>
            {locked ? `Locked. Try again in ${countdown}s.` : error}
          </div>
        )}

        <div className={styles.fields}>
          <Input
            value={password}
            onChange={setPassword}
            placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
            type="password"
          />
          {mode === 'register' && (
            <Input
              value={confirm}
              onChange={setConfirm}
              placeholder="Confirm password"
              type="password"
            />
          )}
        </div>

        <Btn
          onClick={mode === 'login' ? handleLogin : handleRegister}
          disabled={loading || locked}
        >
          {loading ? 'Verifying…' : locked ? `Locked (${countdown}s)` : mode === 'login' ? 'Enter →' : 'Set password →'}
        </Btn>

        {mode === 'login' && (
          <p className={styles.hint}>Forgot your password? Clear browser data to reset.</p>
        )}
      </div>
    </div>
  )
}

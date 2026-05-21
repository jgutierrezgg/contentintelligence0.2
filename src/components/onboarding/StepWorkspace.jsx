import { useState } from 'react'
import styles from './onboarding.module.css'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'

export default function StepWorkspace({ onNext }) {
  const [name, setName] = useState('')

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Name your workspace</h2>
      <p className={styles.lead}>
        This is how your team will identify this space. You can change it later.
      </p>
      <Input value={name} onChange={setName} placeholder="e.g. Acme Marketing" />
      <div className={styles.actions}>
        <Btn onClick={() => name.trim() && onNext(name.trim())} disabled={!name.trim()}>
          Continue →
        </Btn>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { C } from '../../constants/colors'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'

export default function StepWorkspace({ onNext }) {
  const [name, setName] = useState('')

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Name your workspace</h2>
      <p style={{ color: C.textMuted, marginBottom: 32 }}>
        This is how your team will identify this space. You can change it later.
      </p>
      <Input
        value={name}
        onChange={setName}
        placeholder="e.g. Acme Marketing"
      />
      <div style={{ marginTop: 20 }}>
        <Btn onClick={() => name.trim() && onNext(name.trim())} disabled={!name.trim()}>
          Continue →
        </Btn>
      </div>
    </div>
  )
}

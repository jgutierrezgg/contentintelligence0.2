import { useState } from 'react'
import { C } from '../../constants/colors'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import AddBrandFlow from './AddBrandFlow'

export default function StepBrands({ onNext }) {
  const [brands, setBrands] = useState([])
  const [adding, setAdding] = useState(false)

  const handleAdd = (brand) => {
    setBrands(b => [...b, brand])
    setAdding(false)
  }

  const removeBrand = (id) => setBrands(b => b.filter(x => x.id !== id))

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Add your brands</h2>
      <p style={{ color: C.textMuted, marginBottom: 32 }}>
        Each brand gets its own AI-generated profile with competitors and SEO data.
      </p>

      {brands.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {brands.map(brand => (
            <Card key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: C.accentGlow, border: `1px solid ${C.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: C.accent, fontSize: 14,
              }}>
                {brand.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{brand.name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Tag>{brand.industry}</Tag>
                  <Tag color={C.textMuted}>{brand.competitors.length} competitors</Tag>
                </div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => removeBrand(brand.id)}>Remove</Btn>
            </Card>
          ))}
        </div>
      )}

      {adding ? (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14, color: C.text }}>Brand Setup</div>
          <AddBrandFlow onAdd={handleAdd} onCancel={() => setAdding(false)} />
        </Card>
      ) : (
        <Btn variant="secondary" onClick={() => setAdding(true)} style={{ marginBottom: 24 }}>
          + Add brand
        </Btn>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Btn onClick={() => brands.length > 0 && onNext(brands)} disabled={brands.length === 0}>
          Continue →
        </Btn>
        {brands.length === 0 && (
          <span style={{ fontSize: 12, color: C.textMuted }}>Add at least one brand to continue.</span>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { C } from '../../constants/colors'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import AddBrandFlow from '../onboarding/AddBrandFlow'

export default function BrandsView({ brands, onAddBrand, onRemoveBrand }) {
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Brands</h1>
          <p style={{ color: C.textMuted, marginTop: 4, fontSize: 14 }}>
            {brands.length} brand{brands.length !== 1 ? 's' : ''} in workspace
          </p>
        </div>
        {!adding && <Btn onClick={() => setAdding(true)}>+ Add Brand</Btn>}
      </div>

      {adding && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Brand Setup</div>
          <AddBrandFlow
            onAdd={(brand) => { onAddBrand(brand); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {brands.map(brand => (
          <Card key={brand.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: C.accentGlow, border: `1px solid ${C.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: C.accent, fontSize: 18,
            }}>
              {brand.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{brand.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Tag>{brand.industry}</Tag>
                <Tag color={C.textMuted}>{brand.url}</Tag>
                <Tag color={C.green} bg={`${C.green}15`}>
                  {brand.competitors?.length ?? 0} competitors
                </Tag>
              </div>
            </div>
            <Btn variant="danger" size="sm" onClick={() => onRemoveBrand(brand.id)}>Remove</Btn>
          </Card>
        ))}
      </div>
    </div>
  )
}

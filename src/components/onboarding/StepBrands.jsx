import { useState } from 'react'
import styles from './onboarding.module.css'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import AddBrandFlow from './AddBrandFlow'

export default function StepBrands({ onNext }) {
  const [brands, setBrands] = useState([])
  const [adding, setAdding] = useState(false)

  const handleAdd = (brand) => { setBrands(b => [...b, brand]); setAdding(false) }
  const removeBrand = (id) => setBrands(b => b.filter(x => x.id !== id))

  return (
    <div className={styles.containerLg}>
      <h2 className={styles.heading}>Add your brands</h2>
      <p className={styles.lead}>
        Each brand gets its own AI-generated profile with competitors and SEO data.
      </p>

      {brands.length > 0 && (
        <div className={styles.brandList}>
          {brands.map(brand => (
            <Card key={brand.id} className={styles.brandCard}>
              <div className={styles.brandAvatar}>{brand.name[0]}</div>
              <div className={styles.brandMeta}>
                <div className={styles.brandName}>{brand.name}</div>
                <div className={styles.brandTags}>
                  <Tag>{brand.industry}</Tag>
                  <Tag>{brand.competitors.length} competitors</Tag>
                </div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => removeBrand(brand.id)}>Remove</Btn>
            </Card>
          ))}
        </div>
      )}

      {adding ? (
        <Card style={{ marginBottom: 20 }}>
          <div className={styles.brandName} style={{ marginBottom: 14 }}>Brand Setup</div>
          <AddBrandFlow onAdd={handleAdd} onCancel={() => setAdding(false)} />
        </Card>
      ) : (
        <Btn variant="secondary" onClick={() => setAdding(true)} style={{ marginBottom: 24 }}>
          + Add brand
        </Btn>
      )}

      <div className={styles.actions}>
        <Btn onClick={() => brands.length > 0 && onNext(brands)} disabled={brands.length === 0}>
          Continue →
        </Btn>
        {brands.length === 0 && (
          <span className={styles.hint}>Add at least one brand to continue.</span>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import styles from './dashboard.module.css'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import AddBrandFlow from '../onboarding/AddBrandFlow'

export default function BrandsView({ brands, onAddBrand, onRemoveBrand }) {
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Brands</h1>
          <p className={styles.pageSubtitle}>
            {brands.length} brand{brands.length !== 1 ? 's' : ''} in workspace
          </p>
        </div>
        {!adding && <Btn onClick={() => setAdding(true)}>+ Add Brand</Btn>}
      </div>

      {adding && (
        <Card style={{ marginBottom: 20 }}>
          <div className={styles.brandName} style={{ marginBottom: 14 }}>Brand Setup</div>
          <AddBrandFlow
            onAdd={(brand) => { onAddBrand(brand); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {brands.map(brand => (
          <Card key={brand.id} className={styles.brandRow}>
            <div className={styles.brandAvatar}>{brand.name[0]}</div>
            <div className={styles.brandInfo}>
              <div className={styles.brandName}>{brand.name}</div>
              <div className={styles.brandTagRow}>
                <Tag>{brand.industry}</Tag>
                <Tag>{brand.url}</Tag>
                <Tag variant="green">{brand.competitors?.length ?? 0} competitors</Tag>
              </div>
            </div>
            <Btn variant="danger" size="sm" onClick={() => onRemoveBrand(brand.id)}>Remove</Btn>
          </Card>
        ))}
      </div>
    </div>
  )
}

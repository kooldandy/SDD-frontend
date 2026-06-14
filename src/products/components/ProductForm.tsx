import React from 'react'

type FormValues = Readonly<{
  name: string
  description: string
  price: string
  quantity: string
}>

type ProductFormProps = Readonly<{
  title: string
  values: FormValues
  errors: Readonly<Record<string, string>>
  saving: boolean
  status?: string | null
  onChange: (field: keyof FormValues, value: string) => void
  onSave: () => void
  onCancel: () => void
}>

export default function ProductForm({
  title,
  values,
  errors,
  saving,
  status,
  onChange,
  onSave,
  onCancel
}: ProductFormProps) {
  return (
    <div className="product-edit-form">
      <div className="form-section-title">{title}</div>
      <div className="form-field">
        <label>
          Name
          <input
            type="text"
            value={values.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Enter product name"
          />
        </label>
        {errors.name ? <div className="field-error">{errors.name}</div> : null}
      </div>

      <div className="form-field">
        <label>
          Description
          <textarea
            rows={3}
            value={values.description}
            onChange={e => onChange('description', e.target.value)}
            placeholder="Enter product description"
          />
        </label>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={e => onChange('price', e.target.value)}
              placeholder="0.00"
            />
          </label>
          {errors.price ? <div className="field-error">{errors.price}</div> : null}
        </div>

        <div className="form-field">
          <label>
            Quantity
            <input
              type="number"
              min="0"
              step="1"
              value={values.quantity}
              onChange={e => onChange('quantity', e.target.value)}
              placeholder="0"
            />
          </label>
          {errors.quantity ? <div className="field-error">{errors.quantity}</div> : null}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSave} className="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="secondary" disabled={saving}>
          Cancel
        </button>
      </div>

      {status ? <div className="form-status">{status}</div> : null}
    </div>
  )
}

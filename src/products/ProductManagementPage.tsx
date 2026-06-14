import React, { useEffect, useState } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from './productService'
import { Product, ProductInput } from './productTypes'
import ProductEditForm from './components/ProductEditForm'
import ProductForm from './components/ProductForm'
import { validateProductInput } from './productValidation'

const emptyEdit = {
  name: '',
  description: '',
  price: '',
  quantity: ''
}

type EditValues = typeof emptyEdit

function parseEditValues(values: EditValues): { input: ProductInput; errors: Record<string, string> } {
  const price = values.price.trim() === '' ? Number.NaN : Number(values.price)
  const quantity = values.quantity.trim() === '' ? Number.NaN : Number(values.quantity)
  const input: ProductInput = {
    name: values.name.trim(),
    description: values.description.trim(),
    price,
    quantity
  }
  const errors = validateProductInput(input)
  return { input, errors }
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<EditValues>(emptyEdit)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    listProducts()
      .then(p => {
        if (mounted) {
          setProducts(p)
          setError(null)
        }
      })
      .catch(() => {
        if (mounted) setError('Failed to load products')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const [addMode, setAddMode] = useState(false)
  const [addValues, setAddValues] = useState<EditValues>(emptyEdit)
  const [addErrors, setAddErrors] = useState<Record<string, string>>({})

  const resetEdit = () => {
    setEditingId(null)
    setEditValues(emptyEdit)
    setEditErrors({})
    setSaving(false)
  }

  const resetAdd = () => {
    setAddMode(false)
    setAddValues(emptyEdit)
    setAddErrors({})
    setSaving(false)
  }

  const handleEdit = (product: Product) => {
    if (product.id === editingId) {
      resetEdit()
      return
    }

    resetAdd()
    setEditingId(product.id)
    setEditValues({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      quantity: String(product.quantity)
    })
    setEditErrors({})
    setStatusMessage(null)
  }

  const handleDelete = async (id: string) => {
    const confirmed = globalThis.confirm('Delete product?')
    if (!confirmed) return

    try {
      await deleteProduct(id)
      setProducts(current => current?.filter(item => item.id !== id) ?? null)
      setStatusMessage('Product deleted successfully.')
      if (editingId === id) {
        resetEdit()
      }
    } catch (error) {
      console.error(error)
      setStatusMessage('Failed to delete product.')
    }
  }

  const handleFieldChange = (field: keyof EditValues, value: string) => {
    setEditValues(current => ({ ...current, [field]: value }))
    setEditErrors(current => {
      const next = { ...current }
      delete next[field]
      return next
    })
    setStatusMessage(null)
  }

  const handleAddCancel = () => {
    resetAdd()
  }

  const handleSave = async () => {
    if (!editingId) return

    const { input, errors } = parseEditValues(editValues)
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors)
      return
    }

    setSaving(true)
    try {
      const updated = await updateProduct(editingId, input)
      setProducts(current =>
        current
          ? current.map(product => (product.id === editingId ? updated : product))
          : [updated]
      )
      setStatusMessage('Product updated successfully.')
      resetEdit()
    } catch (error) {
      console.error(error)
      setEditErrors({ form: 'Failed to save changes. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddClick = () => {
    setAddMode(true)
    setAddValues(emptyEdit)
    setAddErrors({})
    setStatusMessage(null)
    resetEdit()
  }

  const handleAddChange = (field: keyof EditValues, value: string) => {
    setAddValues(current => ({ ...current, [field]: value }))
    setAddErrors(current => {
      const next = { ...current }
      delete next[field]
      return next
    })
    setStatusMessage(null)
  }

  const handleAddSave = async () => {
    const { input, errors } = parseEditValues(addValues)
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors)
      return
    }

    setSaving(true)
    try {
      const created = await createProduct(input)
      setProducts(current => (current ? [...current, created] : [created]))
      setStatusMessage('Product added successfully.')
      resetAdd()
    } catch (error) {
      console.error(error)
      setAddErrors({ form: 'Failed to add product. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading products…</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ padding: 16 }}>
      {statusMessage ? <div className="status-message">{statusMessage}</div> : null}
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleAddClick} className="primary" disabled={Boolean(editingId)}>
          Add Product
        </button>
        {editingId ? <span className="helper-text">Finish or close the current edit before adding a new product.</span> : null}
      </div>
      {addMode ? (
        <div className="add-form-panel">
          <ProductForm
            title="Add New Product"
            values={addValues}
            errors={addErrors}
            saving={saving}
            status={addErrors.form ?? null}
            onChange={handleAddChange}
            onSave={handleAddSave}
            onCancel={handleAddCancel}
          />
        </div>
      ) : null}

      {!products || products.length === 0 ? (
        <div>No products found</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="pm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="desc-col">Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <React.Fragment key={product.id}>
                <tr>
                  <td>{product.name}</td>
                  <td className="desc-col">{product.description ?? '—'}</td>
                  <td>{`$${product.price.toFixed(2)}`}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="primary" disabled={addMode}>
                      {editingId === product.id ? 'Close' : 'Edit'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(product.id)} className="danger">
                      Delete
                    </button>
                  </td>
                </tr>
                {editingId === product.id ? (
                  <tr className="edit-row">
                    <td colSpan={6}>
                      <ProductEditForm
                        values={editValues}
                        errors={editErrors}
                        saving={saving}
                        status={editErrors.form ?? undefined}
                        onChange={handleFieldChange}
                        onSave={handleSave}
                        onCancel={resetEdit}
                      />
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <style>{`
        .pm-table { width: 100%; border-collapse: collapse; min-width: 700px; }
        .pm-table th, .pm-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e6e6e6; }
        .pm-table thead th { background: #f9fafb; font-weight: 600; }
        .desc-col { max-width: 40ch; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pm-table tr:hover td { background: #fbfbfb; }
        .primary { background: #2563eb; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .danger { background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .link { background: none; border: none; color: #2563eb; cursor: pointer; padding: 0; }
        .status-message { margin-bottom: 16px; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 14px; border-radius: 8px; }
        .helper-text { margin-left: 12px; color: #4b5563; font-size: 0.95rem; }
        .add-form-panel { margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; }
        .edit-row td { background: #f8fafc; padding: 0; border-bottom: none; }
        .product-edit-form { display: flex; flex-direction: column; gap: 16px; padding: 18px 0; }
        .form-section-title { font-size: 1rem; font-weight: 700; color: #111827; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-weight: 600; color: #111827; }
        .form-field input, .form-field textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font: inherit; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .form-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .secondary { background: #e5e7eb; color: #111827; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .field-error { color: #b91c1c; font-size: 0.95rem; }
        .form-status { color: #b91c1c; font-size: 0.95rem; }
        @media (max-width: 640px) {
          .pm-table { min-width: 0; }
          .pm-table th:nth-child(2), .pm-table td:nth-child(2) { display: none; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

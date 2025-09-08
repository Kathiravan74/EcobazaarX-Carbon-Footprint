import React, { useState } from 'react'
import { productsAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    carbon_value: '',
    image_url: '',
    stock: ''
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        carbon_value: parseFloat(form.carbon_value),
        image_url: form.image_url,
        stock: parseInt(form.stock, 10),
      }
      const { data } = await productsAPI.create(payload)
      toast.success(`Product created successfully (ID: ${data.productId})`)
      navigate('/seller')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Server error'
      toast.error(msg)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          {label:'Name', name:'name', type:'text'},
          {label:'Description', name:'description', type:'text'},
          {label:'Price', name:'price', type:'number', step:'0.01'},
          {label:'Carbon Value', name:'carbon_value', type:'number', step:'0.01'},
          {label:'Image URL', name:'image_url', type:'text'},
          {label:'Stock', name:'stock', type:'number'},
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              step={field.step}
              value={form[field.name]}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
        ))}
        <button type="submit" disabled={saving} className="btn-primary w-full py-2">
          {saving ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default CreateProduct

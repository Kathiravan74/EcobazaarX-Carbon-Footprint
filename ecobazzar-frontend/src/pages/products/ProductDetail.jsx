import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Leaf, ShoppingCart, Minus, Plus } from 'lucide-react'
import { productsAPI } from '../../services/api'
import { useCart } from '../../contexts/CartContext'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await productsAPI.getById(id)
      setProduct(data)
    } catch (e) {
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  }
  if (!product) {
    return <p className="text-center py-20">Product Not Found</p>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
      <img src={product.image_url||'/api/placeholder/600/400'} alt={product.name} className="w-full h-96 object-cover rounded-lg"/>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <div className="text-2xl font-semibold text-primary-600">${product.price}</div>
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary-600"/> {product.carbon_value}g CO₂
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="p-2 border rounded disabled:opacity-50" disabled={qty===1}><Minus/></button>
          <span>{qty}</span>
          <button onClick={()=>setQty(q=>Math.min(product.stock,q+1))} className="p-2 border rounded" disabled={qty>=product.stock}><Plus/></button>
        </div>
        <button onClick={()=>addToCart(product.product_id,qty)} className="btn-primary py-3 flex items-center gap-2">
          <ShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductDetail

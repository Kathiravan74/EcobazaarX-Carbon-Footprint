import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Leaf } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const handleAdd = () => addToCart(product.product_id,1)

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img src={product.image_url||'/api/placeholder/300/200'} alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"/>
        <div className="absolute top-2 right-2">
          <div className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Leaf className="h-3 w-3 mr-1"/> {product.carbon_value}g CO₂
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <div className="flex space-x-2">
          <Link to={`/products/${product.product_id}`} className="flex-1 btn-secondary text-center">
            View Details
          </Link>
          <button onClick={handleAdd} disabled={product.stock===0}
            className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <ShoppingCart className="h-4 w-4 mr-1"/> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

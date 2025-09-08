import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, Leaf, ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, getTotalCarbonValue, loading } = useCart()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  }
  if (!cartItems.length) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400"/>
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map(item=>(
          <div key={item.product_id} className="card flex items-start gap-4">
            <img src={item.image_url||'/api/placeholder/120/120'} alt={item.name} className="w-24 h-24 object-cover rounded"/>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary-600"/> {item.carbon_value}g CO₂
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={()=>removeFromCart(item.product_id)} className="p-1 text-red-600 hover:text-red-800"><Trash2/></button>
                <span>${item.price} x {item.quantity}</span>
                <span>= ${(item.price*item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2"><span>Items total</span><span>${getCartTotal().toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Shipping</span><span className="text-green-600">Free</span></div>
        <div className="border-t pt-4 flex justify-between font-semibold"><span>Total</span><span>${getCartTotal().toFixed(2)}</span></div>
        <div className="bg-primary-50 p-4 rounded mt-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary-600"/> {getTotalCarbonValue().toFixed(1)}g CO₂
        </div>
        <Link to="/checkout" className="btn-primary w-full py-3 text-center mt-6">Proceed to Checkout</Link>
      </div>
    </div>
  )
}

export default Cart

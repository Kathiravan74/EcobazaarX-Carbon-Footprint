import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { ordersAPI } from '../../services/api'
import { toast } from 'react-toastify'
// Frontend Checkout.jsx
const handlePlaceOrder = async () => {
  const confirmed = window.confirm(`Confirm payment of $${getCartTotal().toFixed(2)}?`);
  if (!confirmed) return;

  try {
    setPlacing(true);
    const { data } = await ordersAPI.placeOrder({ items: cartItems, totalPrice: getCartTotal(), paymentStatus: 'Paid' });
    toast.success(`Order #${data.orderId} placed and paid successfully!`);
    await fetchCartItems();
    navigate('/orders');
  } catch (err) {
    toast.error('Order placement failed.');
  } finally {
    setPlacing(false);
  }
};

const Checkout = () => {
  const { cartItems, getCartTotal, fetchCartItems } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (!cartItems.length) navigate('/cart')
  }, [cartItems, navigate])

  const handlePlaceOrder = async () => {
    const confirmed = window.confirm(`Confirm payment of $${getCartTotal().toFixed(2)}?`)
    if (!confirmed) return

    try {
      setPlacing(true)
      const { data } = await ordersAPI.placeOrder({ items: cartItems, totalPrice: getCartTotal() })
      toast.success(`Order #${data.orderId} placed successfully!`)
      await fetchCartItems() // Clear the cart
      navigate('/orders')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Order placement failed'
      toast.error(msg)
      console.error(err)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-gray-700 mb-6">Total: ${getCartTotal().toFixed(2)}</p>
      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className={`btn-primary px-8 py-3 ${placing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {placing ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  )
}

export default Checkout

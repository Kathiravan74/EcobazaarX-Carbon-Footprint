import React, { useState, useEffect } from 'react'
import { ordersAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import FeedbackForm from '../../components/FeedbackForm'


const SellerDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch seller-specific orders from the correct API endpoint
        const { data } = await ordersAPI.getSellerOrders()
        setOrders(data)
        const pending = data.filter(o => o.status === 'Pending').length
        if (pending) toast.info(`You have ${pending} new order(s)`)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleShip = async orderId => {
    try {
      await ordersAPI.updateStatus(orderId, 'Shipped')
      toast.success(`Order #${orderId} marked as shipped`)
      setOrders(orders.map(o => (o.order_id === orderId ? { ...o, status: 'Shipped' } : o)))
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link to="/seller/create" className="btn-primary px-4 py-2">
          Create Product
        </Link>
      </div>
      <h2 className="text-xl font-semibold">All Orders</h2>
      <ul className="space-y-4">
        {orders.length === 0 ? (
          <li>No orders found</li>
        ) : (
          orders.map(order => (
            <li key={order.order_id} className="card p-4 flex justify-between items-center">
              <div>
                <div>Order #{order.order_id}</div>
                <div>Status: {order.status}</div>
              </div>
              {order.status === 'Pending' && (
                <button onClick={() => handleShip(order.order_id)} className="btn-secondary">
                  Mark as Shipped
                </button>
              )}
            </li>
          ))
        )}
      </ul>
       <FeedbackForm />
    </div>
  )
}

export default SellerDashboard

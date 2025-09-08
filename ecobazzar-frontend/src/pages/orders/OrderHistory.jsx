import React, { useState, useEffect, useRef } from 'react'
import { ordersAPI } from '../../services/api'
import { toast } from 'react-toastify'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const notified = useRef(new Set())

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getHistory()
        setOrders(data)
      } catch {
        toast.error('Failed to load order history')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!loading) {
      orders.forEach(o => {
        if (o.status === 'Shipped' && !notified.current.has(o.order_id)) {
          toast.info(`Your order #${o.order_id} has been shipped!`)
          notified.current.add(o.order_id)
        }
      })
    }
  }, [orders, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">No orders found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Order History</h1>
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.order_id} className="card p-4">
            <div className="flex justify-between">
              <span>Order #{o.order_id}</span>
              <span>{new Date(o.created_at).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-medium">Total:</span>
              <span>${Number(o.total_price || 0).toFixed(2)}</span>
            </div>
            <div className="mt-1">
              <span className="font-medium">Status:</span> {o.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrderHistory

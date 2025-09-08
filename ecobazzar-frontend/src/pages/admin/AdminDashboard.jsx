import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes,uRes,oRes] = await Promise.all([
          adminAPI.getAllProducts(),
          adminAPI.getAllUsers(),
          adminAPI.getAllOrders()
        ])
        setProducts(pRes.data)
        setUsers(uRes.data)
        setOrders(oRes.data)
      } catch {
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p=>(
            <div key={p.product_id} className="card p-4">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-600">Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map(u=>(
            <li key={u.user_id} className="card p-4 flex justify-between">
              <span>{u.first_name} {u.last_name}</span>
              <span>Role ID: {u.role_id}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <ul className="space-y-2">
          {orders.map(o=>(
            <li key={o.order_id} className="card p-4 flex justify-between">
              <span>Order #{o.order_id}</span>
              <span>{new Date(o.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default AdminDashboard

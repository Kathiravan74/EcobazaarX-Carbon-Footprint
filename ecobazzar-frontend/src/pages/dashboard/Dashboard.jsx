import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Dashboard = () => {
  const { user, isAdmin, isSeller, isCustomer } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    if (isAdmin()) navigate('/admin', { replace: true })
    else if (isSeller()) navigate('/seller', { replace: true })
  }, [user, isAdmin, isSeller])

  if (!user || !isCustomer()) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold">Your Impact</h2>
          <p>Orders placed: 12</p>
          <p>Carbon saved: 2.4 kg CO₂</p>
          <p>Member since: Jan 2024</p>
        </div>
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Quick Actions</h2>
          <button onClick={()=>navigate('/products')} className="btn-primary w-full">Browse Products</button>
          <button onClick={()=>navigate('/orders')} className="btn-secondary w-full">View Orders</button>
          <button onClick={()=>navigate('/profile')} className="btn-secondary w-full">Edit Profile</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

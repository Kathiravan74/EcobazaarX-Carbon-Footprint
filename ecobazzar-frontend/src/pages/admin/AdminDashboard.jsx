import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Trash2,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [sellers, setSellers] = useState([])
  const [analytics, setAnalytics] = useState({
    topCustomer: null,
    topSeller: null,
    mostSoldProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, ordersRes, sellersRes, customerRes, sellerRes, productsAnalyticsRes] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getAllSellers(),
        adminAPI.getTopCustomer(),
        adminAPI.getTopSeller(),
        adminAPI.getMostSoldProducts()
      ])

      setProducts(productsRes.data)
      setOrders(ordersRes.data)
      setSellers(sellersRes.data)
      setAnalytics({
        topCustomer: customerRes.data,
        topSeller: sellerRes.data,
        mostSoldProducts: productsAnalyticsRes.data
      })
    } catch (error) {
      toast.error('Failed to load admin data')
      console.error('Admin data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
      try {
        await adminAPI.deleteSeller(sellerId)
        setSellers(sellers.filter(seller => seller.user_id !== sellerId))
        toast.success('Seller deleted successfully')
      } catch (error) {
        toast.error('Failed to delete seller')
        console.error('Delete seller error:', error)
      }
    }
  }

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.carbon_value} kg CO₂
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.seller_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingBag className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.first_name} {order.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSellers = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Sellers Management</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map(seller => (
                <tr key={seller.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {seller.first_name} {seller.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(seller.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteSeller(seller.user_id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="text-indigo-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">EcoBazzar Analytics</h2>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Customer Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <Award className="text-blue-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Top Customer</h3>
          </div>
          {analytics.topCustomer ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {analytics.topCustomer.first_name} {analytics.topCustomer.last_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Username:</span> {analytics.topCustomer.username}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {analytics.topCustomer.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Purchases:</span> {analytics.topCustomer.total_purchases}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Spent:</span> ${analytics.topCustomer.total_spent}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No customer data available</p>
          )}
        </div>

        {/* Top Seller Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-green-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Top Seller</h3>
          </div>
          {analytics.topSeller ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {analytics.topSeller.first_name} {analytics.topSeller.last_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Username:</span> {analytics.topSeller.username}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {analytics.topSeller.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Orders:</span> {analytics.topSeller.total_orders}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Sales:</span> ${analytics.topSeller.total_sales}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No seller data available</p>
          )}
        </div>
      </div>

      {/* Most Sold Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="text-yellow-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Most Sold Products</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.mostSoldProducts.length > 0 ? (
                analytics.mostSoldProducts.map((product, index) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.total_quantity_sold} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.total_revenue}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No product sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - EcoBazzar</h1>
          <p className="mt-2 text-gray-600">Manage your platform's products, orders, sellers, and view analytics</p>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveView('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package size={16} className="inline mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag size={16} className="inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveView('sellers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'sellers'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={16} className="inline mr-2" />
                Sellers
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 size={16} className="inline mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'products' && renderProducts()}
          {activeView === 'orders' && renderOrders()}
          {activeView === 'sellers' && renderSellers()}
          {activeView === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

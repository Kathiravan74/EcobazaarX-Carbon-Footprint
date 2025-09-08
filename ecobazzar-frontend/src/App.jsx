import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Product Pages
import Products from './pages/products/Products'
import ProductDetail from './pages/products/ProductDetail'

// Cart & Checkout
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'

// Order Pages
import OrderHistory from './pages/orders/OrderHistory'

// User Profile & Dashboard
import Profile from './pages/profile/Profile'
import Dashboard from './pages/dashboard/Dashboard'

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard'
import FeedbackList from './pages/admin/FeedbackList'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import CreateProduct from './pages/seller/CreateProduct'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
              <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Product Routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
  path="/admin/feedback"
  element={
    <ProtectedRoute requiredRole={3}>
      <FeedbackList />
    </ProtectedRoute>
  }
/>
                {/* Protected Seller Routes */}
                <Route
                  path="/seller/create"
                  element={
                    <ProtectedRoute requiredRole={2}>
                      <CreateProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute requiredRole={2}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole={3}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

              </Routes>
            </main>

            <Footer />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

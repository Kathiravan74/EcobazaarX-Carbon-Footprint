import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, Search, Leaf } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EcoBazaar</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600">Products</Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={e => {
                  if (e.key === 'Enter') navigate(`/products?search=${e.target.value}`)
                }}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Cart Icon */}
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
                  <ShoppingCart className="h-6 w-6" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <User className="h-6 w-6" />
                    <span className="hidden md:block">{user.username}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* Admin Dashboard */}
                      {user.roleId === 3 && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/feedback"
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            View Feedback
                          </Link>
                        </>
                      )}

                      {/* Seller Dashboard */}
                      {user.roleId === 2 && (
                        <Link
                          to="/seller"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Seller Dashboard
                        </Link>
                      )}

                      {/* Customer Dashboard */}
                      {user.roleId === 1 && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      )}

                      {/* Common Links */}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary-600">Home</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary-600">Products</Link>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      navigate(`/products?search=${e.target.value}`)
                      setMenuOpen(false)
                    }
                  }}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {!isAuthenticated() && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-primary-600">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react'

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold">EcoBazzar</span>
          </div>
          <p className="text-gray-300 mb-4 max-w-md">
            Your sustainable shopping destination. We're committed to providing eco-friendly products that help you live a more sustainable lifestyle.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary-400"><Facebook className="h-5 w-5"/></a>
            <a href="#" className="text-gray-400 hover:text-primary-400"><Twitter className="h-5 w-5"/></a>
            <a href="#" className="text-gray-400 hover:text-primary-400"><Instagram className="h-5 w-5"/></a>
            <a href="#" className="text-gray-400 hover:text-primary-400"><Mail className="h-5 w-5"/></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-primary-400">Home</Link></li>
            <li><Link to="/products" className="text-gray-300 hover:text-primary-400">Products</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-primary-400">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-primary-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="text-gray-300 hover:text-primary-400">Help Center</Link></li>
            <li><Link to="/shipping" className="text-gray-300 hover:text-primary-400">Shipping Info</Link></li>
            <li><Link to="/returns" className="text-gray-300 hover:text-primary-400">Returns</Link></li>
            <li><Link to="/faq" className="text-gray-300 hover:text-primary-400">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 EcoBazzar. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-primary-400 text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer

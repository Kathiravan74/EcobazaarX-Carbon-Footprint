import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [formData,setFormData]=useState({email:'',password:''})
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const { login } = useAuth()
  const navigate=useNavigate()

  const handleChange=e=>setFormData({...formData,[e.target.name]:e.target.value})
  const handleSubmit=async e=>{
    e.preventDefault(); setLoading(true)
    const result=await login(formData.email,formData.password)
    if(result.success) navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="text-sm text-center text-gray-600">
          Or <Link to="/register" className="text-primary-600 hover:text-primary-500">create a new account</Link>
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email" name="email" type="email" required
              className="input-field mt-1"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                id="password" name="password"
                type={showPassword?'text':'password'} required
                className="input-field pr-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword?<EyeOff className="h-5 w-5 text-gray-400"/>:
                              <Eye className="h-5 w-5 text-gray-400"/>}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600"/>
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-primary-600 hover:text-primary-500">Forgot your password?</a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading?'Signing in...':'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null)
  const [token,setToken] = useState(localStorage.getItem('token'))
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if(u&&t){ setUser(JSON.parse(u)); setToken(t) }
    setLoading(false)
  },[])

  const login = async(email,password)=>{
    try{
      setLoading(true)
      const { data } = await authAPI.login({ email,password })
      const { token:userToken,user:userData } = data
      setUser(userData); setToken(userToken)
      localStorage.setItem('token',userToken)
      localStorage.setItem('user',JSON.stringify(userData))
      toast.success('Login successful!')
      return { success:true }
    }catch(e){
      const msg = e.response?.data?.message||'Login failed'
      toast.error(msg)
      return { success:false }
    }finally{ setLoading(false) }
  }

  const register = async(userData)=>{
    try{
      setLoading(true)
      const { data } = await authAPI.register(userData)
      const { token:userToken,userId } = data
      const newUser = {
        userId,
        username:userData.username,
        email:userData.email,
        roleId:userData.role_id || 1,
      }
      setUser(newUser); setToken(userToken)
      localStorage.setItem('token',userToken)
      localStorage.setItem('user',JSON.stringify(newUser))
      toast.success('Registration successful!')
      return { success:true }
    }catch(e){
      const msg = e.response?.data?.message||'Registration failed'
      toast.error(msg)
      return { success:false }
    }finally{ setLoading(false) }
  }

  const logout = ()=>{
    setUser(null); setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully!')
  }

  const isAuthenticated = ()=>!!(user&&token)
  const hasRole = rid=>user?.roleId===rid
  const isAdmin = ()=>hasRole(3)
  const isSeller = ()=>hasRole(2)
  const isCustomer = ()=>hasRole(1)

  return <AuthContext.Provider value={{
    user,token,loading,login,register,logout,
    isAuthenticated,hasRole,isAdmin,isSeller,isCustomer
  }}>{children}</AuthContext.Provider>
}

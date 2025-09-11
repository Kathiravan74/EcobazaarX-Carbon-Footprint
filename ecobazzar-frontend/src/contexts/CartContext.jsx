import React, { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems,setCartItems] = useState([])
  const [loading,setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(()=>{
    if(isAuthenticated()) fetchCartItems()
    else setCartItems([])
  },[isAuthenticated])

  const fetchCartItems = async()=>{
    try{
      setLoading(true)
      const { data } = await cartAPI.getItems()
      setCartItems(data)
    }catch(e){
      toast.error('Failed to fetch cart items')
    }finally{
      setLoading(false)
    }
  }

  const addToCart = async(pid,qty=1)=>{
    try{
      setLoading(true)
      await cartAPI.addItem({ product_id:pid, quantity:qty })
      await fetchCartItems()
      toast.success('Item added to cart!')
    }catch(e){
      toast.error('Failed to add to cart')
    }finally{
      setLoading(false)
    }
  }

  const removeFromCart = async(pid)=>{
    try{
      setLoading(true)
      await cartAPI.removeItem(pid)
      await fetchCartItems()
      toast.success('Item removed!')
    }catch(e){
      toast.error('Failed to remove')
    }finally{
      setLoading(false)
    }
  }

  const incrementCartItem = async(pid) => {
    const item = cartItems.find(i => i.product_id === pid)
    if (!item) return
    try {
      setLoading(true)
      await cartAPI.updateItem({ product_id: pid, quantity: item.quantity + 1 })
      await fetchCartItems()
    } catch (e) {
      toast.error('Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  const decrementCartItem = async(pid) => {
    const item = cartItems.find(i => i.product_id === pid)
    if (!item || item.quantity <= 1) return
    try {
      setLoading(true)
      await cartAPI.updateItem({ product_id: pid, quantity: item.quantity - 1 })
      await fetchCartItems()
    } catch (e) {
      toast.error('Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = () => cartItems.reduce((sum,i) => sum + i.price * i.quantity, 0)
  const getTotalCarbonValue = () => cartItems.reduce((sum,i) => sum + i.carbon_value * i.quantity, 0)
  const getItemCount = () => cartItems.reduce((c,i) => c + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems, loading, addToCart, removeFromCart,
      fetchCartItems, getCartTotal, getTotalCarbonValue, getItemCount,
      incrementCartItem, decrementCartItem
    }}>
      {children}
    </CartContext.Provider>
  )
}

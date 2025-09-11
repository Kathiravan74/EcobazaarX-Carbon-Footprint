import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Recycle, ShoppingBag, TrendingUp } from 'lucide-react'
import { productsAPI } from '../services/api'
import ProductCard from '../components/products/ProductCard'

const Home = () => {
  const [featuredProducts,setFeaturedProducts]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{ fetchFeatured() },[])
  const fetchFeatured=async()=>{
    try{
      const{data}=await productsAPI.getAll()
      setFeaturedProducts(data.slice(0,6))
    }catch(e){ console.error(e) }
    finally{ setLoading(false) }
  }

  const features=[
    { icon:Leaf,title:'Eco-Friendly Products',description:'Sustainably sourced and environmentally friendly' },
    { icon:Recycle,title:'Carbon Tracking',description:'Track your carbon footprint with every purchase' },
    { icon:ShoppingBag,title:'Quality Guaranteed',description:'Premium quality products that last longer' },
    { icon:TrendingUp,title:'Impact Measurement',description:'See the positive environmental impact' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Shop Sustainably with <span className="text-primary-600">EcoBazaar</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover eco-friendly products that make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
              Shop Now <ArrowRight className="ml-2 h-5 w-5"/>
            </Link>
            <Link to="/about" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EcoBazaar?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Committed to making sustainable shopping accessible.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {features.map((f,i)=>(
            <div key={i} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <f.icon className="h-8 w-8 text-primary-600"/>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our handpicked selection of eco-friendly products.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {Array(6).fill().map((_,i)=>(
              <div key={i} className="card animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {featuredProducts.map(p=><ProductCard key={p.product_id} product={p}/>)} 
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/products" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
            View All Products <ArrowRight className="ml-2 h-5 w-5"/>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-center text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands making sustainable choices every day.
          </p>
          <Link to="/register" className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg inline-flex items-center text-lg hover:bg-gray-100">
            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

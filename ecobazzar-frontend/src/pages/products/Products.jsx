import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { productsAPI } from '../../services/api'
import ProductCard from '../../components/products/ProductCard'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [maxCarbon, setMaxCarbon] = useState(searchParams.get('maxCarbonValue') || '')
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const search = searchParams.get('search')
      const maxC = searchParams.get('maxCarbonValue')
      const res = search || maxC
        ? await productsAPI.search({ searchTerm: search, maxCarbonValue: maxC })
        : await productsAPI.getAll()
      setProducts(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = e => {
    e.preventDefault()
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (maxCarbon) params.maxCarbonValue = maxCarbon
    setSearchParams(params)
  }

  const clearAll = () => {
    setSearchTerm(''); setMaxCarbon(''); setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Eco-Friendly Products</h1>
      <form onSubmit={applyFilters} className="bg-white p-4 rounded mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <SlidersHorizontal /> Filters
          </button>
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" onClick={clearAll} className="btn-secondary">Clear</button>
        </div>
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Max Carbon (g CO₂)</label>
              <input
                type="number"
                value={maxCarbon}
                onChange={e => setMaxCarbon(e.target.value)}
                className="input-field"
                placeholder="e.g., 100"
              />
            </div>
          </div>
        )}
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill().map((_,i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-300 rounded mb-4" />
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">No products found.</p>
          <button onClick={clearAll} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default Products

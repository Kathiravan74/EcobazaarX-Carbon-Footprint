import React, { useState, useEffect } from 'react'
import { feedbackAPI } from '../../services/api'
import { toast } from 'react-toastify'

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await feedbackAPI.getAllFeedback()
        setFeedbacks(data)
      } catch {
        toast.error('Failed to load feedback')
      } finally {
        setLoading(false)
      }
    }
    fetchFeedbacks()
  }, [])

  if (loading) return <p>Loading feedback...</p>

  if (feedbacks.length === 0) return <p>No feedback available yet.</p>

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
      <ul className="space-y-4">
        {feedbacks.map(fb => (
          <li key={fb.feedback_id} className="border p-3 rounded shadow">
            <p>"{fb.message}"</p>
            <p className="text-sm text-gray-600">
              From: {fb.username || fb.email} - Role: {
                fb.role_id === 1
                  ? 'Customer'
                  : fb.role_id === 2
                  ? 'Seller'
                  : fb.role_id === 3
                  ? 'Admin'
                  : 'Unknown'
              }
              <br />
              At: {new Date(fb.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeedbackList

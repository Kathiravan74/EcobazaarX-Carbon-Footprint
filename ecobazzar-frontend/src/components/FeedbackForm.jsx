import React, { useState } from 'react'
import { feedbackAPI } from '../services/api'
import { toast } from 'react-toastify'

const FeedbackForm = () => {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (message.trim() === '') {
      toast.error('Please enter your feedback')
      return
    }
    setSubmitting(true)
    try {
      await feedbackAPI.submitFeedback(message)
      toast.success('Feedback submitted, thank you!')
      setMessage('')
    } catch (err) {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Write your feedback here..."
        disabled={submitting}
        className="w-full p-3 border rounded"
        rows={5}
      />
      <button type="submit" disabled={submitting} className="btn-primary px-4 py-2">
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}

export default FeedbackForm

import React, { useState, useEffect } from 'react'
import FeedbackForm from '../../components/FeedbackForm'
import { usersAPI } from '../../services/api'
import { toast } from 'react-toastify'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({})
  const [password, setPassword] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await usersAPI.getProfile()
        setProfile(data.user)
        setForm({ first_name: data.user.first_name, last_name: data.user.last_name, email: data.user.email })
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const updateProfile = async () => {
    try {
      await usersAPI.updateProfile(form)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed')
    }
  }

  const updatePassword = async () => {
    try {
      await usersAPI.updatePassword({ newPassword: password })
      toast.success('Password updated!')
      setPassword('')
    } catch {
      toast.error('Password update failed')
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="card space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} className="input-field mt-1"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} className="input-field mt-1"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="input-field mt-1"/>
        </div>
        <button onClick={updateProfile} className="btn-primary">Save Changes</button>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-field mt-1"/>
        </div>
        <button onClick={updatePassword} className="btn-primary">Update Password</button>
      </div>
      <FeedbackForm />
    </div>
  )
}

export default Profile

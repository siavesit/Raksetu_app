import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Donor')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(name || 'Student', role)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-red-600">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Donor">Donor</option>
            <option value="Requester">Hospital / Requester</option>
          </select>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
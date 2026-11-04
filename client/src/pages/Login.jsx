import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Donor')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      if (isRegister) {
        const result = await register(name, email, password, role)
        setMessage(result.message)
      } else {
        await login(email, password)
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-600">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>

        <p className="text-gray-500 text-center mt-2">
          {isRegister
            ? 'Join the RaktSetu community'
            : 'Login to your RaktSetu account'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={fieldClass}
              >
                <option value="Donor">Donor</option>
                <option value="Requester">Individual Requester</option>
                <option value="Hospital">Hospital</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            minLength={8}
            required
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
          >
            {submitting
              ? 'Please wait...'
              : isRegister
                ? 'Register'
                : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
              setMessage('')
            }}
            className="text-red-600 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}
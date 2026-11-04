import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addRequest } from '../redux/requestsSlice'
import useAuth from '../hooks/useAuth'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical']

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export default function NewRequestForm() {
  const dispatch = useDispatch()
  const { token } = useAuth()

  const [hospitalName, setHospitalName] = useState('')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [unitsNeeded, setUnitsNeeded] = useState(1)
  const [urgency, setUrgency] = useState('Medium')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospitalName: hospitalName.trim(),
          bloodGroup,
          unitsNeeded: Number(unitsNeeded),
          urgency,
          location: location.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Could not create request')
      }

      dispatch(addRequest(result.data))

      setHospitalName('')
      setBloodGroup('O+')
      setUnitsNeeded(1)
      setUrgency('Medium')
      setLocation('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <input
        type="text"
        placeholder="Hospital / Patient name"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
        className={fieldClass}
        maxLength={100}
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={fieldClass}
        required
      />

      <select
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
        className={fieldClass}
      >
        {BLOOD_GROUPS.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        max="20"
        value={unitsNeeded}
        onChange={(e) => setUnitsNeeded(e.target.value)}
        className={fieldClass}
        required
      />

      <select
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
        className={fieldClass}
      >
        {URGENCY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      {error && (
        <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="sm:col-span-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
      >
        {submitting ? 'Submitting...' : 'Submit Blood Request'}
      </button>
    </form>
  )
}
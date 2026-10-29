import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addRequest } from '../redux/requestsSlice'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical']

export default function NewRequestForm() {
  const dispatch = useDispatch()
  const [hospital, setHospital] = useState('')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [units, setUnits] = useState(1)
  const [urgency, setUrgency] = useState('Medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!hospital.trim()) return

    dispatch(
      addRequest({
        id: Date.now(),
        hospital: hospital.trim(),
        bloodGroup,
        units: Number(units),
        urgency,
        responded: false,
      })
    )
    setHospital('')
    setUnits(1)
  }

  const fieldClass = 'border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 sm:grid-cols-5 gap-3"
    >
      <input
        type="text"
        placeholder="Hospital name"
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        className={`sm:col-span-2 ${fieldClass}`}
      />
      <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={fieldClass}>
        {BLOOD_GROUPS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        max="20"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        className={fieldClass}
      />
      <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className={fieldClass}>
        {URGENCY_LEVELS.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
      <button
        type="submit"
        className="sm:col-span-5 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
      >
        Add Request
      </button>
    </form>
  )
}
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export default function ApiStatus() {
  const [status, setStatus] = useState('Checking backend...')
  const [ok, setOk] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/requests`)
      .then((res) => {
        if (!res.ok) throw new Error('Bad response')
        return res.json()
      })
      .then((json) => {
        setStatus(`Backend connected ✓ — ${json.count} request(s) in the database`)
        setOk(true)
      })
      .catch(() => {
        setStatus('Backend not reachable ✗')
        setOk(false)
      })
  }, [])

  return (
    <p
      className={`text-center text-sm font-semibold py-3 ${
        ok === false ? 'text-red-600' : ok ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      {status}
    </p>
  )
}
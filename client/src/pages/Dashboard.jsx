import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'
import NewRequestForm from '../components/NewRequestForm'
import { respondToRequest, removeRequest } from '../redux/requestsSlice'

export default function Dashboard() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { items: requests, loading } = useSelector((state) => state.requests)

  useEffect(() => {
    document.title = 'Dashboard - RaktSetu'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {user ? user.name : 'Guest'}
      </h1>
      <p className="text-gray-600 mb-6">
        Role: {user ? user.role : 'Not logged in'}
      </p>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Post a New Request</h2>
      <NewRequestForm />

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Active Urgent Requests</h2>
      {loading ? (
        <p className="text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No active requests.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {requests.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-6">
              <p className="text-xl font-bold text-red-600">{r.bloodGroup}</p>
              <p className="mt-1 text-gray-700">{r.hospital}</p>
              <p className="text-sm text-gray-500 mb-3">{r.units} units needed — {r.urgency}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(respondToRequest(r.id))}
                  disabled={r.responded}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white ${
                    r.responded ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {r.responded ? 'Response Sent ✓' : 'I can help'}
                </button>
                <button
                  onClick={() => dispatch(removeRequest(r.id))}
                  className="px-3 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'
import NewRequestForm from '../components/NewRequestForm'
import { respondToRequest } from '../redux/requestsSlice'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const dispatch = useDispatch()

  const { items: requests, loading } = useSelector(
    (state) => state.requests
  )

  useEffect(() => {
    document.title = 'Dashboard - RaktSetu'
  }, [])

  if (authLoading) {
    return <p className="text-center mt-10">Loading account...</p>
  }

  if (!user) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-xl font-bold">Please log in first.</h2>
      </div>
    )
  }

  const isDonor = user.role === 'Donor'
  const isRequester = user.role === 'Requester'
  const isHospital = user.role === 'Hospital'
  const canCreateRequest =
    isRequester || (isHospital && user.isVerified)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-red-600">
          Welcome, {user.name}!
        </h1>

        <p className="mt-2 text-gray-600">
          Account type: <strong>{user.role}</strong>
        </p>

        {isHospital && !user.isVerified && (
          <p className="mt-3 text-orange-600 font-medium">
            Your hospital account is awaiting admin verification.
            You can view blood requests, but cannot create requests yet.
          </p>
        )}
      </div>

      {canCreateRequest && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Create a Blood Request
          </h2>
          <NewRequestForm />
        </section>
      )}

      {isDonor && (
        <p className="bg-green-50 text-green-700 rounded-lg p-4 mb-8">
          You are registered as a Donor. Browse active requests and
          offer to help patients in need.
        </p>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-5">
          Active Blood Requests
        </h2>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No active requests available.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div
                key={request._id || request.id}
                className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg">
                    {request.hospitalName || request.hospital}
                  </h3>

                  <p className="text-gray-600">
                    Blood Group: {request.bloodGroup}
                  </p>

                  <p className="text-gray-600">
                    Units Needed:{' '}
                    {request.unitsNeeded || request.units}
                  </p>

                  <p className="text-gray-600">
                    Urgency: {request.urgency}
                  </p>
                </div>

                {isDonor && (
                  <button
                    onClick={() =>
                      dispatch(
                        respondToRequest(request._id || request.id)
                      )
                    }
                    disabled={request.responded}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    {request.responded ? 'Response Sent' : 'I Can Help'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
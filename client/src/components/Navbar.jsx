import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const requestCount = useSelector((state) => state.requests.items.length)

  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">RaktSetu 🩸</Link>
      <div className="space-x-4 text-sm sm:text-base flex items-center">
        <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
          {requestCount} active requests
        </span>
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/chat" className="hover:underline">Chat</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="text-red-100">Hi, {user.name}</span>
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  )
}
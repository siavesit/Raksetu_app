import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LiveAlert from './components/LiveAlert'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import { loadRequests } from './redux/requestsSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadRequests())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Navbar />
      <LiveAlert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
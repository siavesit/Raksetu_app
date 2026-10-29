import { useEffect, useState } from 'react'
import { socket } from '../socket'

export default function LiveAlert() {
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    let timer
    const handleNewRequest = (data) => {
      setAlert(data)
      clearTimeout(timer)
      timer = setTimeout(() => setAlert(null), 6000)
    }

    socket.on('newRequest', handleNewRequest)
    return () => {
      socket.off('newRequest', handleNewRequest)
      clearTimeout(timer)
    }
  }, [])

  if (!alert) return null

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border-l-4 border-red-600 shadow-lg rounded-lg px-5 py-4 max-w-xs">
      <p className="font-bold text-red-600">🩸 New urgent request</p>
      <p className="text-gray-700 text-sm mt-1">
        {alert.bloodGroup} needed at {alert.hospitalName} ({alert.unitsNeeded} units)
      </p>
    </div>
  )
}
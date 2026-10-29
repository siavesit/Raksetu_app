import { useEffect, useRef, useState } from 'react'
import { socket } from '../socket'
import useAuth from '../hooks/useAuth'

export default function Chat() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user ? user.name : '')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(socket.connected)
  const bottomRef = useRef(null)

  useEffect(() => {
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onChatMessage = (data) => setMessages((previous) => [...previous, data])

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chatMessage', onChatMessage)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('chatMessage', onChatMessage)
    }
  }, [])

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault()
    if (!username.trim() || !message.trim()) return

    // Send the message through Socket.IO; the server broadcasts it to everyone
    socket.emit('chatMessage', {
      username: username.trim(),
      message: message.trim(),
    })
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 text-center">Real-Time Donor Chat</h1>
        <p
          className={`text-center text-sm font-semibold mt-1 ${
            connected ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {connected ? 'Connected' : 'Connecting...'}
        </p>

        <input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <div className="h-64 overflow-y-auto border rounded-lg p-3 mt-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center">No messages yet</p>
          )}
          {messages.map((item, index) => (
            <p key={index} className="text-sm text-gray-800 mb-1">
              <strong className="text-red-600">{item.username}:</strong> {item.message}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 mt-4">
          <input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
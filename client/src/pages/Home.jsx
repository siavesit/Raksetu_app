import { Link } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-red-600">Find a donor. Save a life.</h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          RaktSetu connects hospitals with nearby, eligible blood donors in real time.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
        >
          Get Started
        </Link>
        <div className="mt-6">
          <ApiStatus />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-16 max-w-5xl mx-auto">
        {[
          { title: 'Register', desc: 'Sign up as a donor with your blood group and location.' },
          { title: 'Get Matched', desc: 'Hospitals post urgent requests; nearby donors are alerted instantly.' },
          { title: 'Respond', desc: 'Confirm availability with one tap — no phone chains needed.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
            <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
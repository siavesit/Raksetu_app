// import { useState, useEffect } from 'react'

// const MOCK_REQUESTS = [
//   { id: 1, bloodGroup: 'O+', hospital: 'City Care Hospital', units: 2, urgency: 'High' },
//   { id: 2, bloodGroup: 'B-', hospital: 'Sunrise Medical Center', units: 1, urgency: 'Critical' },
//   { id: 3, bloodGroup: 'A+', hospital: 'Lifeline Clinic', units: 3, urgency: 'Medium' },
// ]

// export default function useRequests() {
//   const [requests, setRequests] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Standing in for a real API call — becomes an actual fetch() in Experiment 4
//     const timer = setTimeout(() => {
//       setRequests(MOCK_REQUESTS)
//       setLoading(false)
//     }, 800)

//     return () => clearTimeout(timer)
//   }, [])

//   return { requests, loading }
// }
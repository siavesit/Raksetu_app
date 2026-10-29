import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  loaded: false,
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true
    },
    fetchSuccess(state, action) {
      state.items = action.payload
      state.loading = false
      state.loaded = true
    },
    addRequest(state, action) {
      state.items.unshift(action.payload)
    },
    removeRequest(state, action) {
      state.items = state.items.filter((r) => r.id !== action.payload)
    },
    respondToRequest(state, action) {
      const request = state.items.find((r) => r.id === action.payload)
      if (request) request.responded = true
    },
  },
})

export const { fetchStart, fetchSuccess, addRequest, removeRequest, respondToRequest } =
  requestsSlice.actions

const MOCK_REQUESTS = [
  { id: 1, bloodGroup: 'O+', hospital: 'City Care Hospital', units: 2, urgency: 'High', responded: false },
  { id: 2, bloodGroup: 'B-', hospital: 'Sunrise Medical Center', units: 1, urgency: 'Critical', responded: false },
  { id: 3, bloodGroup: 'A+', hospital: 'Lifeline Clinic', units: 3, urgency: 'Medium', responded: false },
]

// Loads the starting data once, no matter how many times it is called
export function loadRequests() {
  return (dispatch, getState) => {
    const { loaded, loading } = getState().requests
    if (loaded || loading) return
    dispatch(fetchStart())
    setTimeout(() => {
      dispatch(fetchSuccess(MOCK_REQUESTS))
    }, 800)
  }
}

export default requestsSlice.reducer
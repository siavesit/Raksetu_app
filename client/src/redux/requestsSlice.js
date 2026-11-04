import { createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true
      state.error = null
    },
    fetchSuccess(state, action) {
      state.items = action.payload
      state.loading = false
      state.loaded = true
    },
    fetchFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    addRequest(state, action) {
      state.items.unshift(action.payload)
    },
    respondToRequest(state, action) {
      const request = state.items.find(
        (r) => (r._id || r.id) === action.payload
      )
      if (request) request.responded = true
    },
  },
})

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addRequest,
  respondToRequest,
} = requestsSlice.actions

export function loadRequests() {
  return async (dispatch, getState) => {
    if (getState().requests.loading || getState().requests.loaded) return

    dispatch(fetchStart())

    try {
      const response = await fetch(`${API_URL}/api/requests`)
      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'Failed to load requests')

      dispatch(fetchSuccess(result.data))
    } catch (error) {
      dispatch(fetchFailure(error.message))
    }
  }
}

export default requestsSlice.reducer
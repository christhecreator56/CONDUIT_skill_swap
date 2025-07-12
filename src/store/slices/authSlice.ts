import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../api/auth'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  location?: string
  profilePhoto?: string
  isPublic: boolean
  availability: {
    weekends: boolean
    evenings: boolean
    weekdays: boolean
    custom?: string
  }
  rating: number
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials)
    return response
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await authAPI.register(userData)
    return response
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, profileData }: { userId: string; profileData: Partial<User> }) => {
    const response = await authAPI.updateProfile(userId, profileData)
    return response
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = { ...action.payload.user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        state.token = action.payload.token || null
        state.isAuthenticated = true
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = { ...action.payload.user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        state.token = action.payload.token || null
        state.isAuthenticated = true
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = { ...action.payload.user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Profile update failed'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer 
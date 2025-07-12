import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  location?: string
  profilePhoto?: string
  isPublic: boolean
  rating: number
  totalSwaps: number
  createdAt: string
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
    // TODO: Replace with actual API call
    const response = await new Promise<{ user: User; token: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: credentials.email,
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Passionate about learning and sharing skills',
            location: 'New York, NY',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            isPublic: true,
            rating: 4.8,
            totalSwaps: 12,
            createdAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        })
      }, 1000)
    })
    return response
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    // TODO: Replace with actual API call
    const response = await new Promise<{ user: User; token: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            bio: '',
            location: '',
            profilePhoto: '',
            isPublic: true,
            rating: 0,
            totalSwaps: 0,
            createdAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        })
      }, 1000)
    })
    return response
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>) => {
    // TODO: Replace with actual API call
    const response = await new Promise<User>((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          bio: profileData.bio || 'Passionate about learning and sharing skills',
          location: profileData.location || 'New York, NY',
          profilePhoto: profileData.profilePhoto || '',
          isPublic: profileData.isPublic ?? true,
          rating: 4.8,
          totalSwaps: 12,
          createdAt: new Date().toISOString(),
        })
      }, 1000)
    })
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
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
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
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
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
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Profile update failed'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer 
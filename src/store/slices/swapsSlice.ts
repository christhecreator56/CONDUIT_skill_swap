import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface SwapRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterPhoto?: string
  skillOffered: {
    id: string
    name: string
    description: string
    category: string
  }
  skillRequested: {
    id: string
    name: string
    description: string
    category: string
  }
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  message?: string
  createdAt: string
  updatedAt: string
}

export interface SwapFeedback {
  id: string
  swapId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment: string
  createdAt: string
}

export interface SwapsState {
  sentRequests: SwapRequest[]
  receivedRequests: SwapRequest[]
  completedSwaps: SwapRequest[]
  feedback: SwapFeedback[]
  isLoading: boolean
  error: string | null
}

const initialState: SwapsState = {
  sentRequests: [],
  receivedRequests: [],
  completedSwaps: [],
  feedback: [],
  isLoading: false,
  error: null,
}

export const sendSwapRequest = createAsyncThunk(
  'swaps/sendRequest',
  async (requestData: {
    skillOfferedId: string
    skillRequestedId: string
    message?: string
  }) => {
    // TODO: Replace with actual API call
    const response = await new Promise<SwapRequest>((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          requesterId: '1',
          requesterName: 'John Doe',
          requesterPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          skillOffered: {
            id: requestData.skillOfferedId,
            name: 'React Development',
            description: 'Building modern web applications',
            category: 'Technology',
          },
          skillRequested: {
            id: requestData.skillRequestedId,
            name: 'Guitar Lessons',
            description: 'Learn acoustic and electric guitar',
            category: 'Music',
          },
          status: 'pending',
          message: requestData.message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }, 1000)
    })
    return response
  }
)

export const respondToSwapRequest = createAsyncThunk(
  'swaps/respondToRequest',
  async ({ requestId, status }: { requestId: string; status: 'accepted' | 'rejected' }) => {
    // TODO: Replace with actual API call
    const response = await new Promise<SwapRequest>((resolve) => {
      setTimeout(() => {
        resolve({
          id: requestId,
          requesterId: '1',
          requesterName: 'John Doe',
          requesterPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          skillOffered: {
            id: '1',
            name: 'React Development',
            description: 'Building modern web applications',
            category: 'Technology',
          },
          skillRequested: {
            id: '2',
            name: 'Guitar Lessons',
            description: 'Learn acoustic and electric guitar',
            category: 'Music',
          },
          status,
          message: 'Let\'s exchange skills!',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }, 1000)
    })
    return response
  }
)

export const submitFeedback = createAsyncThunk(
  'swaps/submitFeedback',
  async (feedbackData: {
    swapId: string
    toUserId: string
    rating: number
    comment: string
  }) => {
    // TODO: Replace with actual API call
    const response = await new Promise<SwapFeedback>((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          swapId: feedbackData.swapId,
          fromUserId: '1',
          toUserId: feedbackData.toUserId,
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          createdAt: new Date().toISOString(),
        })
      }, 1000)
    })
    return response
  }
)

export const deleteSwapRequest = createAsyncThunk(
  'swaps/deleteRequest',
  async (requestId: string) => {
    // TODO: Replace with actual API call
    const response = await new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Swap request deleted successfully'
        })
      }, 1000)
    })
    return { requestId, ...response }
  }
)

const swapsSlice = createSlice({
  name: 'swaps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Swap Request
      .addCase(sendSwapRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.sentRequests.push(action.payload)
      })
      .addCase(sendSwapRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to send swap request'
      })
      // Respond to Swap Request
      .addCase(respondToSwapRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(respondToSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedRequest = action.payload
        state.receivedRequests = state.receivedRequests.map(request =>
          request.id === updatedRequest.id ? updatedRequest : request
        )
        if (updatedRequest.status === 'accepted') {
          state.completedSwaps.push(updatedRequest)
        }
      })
      .addCase(respondToSwapRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to respond to swap request'
      })
      // Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.isLoading = false
        state.feedback.push(action.payload)
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to submit feedback'
      })
      // Delete Swap Request
      .addCase(deleteSwapRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.sentRequests = state.sentRequests.filter(request => request.id !== action.payload.requestId)
      })
      .addCase(deleteSwapRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to delete swap request'
      })
  },
})

export const { clearError } = swapsSlice.actions
export default swapsSlice.reducer 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { swapsAPI } from '../../api/swaps'
import type { SwapRequestWithDetails } from '../../api/swaps'

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

// Helper function to convert SwapRequestWithDetails to SwapRequest
const convertToSwapRequest = (apiRequest: any): SwapRequest => ({
  id: apiRequest.id,
  requesterId: apiRequest.requesterId,
  requesterName: `${apiRequest.requester.firstName} ${apiRequest.requester.lastName}`,
  requesterPhoto: apiRequest.requester.profilePhoto || undefined,
  skillOffered: {
    id: apiRequest.skillOffered.id,
    name: apiRequest.skillOffered.name,
    description: apiRequest.skillOffered.description || '',
    category: apiRequest.skillOffered.category,
  },
  skillRequested: {
    id: apiRequest.skillRequested.id,
    name: apiRequest.skillRequested.name,
    description: apiRequest.skillRequested.description || '',
    category: apiRequest.skillRequested.category,
  },
  status: apiRequest.status,
  message: apiRequest.message || undefined,
  createdAt: apiRequest.createdAt.toISOString(),
  updatedAt: apiRequest.updatedAt.toISOString(),
})

export const sendSwapRequest = createAsyncThunk(
  'swaps/sendRequest',
  async (requestData: {
    skillOfferedId: string
    skillRequestedId: string
    message?: string
  }) => {
    // Get current user ID from localStorage or auth state
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!currentUser.id) {
      throw new Error('User not authenticated')
    }

    // Get the skill details to find the recipient
    const skillRequested = await swapsAPI.getSwapRequestById(requestData.skillRequestedId)
    
    const response = await swapsAPI.createSwapRequest({
      requesterId: currentUser.id,
      recipientId: skillRequested.recipientId,
      skillOfferedId: requestData.skillOfferedId,
      skillRequestedId: requestData.skillRequestedId,
      message: requestData.message,
    })
    
    return convertToSwapRequest(response)
  }
)

export const respondToSwapRequest = createAsyncThunk(
  'swaps/respondToRequest',
  async ({ requestId, status }: { requestId: string; status: 'accepted' | 'rejected' }) => {
    const response = await swapsAPI.updateSwapRequestStatus(requestId, status)
    return convertToSwapRequest(response)
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
    const response = await swapsAPI.createFeedback({
      swapId: feedbackData.swapId,
      fromUserId: JSON.parse(localStorage.getItem('user') || '{}').id,
      toUserId: feedbackData.toUserId,
      rating: feedbackData.rating as 1 | 2 | 3 | 4 | 5,
      comment: feedbackData.comment,
    })
    
    return {
      id: response.id,
      swapId: response.swapId,
      fromUserId: response.fromUserId,
      toUserId: response.toUserId,
      rating: response.rating,
      comment: response.comment,
      createdAt: response.createdAt.toISOString(),
    }
  }
)

export const deleteSwapRequest = createAsyncThunk(
  'swaps/deleteRequest',
  async (requestId: string) => {
    await swapsAPI.deleteSwapRequest(requestId)
    return { requestId, success: true, message: 'Swap request deleted successfully' }
  }
)

export const loadSwapRequests = createAsyncThunk(
  'swaps/loadRequests',
  async (userId: string) => {
    const [sentRequests, receivedRequests, completedSwaps] = await Promise.all([
      swapsAPI.getSwapRequestsByUserId(userId, 'sent'),
      swapsAPI.getSwapRequestsByUserId(userId, 'received'),
      swapsAPI.getCompletedSwaps(userId),
    ])
    
    return {
      sentRequests: sentRequests.map(convertToSwapRequest),
      receivedRequests: receivedRequests.map(convertToSwapRequest),
      completedSwaps: completedSwaps.map(convertToSwapRequest),
    }
  }
)

export const loadFeedback = createAsyncThunk(
  'swaps/loadFeedback',
  async (userId: string) => {
    const [givenFeedback, receivedFeedback] = await Promise.all([
      swapsAPI.getFeedbackByUserId(userId, 'given'),
      swapsAPI.getFeedbackByUserId(userId, 'received'),
    ])
    
    return {
      feedback: [
        ...givenFeedback.map(f => ({
          id: f.id,
          swapId: f.swapId,
          fromUserId: f.fromUserId,
          toUserId: f.toUserId,
          rating: f.rating,
          comment: f.comment,
          createdAt: f.createdAt.toISOString(),
        })),
        ...receivedFeedback.map(f => ({
          id: f.id,
          swapId: f.swapId,
          fromUserId: f.fromUserId,
          toUserId: f.toUserId,
          rating: f.rating,
          comment: f.comment,
          createdAt: f.createdAt.toISOString(),
        }))
      ]
    }
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
      // Load Swap Requests
      .addCase(loadSwapRequests.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadSwapRequests.fulfilled, (state, action) => {
        state.isLoading = false
        state.sentRequests = action.payload.sentRequests
        state.receivedRequests = action.payload.receivedRequests
        state.completedSwaps = action.payload.completedSwaps
      })
      .addCase(loadSwapRequests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load swap requests'
      })
      // Load Feedback
      .addCase(loadFeedback.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadFeedback.fulfilled, (state, action) => {
        state.isLoading = false
        state.feedback = action.payload.feedback
      })
      .addCase(loadFeedback.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load feedback'
      })
  },
})

export const { clearError } = swapsSlice.actions
export default swapsSlice.reducer 
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { respondToSwapRequest, submitFeedback, deleteSwapRequest } from '../../store/slices/swapsSlice'
import { SwapRequest } from '../../store/slices/swapsSlice'
import ClickSpark from '../../components/ClickSpark'

const SwapRequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.swaps)
  
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'completed'>('received')
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null)
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: ''
  })

  // Mock data for demonstration
  const mockReceivedRequests: SwapRequest[] = [
    {
      id: '1',
      requesterId: '2',
      requesterName: 'Sarah Johnson',
      requesterPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      skillOffered: {
        id: '1',
        name: 'Guitar Lessons',
        description: 'Learn acoustic and electric guitar',
        category: 'Music'
      },
      skillRequested: {
        id: '2',
        name: 'React Development',
        description: 'Building modern web applications',
        category: 'Technology'
      },
      status: 'pending',
      message: 'I\'d love to learn React development! I can teach you guitar in exchange.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  const mockSentRequests: SwapRequest[] = [
    {
      id: '2',
      requesterId: '1',
      requesterName: 'John Doe',
      requesterPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      skillOffered: {
        id: '3',
        name: 'Spanish',
        description: 'Conversational Spanish speaking and writing',
        category: 'Language'
      },
      skillRequested: {
        id: '4',
        name: 'Italian Cooking',
        description: 'Authentic Italian recipes and techniques',
        category: 'Cooking'
      },
      status: 'pending',
      message: 'I can help you with Spanish in exchange for cooking lessons!',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]

  const mockCompletedSwaps: SwapRequest[] = [
    {
      id: '3',
      requesterId: '3',
      requesterName: 'Marco Rossi',
      requesterPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      skillOffered: {
        id: '5',
        name: 'Italian Cooking',
        description: 'Authentic Italian recipes and techniques',
        category: 'Cooking'
      },
      skillRequested: {
        id: '6',
        name: 'Photography',
        description: 'Digital photography and editing',
        category: 'Art'
      },
      status: 'completed',
      message: 'Great exchange! Marco taught me amazing Italian recipes.',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date(Date.now() - 518400000).toISOString()
    }
  ]

  const handleRespondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await dispatch(respondToSwapRequest({ requestId, status }))
      setSelectedRequest(null)
    } catch (error) {
      console.error('Failed to respond to request:', error)
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await dispatch(deleteSwapRequest(requestId))
    } catch (error) {
      console.error('Failed to delete request:', error)
    }
  }

  const handleSubmitFeedback = async (swapId: string, toUserId: string) => {
    try {
      await dispatch(submitFeedback({
        swapId,
        toUserId,
        rating: feedbackData.rating,
        comment: feedbackData.comment
      }))
      setFeedbackData({ rating: 5, comment: '' })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-300 bg-yellow-900/30'
      case 'accepted': return 'text-green-300 bg-green-900/30'
      case 'rejected': return 'text-red-300 bg-red-900/30'
      case 'completed': return 'text-blue-300 bg-blue-900/30'
      default: return 'text-gray-300 bg-gray-800/60'
    }
  }

  const renderRequestCard = (request: SwapRequest, isReceived: boolean = false) => (
    <div key={request.id} className="card">
      <div className="flex items-start space-x-4">
        <img
          src={request.requesterPhoto || 'https://via.placeholder.com/50x50?text=No+Photo'}
          alt={request.requesterName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-white">{request.requesterName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <h4 className="text-sm font-medium text-gray-300">You'll Learn</h4>
              <p className="text-sm text-white">{request.skillRequested.name}</p>
              <p className="text-xs text-gray-400">{request.skillRequested.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300">You'll Teach</h4>
              <p className="text-sm text-white">{request.skillOffered.name}</p>
              <p className="text-xs text-gray-400">{request.skillOffered.description}</p>
            </div>
          </div>

          {request.message && (
            <div className="mb-3 p-3 bg-[#232428] rounded-lg">
              <p className="text-sm text-gray-200">{request.message}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDate(request.createdAt)}
            </span>
            
            <div className="flex space-x-2">
              {request.status === 'pending' && isReceived && (
                <>
                  <ClickSpark
                    sparkColor="#059669"
                    sparkSize={6}
                    sparkRadius={15}
                    sparkCount={4}
                    duration={300}
                  >
                    <button
                      onClick={() => handleRespondToRequest(request.id, 'accepted')}
                      className="btn-success text-sm py-1 px-3 bg-green-700 hover:bg-green-800 text-white"
                    >
                      Accept
                    </button>
                  </ClickSpark>
                  <ClickSpark
                    sparkColor="#ED4245"
                    sparkSize={6}
                    sparkRadius={15}
                    sparkCount={4}
                    duration={300}
                  >
                    <button
                      onClick={() => handleRespondToRequest(request.id, 'rejected')}
                      className="btn-danger text-sm py-1 px-3 bg-red-700 hover:bg-red-800 text-white"
                    >
                      Reject
                    </button>
                  </ClickSpark>
                </>
              )}
              
              {request.status === 'pending' && !isReceived && (
                <button
                  onClick={() => handleDeleteRequest(request.id)}
                  className="btn-danger text-sm py-1 px-3"
                >
                  Delete
                </button>
              )}
              
              {request.status === 'completed' && (
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="btn-primary text-sm py-1 px-3"
                >
                  Leave Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Swap Requests</h1>
        <p className="text-gray-400">Manage your incoming and outgoing skill swap requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received ({mockReceivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent ({mockSentRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({mockCompletedSwaps.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading requests...</p>
          </div>
        ) : (
          <>
            {activeTab === 'received' && (
              <div className="space-y-4">
                {mockReceivedRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No received requests yet.</p>
                  </div>
                ) : (
                  mockReceivedRequests.map(request => renderRequestCard(request, true))
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="space-y-4">
                {mockSentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No sent requests yet.</p>
                  </div>
                ) : (
                  mockSentRequests.map(request => renderRequestCard(request, false))
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {mockCompletedSwaps.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No completed swaps yet.</p>
                  </div>
                ) : (
                  mockCompletedSwaps.map(request => renderRequestCard(request, false))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave Feedback
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Rate your experience with <strong>{selectedRequest.requesterName}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackData({...feedbackData, rating: star})}
                    className={`text-2xl ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData({...feedbackData, comment: e.target.value})}
                placeholder="Share your experience..."
                rows={3}
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedRequest(null)
                  setFeedbackData({ rating: 5, comment: '' })
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitFeedback(selectedRequest.id, selectedRequest.requesterId)}
                className="btn-primary flex-1"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SwapRequestsPage 
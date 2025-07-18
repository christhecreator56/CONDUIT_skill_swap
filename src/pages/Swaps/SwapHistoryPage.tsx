import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { SwapRequest, SwapFeedback } from '../../store/slices/swapsSlice'

const SwapHistoryPage = () => {
  const { isLoading, completedSwaps, feedback } = useSelector((state: RootState) => state.swaps)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFeedbackForSwap = (swapId: string) => {
    return feedback.filter(f => f.swapId === swapId)
  }

  const renderSwapCard = (swap: SwapRequest) => {
    const swapFeedback = getFeedbackForSwap(swap.id)
    const userFeedback = swapFeedback.find(f => f.fromUserId === user?.id)
    const otherUserFeedback = swapFeedback.find(f => f.fromUserId !== user?.id)

    return (
      <div key={swap.id} className="card">
        <div className="flex items-start space-x-4">
          <img
            src={swap.requesterPhoto || 'https://via.placeholder.com/50x50?text=No+Photo'}
            alt={swap.requesterName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">{swap.requesterName}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                Completed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300">You Learned</h4>
                <p className="text-sm text-white">{swap.skillRequested.name}</p>
                <p className="text-xs text-gray-400">{swap.skillRequested.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">You Taught</h4>
                <p className="text-sm text-white">{swap.skillOffered.name}</p>
                <p className="text-xs text-gray-400">{swap.skillOffered.description}</p>
              </div>
            </div>

            {swap.message && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-300">{swap.message}</p>
              </div>
            )}

            {/* Feedback Section */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
              
              {userFeedback ? (
                <div className="mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">Your feedback:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= userFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{userFeedback.comment}</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedSwap(swap)
                    setShowFeedback(true)
                  }}
                  className="btn-primary text-sm py-1 px-3 mb-2"
                >
                  Leave Feedback
                </button>
              )}

              {otherUserFeedback && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">Their feedback:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= otherUserFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{otherUserFeedback.comment}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                Completed {formatDate(swap.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Swap History</h1>
        <p className="text-gray-400">View your completed skill exchanges and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{completedSwaps.length}</div>
          <div className="text-sm text-gray-600">Total Swaps</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {feedback.filter(f => f.fromUserId === user?.id).length}
          </div>
          <div className="text-sm text-gray-600">Feedback Given</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {feedback.filter(f => f.toUserId === user?.id).length}
          </div>
          <div className="text-sm text-gray-600">Feedback Received</div>
        </div>
      </div>

      {/* Completed Swaps */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Completed Exchanges</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading history...</p>
          </div>
        ) : completedSwaps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No completed swaps yet.</p>
            <p className="text-sm text-gray-500 mt-1">Complete your first skill exchange to see it here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedSwaps.map(renderSwapCard)}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedSwap && showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave Feedback
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Rate your experience with <strong>{selectedSwap.requesterName}</strong>
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
                    onClick={() => {
                      // Handle rating selection
                    }}
                    className="text-2xl text-gray-300 hover:text-yellow-400"
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
                placeholder="Share your experience..."
                rows={3}
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedSwap(null)
                  setShowFeedback(false)
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle feedback submission
                  setSelectedSwap(null)
                  setShowFeedback(false)
                }}
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

export default SwapHistoryPage 
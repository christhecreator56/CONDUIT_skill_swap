import { swapRequestService, feedbackService } from '../services/database';

export interface SwapRequestData {
  requesterId: string;
  recipientId: string;
  skillOfferedId: string;
  skillRequestedId: string;
  message?: string;
}

export interface SwapRequestWithDetails {
  id: string;
  requesterId: string;
  recipientId: string;
  skillOfferedId: string;
  skillRequestedId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
  skillOffered: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
  skillRequested: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
}

export interface FeedbackData {
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export const swapsAPI = {
  // Create a new swap request
  async createSwapRequest(data: SwapRequestData) {
    try {
      const request = await swapRequestService.create(data);
      return request;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create swap request');
    }
  },

  // Get swap request by ID
  async getSwapRequestById(requestId: string) {
    try {
      const request = await swapRequestService.getById(requestId);
      if (!request) {
        throw new Error('Swap request not found');
      }
      return request;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get swap request');
    }
  },

  // Get swap requests by user ID
  async getSwapRequestsByUserId(userId: string, type: 'sent' | 'received' = 'received') {
    try {
      return await swapRequestService.getByUserId(userId, type);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get swap requests');
    }
  },

  // Update swap request status
  async updateSwapRequestStatus(requestId: string, status: 'accepted' | 'rejected' | 'completed') {
    try {
      const request = await swapRequestService.updateStatus(requestId, status);
      if (!request) {
        throw new Error('Swap request not found');
      }
      return request;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update swap request status');
    }
  },

  // Delete swap request
  async deleteSwapRequest(requestId: string) {
    try {
      await swapRequestService.delete(requestId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete swap request');
    }
  },

  // Get completed swaps
  async getCompletedSwaps(userId: string) {
    try {
      return await swapRequestService.getCompleted(userId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get completed swaps');
    }
  },

  // Create feedback
  async createFeedback(data: FeedbackData) {
    try {
      const feedback = await feedbackService.create(data);
      
      // Update user rating after feedback
      await feedbackService.updateUserRating(data.toUserId);
      
      return feedback;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create feedback');
    }
  },

  // Get feedback by swap ID
  async getFeedbackBySwapId(swapId: string) {
    try {
      return await feedbackService.getBySwapId(swapId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get feedback');
    }
  },

  // Get feedback by user ID
  async getFeedbackByUserId(userId: string, type: 'given' | 'received' = 'received') {
    try {
      return await feedbackService.getByUserId(userId, type);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get feedback');
    }
  },

  // Respond to swap request (accept/reject)
  async respondToSwapRequest(requestId: string, status: 'accepted' | 'rejected') {
    try {
      const request = await swapRequestService.updateStatus(requestId, status);
      if (!request) {
        throw new Error('Swap request not found');
      }
      return request;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to respond to swap request');
    }
  },

  // Complete a swap
  async completeSwap(requestId: string) {
    try {
      const request = await swapRequestService.updateStatus(requestId, 'completed');
      if (!request) {
        throw new Error('Swap request not found');
      }
      return request;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to complete swap');
    }
  }
}; 
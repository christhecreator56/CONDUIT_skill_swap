import { userService } from '../services/database';
import bcrypt from 'bcryptjs';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
    bio?: string;
    location?: string;
    isPublic: boolean;
    availability: {
      weekends: boolean;
      evenings: boolean;
      weekdays: boolean;
      custom?: string;
    };
    rating: number;
  };
}

export const authAPI = {
  // Register a new user
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await userService.getByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await userService.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        isPublic: true,
        availability: {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        },
        rating: 0
      });

      // Create user object without password
      const userWithoutPassword = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePhoto: user.profilePhoto || undefined,
        bio: user.bio || undefined,
        location: user.location || undefined,
        isPublic: user.isPublic,
        availability: user.availability || {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        },
        rating: user.rating || 0
      };

      return {
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  },

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userService.getByEmail(credentials.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await userService.verifyPassword(user, credentials.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const userWithoutPassword = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePhoto: user.profilePhoto || undefined,
        bio: user.bio || undefined,
        location: user.location || undefined,
        isPublic: user.isPublic,
        availability: user.availability || {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        },
        rating: user.rating || 0
      };

      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  // Get user profile
  async getProfile(userId: string): Promise<AuthResponse> {
    try {
      const user = await userService.getById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create user object without password
      const userWithoutPassword = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePhoto: user.profilePhoto || undefined,
        bio: user.bio || undefined,
        location: user.location || undefined,
        isPublic: user.isPublic,
        availability: user.availability || {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        },
        rating: user.rating || 0
      };

      return {
        success: true,
        message: 'Profile retrieved successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get profile');
    }
  },

  // Update user profile
  async updateProfile(userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    profilePhoto?: string;
    isPublic?: boolean;
    availability?: {
      weekends: boolean;
      evenings: boolean;
      weekdays: boolean;
      custom?: string;
    };
  }): Promise<AuthResponse> {
    try {
      const updatedUser = await userService.update(userId, profileData);
      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Create user object without password
      const userWithoutPassword = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto || undefined,
        bio: updatedUser.bio || undefined,
        location: updatedUser.location || undefined,
        isPublic: updatedUser.isPublic,
        availability: updatedUser.availability || {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        },
        rating: updatedUser.rating || 0
      };

      return {
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }
}; 
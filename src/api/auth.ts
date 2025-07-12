import { userService } from '../services/database';
import bcrypt from 'bcryptjs';
import { User } from '../store/slices/authSlice';

export interface AuthResponse {
  user: User;
  token: string | null;
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
        rating: user.rating || 0,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };

      return {
        user: userWithoutPassword,
        token: null // You can add JWT token generation here if needed
      };
    } catch (error) {
      throw error;
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
        rating: user.rating || 0,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };

      return {
        user: userWithoutPassword,
        token: null // You can add JWT token generation here if needed
      };
    } catch (error) {
      throw error;
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
        rating: user.rating || 0,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };

      return {
        user: userWithoutPassword,
        token: null
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get profile');
    }
  },

  // Update user profile
  async updateProfile(userId: string, profileData: Partial<Omit<User, 'createdAt' | 'updatedAt'>>): Promise<AuthResponse> {
    try {
      const updatedUser = await userService.update(userId, profileData);
      
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
        rating: updatedUser.rating || 0,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString()
      };

      return {
        user: userWithoutPassword,
        token: null
      };
    } catch (error) {
      throw error;
    }
  },

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ url: string }> {
    try {
      // For now, we'll use a simple approach with base64 encoding
      // In production, you'd want to upload to a service like Cloudinary, S3, etc.
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve({ url: base64String });
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  },

  // Generate avatar URL based on user name
  generateAvatarUrl(firstName: string, lastName: string): string {
    const name = `${firstName} ${lastName}`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=200&rounded=true&bold=true`;
  }
}; 
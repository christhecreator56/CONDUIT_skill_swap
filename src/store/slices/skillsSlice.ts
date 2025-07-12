import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { skillService } from '../../services/database'

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  userId: string
  type: 'offered' | 'wanted'
  createdAt: string
  isPublic: boolean
}

export interface SkillListing {
  id: string
  skill: Skill
  user: {
    id: string
    firstName: string
    lastName: string
    profilePhoto?: string
    rating: number
    location?: string
  }
  isAvailable: boolean
  createdAt: string
}

export interface SkillsState {
  userSkills: Skill[]
  skillListings: SkillListing[]
  searchResults: SkillListing[]
  categories: string[]
  isLoading: boolean
  error: string | null
  searchFilters: {
    category: string
    proficiencyLevel: string
    location: string
  }
}

const initialState: SkillsState = {
  userSkills: [],
  skillListings: [],
  searchResults: [],
  categories: ['Technology', 'Language', 'Music', 'Art', 'Cooking', 'Fitness', 'Business', 'Education'],
  isLoading: false,
  error: null,
  searchFilters: {
    category: '',
    proficiencyLevel: '',
    location: '',
  },
}

export const fetchUserSkills = createAsyncThunk(
  'skills/fetchUserSkills',
  async (userId: string) => {
    try {
      const skills = await skillService.getByUserId(userId)
      return skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.description || '',
        category: skill.category,
        proficiencyLevel: skill.proficiencyLevel,
        userId: skill.userId,
        type: skill.type,
        createdAt: skill.createdAt.toISOString(),
        isPublic: skill.isPublic,
      }))
    } catch (error) {
      console.error('Failed to fetch user skills:', error)
      return []
    }
  }
)

export const fetchSkillListings = createAsyncThunk(
  'skills/fetchSkillListings',
  async (filters?: { category?: string; proficiencyLevel?: string; location?: string; search?: string }) => {
    const skills = await skillService.getPublicSkills(filters);
    // Map to SkillListing format
    return skills.map((item: any) => ({
      id: item.skill.id,
      skill: {
        id: item.skill.id,
        name: item.skill.name,
        description: item.skill.description,
        category: item.skill.category,
        proficiencyLevel: item.skill.proficiencyLevel,
        userId: item.skill.userId,
        type: item.skill.type,
        createdAt: item.skill.createdAt,
        isPublic: item.skill.isPublic,
      },
      user: item.user,
      isAvailable: item.skill.isAvailable,
      createdAt: item.skill.createdAt,
    }));
  }
)

export const addSkill = createAsyncThunk(
  'skills/addSkill',
  async (skillData: Omit<Skill, 'id' | 'createdAt'>) => {
    try {
      const skill = await skillService.create({
        name: skillData.name,
        description: skillData.description,
        category: skillData.category,
        proficiencyLevel: skillData.proficiencyLevel,
        userId: skillData.userId,
        type: skillData.type,
        isPublic: skillData.isPublic,
        isAvailable: true,
      })
      return {
        id: skill.id,
        name: skill.name,
        description: skill.description || '',
        category: skill.category,
        proficiencyLevel: skill.proficiencyLevel,
        userId: skill.userId,
        type: skill.type,
        createdAt: skill.createdAt.toISOString(),
        isPublic: skill.isPublic,
      }
    } catch (error) {
      console.error('Failed to add skill:', error)
      throw error
    }
  }
)

export const sendSwapRequest = createAsyncThunk(
  'skills/sendSwapRequest',
  async () => {
    // TODO: Replace with actual API call
    const response = await new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Swap request sent successfully!'
        })
      }, 1000)
    })
    return response
  }
)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload }
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {
        category: '',
        proficiencyLevel: '',
        location: '',
      }
    },
    removeSkill: (state, action) => {
      state.userSkills = state.userSkills.filter(skill => skill.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Skills
      .addCase(fetchUserSkills.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserSkills.fulfilled, (state, action) => {
        state.isLoading = false
        state.userSkills = action.payload
      })
      .addCase(fetchUserSkills.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch skills'
      })
      // Fetch Skill Listings
      .addCase(fetchSkillListings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSkillListings.fulfilled, (state, action) => {
        state.isLoading = false
        state.skillListings = action.payload
        state.searchResults = action.payload
      })
      .addCase(fetchSkillListings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch skill listings'
      })
      // Add Skill
      .addCase(addSkill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.isLoading = false
        state.userSkills.push(action.payload)
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to add skill'
      })
      // Send Swap Request
      .addCase(sendSwapRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendSwapRequest.fulfilled, (state) => {
        state.isLoading = false
        // Could add success message handling here
      })
      .addCase(sendSwapRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to send swap request'
      })
  },
})

export const { setSearchFilters, clearSearchFilters, removeSkill } = skillsSlice.actions
export default skillsSlice.reducer 
import { skillService, searchService } from '../services/database';

export interface SkillData {
  name: string;
  description: string;
  category: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  type: 'offered' | 'wanted';
  isPublic: boolean;
  isAvailable: boolean;
}

export interface SkillListing {
  id: string;
  skill: {
    id: string;
    name: string;
    description: string;
    category: string;
    proficiencyLevel: string;
    type: string;
    isPublic: boolean;
    isAvailable: boolean;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    location?: string;
    rating: number;
  };
}

export interface SearchFilters {
  search?: string;
  category?: string;
  proficiencyLevel?: string;
  location?: string;
  type?: 'offered' | 'wanted';
}

export const skillsAPI = {
  // Create a new skill
  async createSkill(userId: string, skillData: SkillData) {
    try {
      const skill = await skillService.create({
        ...skillData,
        userId
      });
      return skill;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create skill');
    }
  },

  // Get user's skills
  async getUserSkills(userId: string) {
    try {
      return await skillService.getByUserId(userId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get user skills');
    }
  },

  // Get skill by ID
  async getSkillById(skillId: string) {
    try {
      const skill = await skillService.getById(skillId);
      if (!skill) {
        throw new Error('Skill not found');
      }
      return skill;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get skill');
    }
  },

  // Update skill
  async updateSkill(skillId: string, skillData: Partial<SkillData>) {
    try {
      const skill = await skillService.update(skillId, skillData);
      if (!skill) {
        throw new Error('Skill not found');
      }
      return skill;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update skill');
    }
  },

  // Delete skill
  async deleteSkill(skillId: string) {
    try {
      await skillService.delete(skillId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete skill');
    }
  },

  // Get public skills for browsing
  async getPublicSkills(filters?: {
    category?: string;
    proficiencyLevel?: string;
    type?: 'offered' | 'wanted';
    search?: string;
  }) {
    try {
      return await skillService.getPublicSkills(filters);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get public skills');
    }
  },

  // Search skills with filters
  async searchSkills(filters: SearchFilters): Promise<SkillListing[]> {
    try {
      const results = await searchService.searchSkills(filters);
      return results.map(result => ({
        id: result.skill.id,
        skill: {
          id: result.skill.id,
          name: result.skill.name,
          description: result.skill.description || '',
          category: result.skill.category,
          proficiencyLevel: result.skill.proficiencyLevel,
          type: result.skill.type,
          isPublic: result.skill.isPublic,
          isAvailable: result.skill.isAvailable,
        },
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          profilePhoto: result.user.profilePhoto || undefined,
          location: result.user.location || undefined,
          rating: result.user.rating || 0,
        },
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search skills');
    }
  },

  // Get skill categories
  async getCategories() {
    try {
      return await skillService.getCategories();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get categories');
    }
  },

  // Toggle skill visibility
  async toggleSkillVisibility(skillId: string, isPublic: boolean) {
    try {
      const skill = await skillService.update(skillId, { isPublic });
      if (!skill) {
        throw new Error('Skill not found');
      }
      return skill;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle skill visibility');
    }
  },

  // Toggle skill availability
  async toggleSkillAvailability(skillId: string, isAvailable: boolean) {
    try {
      const skill = await skillService.update(skillId, { isAvailable });
      if (!skill) {
        throw new Error('Skill not found');
      }
      return skill;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle skill availability');
    }
  }
}; 
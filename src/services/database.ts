import { db } from '../db';
import { users, skills, swapRequests, feedback } from '../db/schema';
import { eq, and, or, desc, ilike } from 'drizzle-orm';
import type { NewUser, NewSkill, NewSwapRequest, NewFeedback } from '../db/schema';
import bcrypt from 'bcryptjs';

// User Services
export const userService = {
  // Create a new user
  async create(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<typeof users.$inferSelect> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();
    return user;
  },

  // Get user by ID
  async getById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Get user by email
  async getByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  // Update user
  async update(id: string, userData: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  // Delete user
  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  },

  // Verify password
  async verifyPassword(user: typeof users.$inferSelect, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  },
};

// Skill Services
export const skillService = {
  // Create a new skill
  async create(skillData: Omit<NewSkill, 'id' | 'createdAt' | 'updatedAt'>): Promise<typeof skills.$inferSelect> {
    const [skill] = await db.insert(skills).values(skillData).returning();
    return skill;
  },

  // Get skill by ID
  async getById(id: string) {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  },

  // Get skills by user ID
  async getByUserId(userId: string) {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  },

  // Get public skills for browsing
  async getPublicSkills(filters?: {
    category?: string;
    proficiencyLevel?: string;
    type?: 'offered' | 'wanted';
    search?: string;
  }) {
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(skills.category, filters.category));
    }
    if (filters?.proficiencyLevel) {
      conditions.push(eq(skills.proficiencyLevel, filters.proficiencyLevel as any));
    }
    if (filters?.type) {
      conditions.push(eq(skills.type, filters.type));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(skills.name, `%${filters.search}%`),
          ilike(skills.description, `%${filters.search}%`),
          ilike(skills.category, `%${filters.search}%`)
        )
      );
    }
    let query = db.select().from(skills);
    let result;
    if (conditions.length > 0) {
      result = await query.where(and(...conditions)).orderBy(desc(skills.createdAt));
    } else {
      result = await query.orderBy(desc(skills.createdAt));
    }
    return result;
  },

  // Update skill
  async update(id: string, skillData: Partial<typeof skills.$inferInsert>) {
    const [skill] = await db
      .update(skills)
      .set({ ...skillData, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();
    return skill;
  },

  // Delete skill
  async delete(id: string) {
    await db.delete(skills).where(eq(skills.id, id));
  },

  // Get skill categories
  async getCategories() {
    const result = await db.selectDistinct({ category: skills.category }).from(skills);
    return result.map(r => r.category);
  },
};

// Swap Request Services
export const swapRequestService = {
  // Create a new swap request
  async create(requestData: Omit<NewSwapRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<typeof swapRequests.$inferSelect> {
    const [request] = await db.insert(swapRequests).values(requestData).returning();
    return request;
  },

  // Get swap request by ID
  async getById(id: string) {
    const [request] = await db.select().from(swapRequests).where(eq(swapRequests.id, id));
    return request;
  },

  // Get swap requests by user ID (sent or received)
  async getByUserId(userId: string, type: 'sent' | 'received' = 'received') {
    const condition = type === 'sent' 
      ? eq(swapRequests.requesterId, userId)
      : eq(swapRequests.recipientId, userId);
    
    return await db.select().from(swapRequests).where(condition).orderBy(desc(swapRequests.createdAt));
  },

  // Update swap request status
  async updateStatus(id: string, status: typeof swapRequests.$inferSelect['status']) {
    const [request] = await db
      .update(swapRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(swapRequests.id, id))
      .returning();
    return request;
  },

  // Delete swap request
  async delete(id: string) {
    await db.delete(swapRequests).where(eq(swapRequests.id, id));
  },

  // Get completed swaps
  async getCompleted(userId: string) {
    return await db
      .select()
      .from(swapRequests)
      .where(
        and(
          eq(swapRequests.status, 'completed'),
          or(
            eq(swapRequests.requesterId, userId),
            eq(swapRequests.recipientId, userId)
          )
        )
      )
      .orderBy(desc(swapRequests.updatedAt));
  },
};

// Feedback Services
export const feedbackService = {
  // Create feedback
  async create(feedbackData: Omit<NewFeedback, 'id' | 'createdAt'>): Promise<typeof feedback.$inferSelect> {
    const [newFeedback] = await db.insert(feedback).values(feedbackData).returning();
    return newFeedback;
  },

  // Get feedback by swap ID
  async getBySwapId(swapId: string) {
    return await db.select().from(feedback).where(eq(feedback.swapId, swapId));
  },

  // Get feedback by user ID
  async getByUserId(userId: string, type: 'given' | 'received' = 'received') {
    const condition = type === 'given' 
      ? eq(feedback.fromUserId, userId)
      : eq(feedback.toUserId, userId);
    
    return await db.select().from(feedback).where(condition).orderBy(desc(feedback.createdAt));
  },

  // Update user rating based on feedback
  async updateUserRating(userId: string) {
    const userFeedback = await db
      .select({ rating: feedback.rating })
      .from(feedback)
      .where(eq(feedback.toUserId, userId));

    if (userFeedback.length > 0) {
      const averageRating = Math.round(
        userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length
      );

      await db
        .update(users)
        .set({ rating: averageRating })
        .where(eq(users.id, userId));
    }
  },
};

// Search and Browse Services
export const searchService = {
  // Search skills with filters
  async searchSkills(filters: {
    search?: string;
    category?: string;
    proficiencyLevel?: string;
    location?: string;
    type?: 'offered' | 'wanted';
  }) {
    const conditions = [];
    if (filters.category) {
      conditions.push(eq(skills.category, filters.category));
    }
    if (filters.proficiencyLevel) {
      conditions.push(eq(skills.proficiencyLevel, filters.proficiencyLevel as any));
    }
    if (filters.type) {
      conditions.push(eq(skills.type, filters.type));
    }
    if (filters.location) {
      conditions.push(ilike(users.location, `%${filters.location}%`));
    }
    if (filters.search) {
      conditions.push(
        or(
          ilike(skills.name, `%${filters.search}%`),
          ilike(skills.description, `%${filters.search}%`),
          ilike(skills.category, `%${filters.search}%`)
        )
      );
    }
    let query = db
      .select({
        skill: skills,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profilePhoto: users.profilePhoto,
          location: users.location,
          rating: users.rating,
        },
      })
      .from(skills)
      .innerJoin(users, eq(skills.userId, users.id));
    let result;
    if (conditions.length > 0) {
      result = await query.where(and(...conditions)).orderBy(desc(skills.createdAt));
    } else {
      result = await query.orderBy(desc(skills.createdAt));
    }
    return result;
  },
}; 
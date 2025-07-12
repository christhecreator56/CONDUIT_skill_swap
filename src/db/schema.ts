import { pgTable, text, timestamp, boolean, integer, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(), // Will be hashed
  profilePhoto: text('profile_photo'),
  bio: text('bio'),
  location: varchar('location', { length: 255 }),
  isPublic: boolean('is_public').default(true).notNull(),
  availability: jsonb('availability').$type<{
    weekends: boolean;
    evenings: boolean;
    weekdays: boolean;
    custom?: string;
  }>().default({
    weekends: true,
    evenings: true,
    weekdays: false,
    custom: ''
  }),
  rating: integer('rating').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Skills table
export const skills = pgTable('skills', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  proficiencyLevel: varchar('proficiency_level', { length: 20 }).notNull().$type<'beginner' | 'intermediate' | 'advanced' | 'expert'>(),
  type: varchar('type', { length: 20 }).notNull().$type<'offered' | 'wanted'>(),
  isPublic: boolean('is_public').default(true).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Swap requests table
export const swapRequests = pgTable('swap_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  requesterId: text('requester_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: text('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillOfferedId: text('skill_offered_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  skillRequestedId: text('skill_requested_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  message: text('message'),
  status: varchar('status', { length: 20 }).notNull().$type<'pending' | 'accepted' | 'rejected' | 'completed'>().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Feedback table
export const feedback = pgTable('feedback', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  swapId: text('swap_id').notNull().references(() => swapRequests.id, { onDelete: 'cascade' }),
  fromUserId: text('from_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: text('to_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull().$type<1 | 2 | 3 | 4 | 5>(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  sentSwapRequests: many(swapRequests, { relationName: 'requester' }),
  receivedSwapRequests: many(swapRequests, { relationName: 'recipient' }),
  givenFeedback: many(feedback, { relationName: 'fromUser' }),
  receivedFeedback: many(feedback, { relationName: 'toUser' }),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
  offeredInSwaps: many(swapRequests, { relationName: 'skillOffered' }),
  requestedInSwaps: many(swapRequests, { relationName: 'skillRequested' }),
}));

export const swapRequestsRelations = relations(swapRequests, ({ one, many }) => ({
  requester: one(users, {
    fields: [swapRequests.requesterId],
    references: [users.id],
    relationName: 'requester',
  }),
  recipient: one(users, {
    fields: [swapRequests.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
  skillOffered: one(skills, {
    fields: [swapRequests.skillOfferedId],
    references: [skills.id],
    relationName: 'skillOffered',
  }),
  skillRequested: one(skills, {
    fields: [swapRequests.skillRequestedId],
    references: [skills.id],
    relationName: 'skillRequested',
  }),
  feedback: many(feedback),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  swap: one(swapRequests, {
    fields: [feedback.swapId],
    references: [swapRequests.id],
  }),
  fromUser: one(users, {
    fields: [feedback.fromUserId],
    references: [users.id],
    relationName: 'fromUser',
  }),
  toUser: one(users, {
    fields: [feedback.toUserId],
    references: [users.id],
    relationName: 'toUser',
  }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SwapRequest = typeof swapRequests.$inferSelect;
export type NewSwapRequest = typeof swapRequests.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert; 
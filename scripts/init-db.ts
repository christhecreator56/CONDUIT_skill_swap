import { db } from '../src/db/index';
import { users, skills } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test the connection
    const result = await db.select().from(users).limit(1);
    console.log('Database connection successful!');
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');
    
    // Check if sample user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, 'john@example.com')).limit(1);
    
    if (existingUser.length > 0) {
      console.log('Sample user already exists, skipping seeding...');
      return true;
    }
    
    // Create a sample user
    const sampleUser = await db.insert(users).values({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O', // password: test123
      bio: 'Passionate about learning and sharing skills',
      location: 'New York, NY',
      isPublic: true,
      availability: {
        weekends: true,
        evenings: true,
        weekdays: false,
        custom: ''
      },
      rating: 0
    }).returning();

    console.log('Sample user created:', sampleUser[0].id);
    
    // Create sample skills
    const sampleSkills = await db.insert(skills).values([
      {
        userId: sampleUser[0].id,
        name: 'React Development',
        description: 'Building modern web applications with React',
        category: 'Technology',
        proficiencyLevel: 'advanced',
        type: 'offered',
        isPublic: true,
        isAvailable: true
      },
      {
        userId: sampleUser[0].id,
        name: 'Guitar Lessons',
        description: 'Learn acoustic and electric guitar',
        category: 'Music',
        proficiencyLevel: 'intermediate',
        type: 'offered',
        isPublic: true,
        isAvailable: true
      },
      {
        userId: sampleUser[0].id,
        name: 'Spanish Language',
        description: 'Conversational Spanish speaking and writing',
        category: 'Language',
        proficiencyLevel: 'beginner',
        type: 'wanted',
        isPublic: true,
        isAvailable: true
      }
    ]).returning();

    console.log('Sample skills created:', sampleSkills.length);
    
    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    return false;
  }
}

// Main execution
async function main() {
  const initSuccess = await initializeDatabase();
  if (initSuccess) {
    const seedSuccess = await seedDatabase();
    if (seedSuccess) {
      console.log('Database setup completed!');
      process.exit(0);
    } else {
      console.error('Database seeding failed!');
      process.exit(1);
    }
  } else {
    console.error('Database initialization failed!');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 
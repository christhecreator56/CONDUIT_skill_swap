import { db } from './nodeIndex';
import { users, skills } from './schema';
import bcrypt from 'bcryptjs';

// Sample users data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john1@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O', // test123
    bio: 'Passionate about learning and sharing skills',
    location: 'New York, NY',
    rating: 4
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah2@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Creative professional with expertise in design and music',
    location: 'Los Angeles, CA',
    rating: 5
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael3@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Tech enthusiast and fitness instructor',
    location: 'San Francisco, CA',
    rating: 4
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily4@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Language teacher and cooking enthusiast',
    location: 'Miami, FL',
    rating: 5
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david5@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Business consultant and photography hobbyist',
    location: 'Chicago, IL',
    rating: 4
  },
  {
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa6@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Art teacher and yoga instructor',
    location: 'Seattle, WA',
    rating: 5
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james7@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Software engineer and chess player',
    location: 'Austin, TX',
    rating: 4
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria8@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O',
    bio: 'Dance instructor and nutrition expert',
    location: 'Denver, CO',
    rating: 5
  }
];

// Comprehensive skills data
const skillsData: Array<{
  name: string;
  description: string;
  category: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  type: 'offered' | 'wanted';
  userId: number;
}> = [
  // Technology Skills (15 skills)
  {
    name: 'React Development',
    description: 'Building modern web applications with React, hooks, and state management',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 0
  },
  {
    name: 'Python Programming',
    description: 'Data science, automation, and web development with Python',
    category: 'Technology',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 2
  },
  {
    name: 'JavaScript Fundamentals',
    description: 'Core JavaScript concepts, ES6+, and modern development practices',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 6
  },
  {
    name: 'UI/UX Design',
    description: 'User interface and experience design with Figma and Adobe XD',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 1
  },
  {
    name: 'Mobile App Development',
    description: 'iOS and Android app development with React Native',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 0
  },
  {
    name: 'Database Design',
    description: 'SQL, NoSQL databases, and data modeling',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 6
  },
  {
    name: 'DevOps & CI/CD',
    description: 'Docker, Kubernetes, and continuous integration practices',
    category: 'Technology',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 2
  },
  {
    name: 'Machine Learning',
    description: 'Introduction to ML algorithms and data analysis',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 2
  },
  {
    name: 'Web Security',
    description: 'Cybersecurity best practices and penetration testing',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 6
  },
  {
    name: 'Blockchain Development',
    description: 'Smart contracts and decentralized applications',
    category: 'Technology',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 0
  },
  {
    name: 'Game Development',
    description: 'Unity and Unreal Engine game development',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'wanted',
    userId: 1
  },
  {
    name: 'Cloud Computing',
    description: 'AWS, Azure, and Google Cloud Platform services',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'wanted',
    userId: 4
  },
  {
    name: 'Data Visualization',
    description: 'Creating compelling charts and dashboards',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 1
  },
  {
    name: 'API Development',
    description: 'RESTful APIs and GraphQL development',
    category: 'Technology',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 6
  },
  {
    name: 'WordPress Development',
    description: 'Custom themes and plugin development',
    category: 'Technology',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 4
  },

  // Language Skills (8 skills)
  {
    name: 'Spanish Language',
    description: 'Conversational Spanish speaking and writing',
    category: 'Language',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 3
  },
  {
    name: 'French Language',
    description: 'French grammar, pronunciation, and cultural context',
    category: 'Language',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Mandarin Chinese',
    description: 'Basic Mandarin conversation and writing',
    category: 'Language',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 5
  },
  {
    name: 'German Language',
    description: 'German grammar and business communication',
    category: 'Language',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Japanese Language',
    description: 'Japanese writing systems and conversation',
    category: 'Language',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 5
  },
  {
    name: 'Italian Language',
    description: 'Italian pronunciation and cultural expressions',
    category: 'Language',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Portuguese Language',
    description: 'Brazilian Portuguese conversation',
    category: 'Language',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 7
  },
  {
    name: 'Arabic Language',
    description: 'Modern Standard Arabic and dialects',
    category: 'Language',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 5
  },

  // Music Skills (6 skills)
  {
    name: 'Guitar Lessons',
    description: 'Acoustic and electric guitar techniques',
    category: 'Music',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 0
  },
  {
    name: 'Piano Lessons',
    description: 'Classical and contemporary piano playing',
    category: 'Music',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 1
  },
  {
    name: 'Music Production',
    description: 'Digital audio workstation and music composition',
    category: 'Music',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 1
  },
  {
    name: 'Vocal Training',
    description: 'Singing techniques and voice control',
    category: 'Music',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 7
  },
  {
    name: 'Drum Lessons',
    description: 'Rhythm patterns and drum kit techniques',
    category: 'Music',
    proficiencyLevel: 'intermediate',
    type: 'wanted',
    userId: 0
  },
  {
    name: 'Music Theory',
    description: 'Understanding chords, scales, and composition',
    category: 'Music',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 1
  },

  // Art Skills (5 skills)
  {
    name: 'Digital Art',
    description: 'Digital painting and illustration with Procreate',
    category: 'Art',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 5
  },
  {
    name: 'Oil Painting',
    description: 'Traditional oil painting techniques and color theory',
    category: 'Art',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 5
  },
  {
    name: 'Photography',
    description: 'Portrait and landscape photography techniques',
    category: 'Art',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 4
  },
  {
    name: 'Sculpture',
    description: 'Clay modeling and 3D art creation',
    category: 'Art',
    proficiencyLevel: 'beginner',
    type: 'wanted',
    userId: 5
  },
  {
    name: 'Calligraphy',
    description: 'Modern and traditional calligraphy styles',
    category: 'Art',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 5
  },

  // Cooking Skills (5 skills)
  {
    name: 'Italian Cooking',
    description: 'Authentic Italian pasta and pizza making',
    category: 'Cooking',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Baking',
    description: 'Pastry making and bread baking techniques',
    category: 'Cooking',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Asian Cuisine',
    description: 'Chinese, Japanese, and Thai cooking methods',
    category: 'Cooking',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Vegan Cooking',
    description: 'Plant-based meal preparation and nutrition',
    category: 'Cooking',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 3
  },
  {
    name: 'Wine Pairing',
    description: 'Wine selection and food pairing techniques',
    category: 'Cooking',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 4
  },

  // Fitness Skills (4 skills)
  {
    name: 'Yoga Instruction',
    description: 'Vinyasa and Hatha yoga practices',
    category: 'Fitness',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 5
  },
  {
    name: 'Personal Training',
    description: 'Strength training and fitness program design',
    category: 'Fitness',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 2
  },
  {
    name: 'Dance Classes',
    description: 'Salsa, Bachata, and Latin dance styles',
    category: 'Fitness',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 7
  },
  {
    name: 'Meditation',
    description: 'Mindfulness and stress reduction techniques',
    category: 'Fitness',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 5
  },

  // Business Skills (4 skills)
  {
    name: 'Business Strategy',
    description: 'Strategic planning and business development',
    category: 'Business',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 4
  },
  {
    name: 'Digital Marketing',
    description: 'Social media marketing and SEO strategies',
    category: 'Business',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 4
  },
  {
    name: 'Financial Planning',
    description: 'Personal finance and investment strategies',
    category: 'Business',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 4
  },
  {
    name: 'Public Speaking',
    description: 'Presentation skills and communication techniques',
    category: 'Business',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 4
  },

  // Education Skills (3 skills)
  {
    name: 'Tutoring Math',
    description: 'Algebra, calculus, and statistics tutoring',
    category: 'Education',
    proficiencyLevel: 'expert',
    type: 'offered',
    userId: 6
  },
  {
    name: 'English Literature',
    description: 'Classic literature analysis and writing',
    category: 'Education',
    proficiencyLevel: 'advanced',
    type: 'offered',
    userId: 1
  },
  {
    name: 'Science Experiments',
    description: 'Hands-on science projects for all ages',
    category: 'Education',
    proficiencyLevel: 'intermediate',
    type: 'offered',
    userId: 2
  }
];

export async function seedComprehensiveData() {
  try {
    console.log('Seeding comprehensive database with 50+ skills...');

    // Log user count before cleanup
    const usersBefore = await db.select().from(users);
    console.log(`Users in DB before cleanup: ${usersBefore.length}`);

    // Clean up existing data
    await db.delete(skills);
    await db.delete(users);

    // Log user count after cleanup
    const usersAfter = await db.select().from(users);
    console.log(`Users in DB after cleanup: ${usersAfter.length}`);
    
    // Create users
    const createdUsers: any[] = [];
    for (const userData of sampleUsers) {
      const [user] = await db.insert(users).values({
        ...userData,
        isPublic: true,
        availability: {
          weekends: true,
          evenings: true,
          weekdays: false,
          custom: ''
        }
      }).returning();
      createdUsers.push(user);
      console.log(`Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    // Create skills
    const skillsToInsert = skillsData.map(skill => ({
      ...skill,
      userId: createdUsers[skill.userId].id,
      isPublic: true,
      isAvailable: true
    }));

    const createdSkills = await db.insert(skills).values(skillsToInsert).returning();
    
    console.log(`Successfully created ${createdUsers.length} users and ${createdSkills.length} skills!`);
    console.log('Comprehensive database seeding completed!');
    
    return true;
  } catch (error) {
    console.error('Comprehensive database seeding failed:', error);
    return false;
  }
}

// Run seeding if this file is executed directly
// (Removed to prevent double execution) 
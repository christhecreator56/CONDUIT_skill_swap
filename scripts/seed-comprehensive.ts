import { seedComprehensiveData } from '../src/db/seedData';

async function main() {
  console.log('Starting comprehensive database seeding...');
  
  try {
    const success = await seedComprehensiveData();
    
    if (success) {
      console.log('✅ Comprehensive seeding completed successfully!');
      console.log('📊 Created 8 users with 50+ diverse skills');
      console.log('🎯 Skills cover: Technology, Language, Music, Art, Cooking, Fitness, Business, Education');
      process.exit(0);
    } else {
      console.error('❌ Comprehensive seeding failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Unexpected error during seeding:', error);
    process.exit(1);
  }
}

main(); 
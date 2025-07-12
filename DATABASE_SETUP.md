# Database Setup with Neon

This guide will help you set up the Neon database integration for the Conduit skill exchange platform.

## Prerequisites

1. A Neon account (sign up at https://neon.tech)
2. Node.js and npm installed
3. Git for version control

## Step 1: Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign in or create an account
3. Click "Create New Project"
4. Choose a project name (e.g., "conduit-skill-exchange")
5. Select a region close to your users
6. Click "Create Project"

## Step 2: Get Your Connection String

1. In your Neon project dashboard, click on "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://[user]:[password]@[neon_host]/[dbname]?sslmode=require
   ```

## Step 3: Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and replace the placeholder with your actual Neon connection string:
   ```
   DATABASE_URL="postgresql://your-username:your-password@your-host/your-database?sslmode=require"
   ```

## Step 4: Install Dependencies

The required dependencies are already installed:
- `@neondatabase/serverless` - Neon serverless driver
- `drizzle-orm` - Type-safe ORM
- `drizzle-kit` - Database migrations and schema management
- `bcryptjs` - Password hashing

## Step 5: Generate and Run Database Migrations

1. Generate the migration files:
   ```bash
   npm run db:generate
   ```

2. Push the schema to your Neon database:
   ```bash
   npm run db:push
   ```

   Or run migrations:
   ```bash
   npm run db:migrate
   ```

## Step 6: Verify Database Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Try to register a new user or log in
3. Check the Neon console to see if data is being created

## Database Schema

The application uses the following tables:

### Users
- `id` - Unique identifier
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - Unique email address
- `password` - Hashed password
- `profile_photo` - URL to profile image
- `bio` - User biography
- `location` - User's location
- `is_public` - Profile visibility setting
- `availability` - JSON object with availability preferences
- `rating` - Average user rating
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Skills
- `id` - Unique identifier
- `user_id` - Foreign key to users table
- `name` - Skill name
- `description` - Skill description
- `category` - Skill category
- `proficiency_level` - Beginner/Intermediate/Advanced/Expert
- `type` - Offered or Wanted
- `is_public` - Skill visibility
- `is_available` - Skill availability
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Swap Requests
- `id` - Unique identifier
- `requester_id` - User requesting the swap
- `recipient_id` - User receiving the request
- `skill_offered_id` - Skill being offered
- `skill_requested_id` - Skill being requested
- `message` - Optional message
- `status` - Pending/Accepted/Rejected/Completed
- `created_at` - Request timestamp
- `updated_at` - Last update timestamp

### Feedback
- `id` - Unique identifier
- `swap_id` - Foreign key to swap_requests
- `from_user_id` - User giving feedback
- `to_user_id` - User receiving feedback
- `rating` - 1-5 star rating
- `comment` - Feedback comment
- `created_at` - Feedback timestamp

## Available Database Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema changes directly to database
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check that your Neon project is active
- Ensure your IP is not blocked by Neon

### Migration Issues
- If you get schema conflicts, try `npm run db:push` instead of `npm run db:migrate`
- Check the generated SQL in the `drizzle` folder

### Performance Issues
- Neon automatically scales, but monitor your usage in the console
- Consider adding indexes for frequently queried columns

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Passwords are automatically hashed using bcrypt
- All database queries use parameterized statements to prevent SQL injection

## Next Steps

After setting up the database:

1. Test user registration and login
2. Add some skills to test the skills functionality
3. Create swap requests between users
4. Test the feedback system

The application is now fully integrated with Neon database and ready for development! 
# Database Setup Guide for Stockly

This guide will help you set up and connect to a PostgreSQL database for Stockly.

## Option 1: Local PostgreSQL Setup

### Step 1: Install PostgreSQL

**Windows:**
1. Download PostgreSQL from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

Open your terminal/command prompt and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE stockly;

# Exit psql
\q
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Database Connection
# Format: postgresql://username:password@host:port/database_name
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/stockly

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here-generate-a-long-random-string

# Next.js Public (same as BETTER_AUTH_URL for local dev)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Generate a secure secret:**
```bash
# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On macOS/Linux
openssl rand -base64 32
```

## Option 2: Supabase (Cloud PostgreSQL) - Recommended for Quick Setup

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

### Step 3: Set Up Environment Variables

Create a `.env.local` file:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here-generate-a-long-random-string

# Next.js Public
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual Supabase database password (found in project settings).

## Step 4: Run Database Migrations

After setting up your `.env.local` file, run the migrations:

```bash
# Generate migration files from your schema
npx drizzle-kit generate

# Apply migrations to your database
npx drizzle-kit migrate
```

## Step 5: Verify Connection

### Option A: Using Drizzle Studio (Visual Database Browser)

```bash
npx drizzle-kit studio
```

This will open a browser at `http://localhost:4983` where you can:
- View your database tables
- Browse data
- Run queries
- Edit records

### Option B: Test with psql

```bash
# Connect to your database
psql -U postgres -d stockly

# List tables
\dt

# View users table structure
\d users

# Exit
\q
```

## Step 6: Start the Application

```bash
npm run dev
```

The app should now connect to your database automatically!

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"

- Make sure you created `.env.local` (not `.env`)
- Restart your development server after creating the file
- Verify the file is in the root directory (same level as `package.json`)

### Error: "Connection refused" or "Cannot connect"

**For Local PostgreSQL:**
- Make sure PostgreSQL service is running:
  - Windows: Check Services app
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`
- Verify the port (default is 5432)
- Check your username and password are correct

**For Supabase:**
- Verify your connection string is correct
- Check that your Supabase project is active
- Make sure you're using the correct password (not your account password, but the database password)

### Error: "relation does not exist"

Run the migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Better Auth Tables Not Created

Better Auth will automatically create its tables when you first use authentication. If they're missing:

1. Make sure Better Auth is properly configured
2. Try signing up a user - this will trigger table creation
3. Or manually run Better Auth migrations if available

## Database Schema Overview

Your database will have these tables:

- **users** - User accounts (managed by Better Auth)
- **locations** - Storage locations (Kitchen Fridge, etc.)
- **categories** - Categories within locations
- **items** - Individual inventory items

All tables are connected with foreign keys and cascade deletes.

## Production Setup

For production, use a managed PostgreSQL service:

- **Supabase** (recommended)
- **Neon** (serverless PostgreSQL)
- **Railway**
- **Vercel Postgres**
- **AWS RDS**

Update your production environment variables with the production database URL.

## Quick Start Commands

```bash
# 1. Create .env.local with your DATABASE_URL
# 2. Generate migrations
npx drizzle-kit generate

# 3. Run migrations
npx drizzle-kit migrate

# 4. (Optional) Open Drizzle Studio to view database
npx drizzle-kit studio

# 5. Start the app
npm run dev
```


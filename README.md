# Stockly - Home Inventory Management

<img width="1891" height="847" alt="image" src="https://github.com/user-attachments/assets/bbbd1955-6ef6-451d-8b32-218444e0e58e" />




A modern SaaS application for tracking home inventory and managing grocery lists. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

<img width="1886" height="845" alt="image" src="https://github.com/user-attachments/assets/fb17bf6c-2dfc-4237-a23c-3379808ee055" />


https://www.loom.com/share/dac2e2a9fcb84b2480bbaf47aac3003a

## Features
<img width="1890" height="897" alt="image" src="https://github.com/user-attachments/assets/be12317d-005a-45e7-8c21-ad95ab1f21f8" />

- **Hierarchical Organization**: Locations → Categories → Items structure 
- **Stock Monitoring**: Track quantities and get alerts for low stock items
- **Shopping Lists**: Automatically generate shopping lists from items marked "To Buy"
- **Modern UI**: Beautiful, responsive design with dark mode support
- **GSAP Animations**: Smooth scroll animations and text reveals
- **Authentication**: Secure user authentication with Better Auth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Animations**: GSAP (GreenSock)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Supabase)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/stockly
   
   # Better Auth
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your-secret-key-here-use-a-long-random-string
   
   # Next.js Public
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

   **Important**: 
   - Replace `DATABASE_URL` with your PostgreSQL connection string
   - Generate a secure random string for `BETTER_AUTH_SECRET` (you can use `openssl rand -base64 32`)

4. **Set up the database**:
   
   Run database migrations with Drizzle:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
   
   Or if using Drizzle Studio:
   ```bash
   npx drizzle-kit studio
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
stockly/
├── app/
│   ├── actions/          # Server actions for CRUD operations
│   │   ├── locations.ts
│   │   ├── categories.ts
│   │   └── items.ts
│   ├── api/              # API routes
│   │   └── auth/         # Better Auth routes
│   ├── contact/          # Contact page
│   ├── dashboard/        # Protected dashboard pages
│   │   ├── inventory/    # Inventory management
│   │   └── shopping-list/ # Shopping list view
│   ├── faq/              # FAQ page
│   ├── services/         # Services page
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── navbar.tsx        # Navigation bar
│   └── dashboard-sidebar.tsx
├── db/
│   ├── schema.ts         # Drizzle schema definitions
│   └── index.ts          # Database connection
├── lib/
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Client-side auth
│   ├── auth-server.ts    # Server-side auth helpers
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Database Schema

The application uses a hierarchical structure:

- **Users**: Account holders (managed by Better Auth)
- <img width="1851" height="832" alt="image" src="https://github.com/user-attachments/assets/b0074a92-96e0-4bc4-bc29-ad08b67ac07b" />

- **Locations**: Storage locations (e.g., "Kitchen Fridge", "Garage Pantry")
- **Categories**: Categories within locations (e.g., "Dairy", "Canned Goods")
- **Items**: Individual items with:
  - Name
  - Quantity
  - Status (In Stock, Low Stock, Out of Stock)
  - To Buy flag (for shopping lists)

## Usage

### Creating Your First Inventory

1. **Sign up/Login**: Create an account or sign in
2. **Create a Location**: Go to Inventory Manager and create your first location
3. **Add Categories**: Within each location, create categories to organize items
4. **Add Items**: Add items to categories with quantities and status
5. **Mark for Shopping**: Toggle the "To Buy" flag to add items to your shopping list

### Features Overview

- **Dashboard**: Quick overview of low stock items and items to buy
- **Inventory Manager**: Full CRUD operations for locations, categories, and items
- **Shopping List**: Consolidated view of all items marked "To Buy"

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Migrations

- `npx drizzle-kit generate` - Generate migration files
- `npx drizzle-kit migrate` - Run migrations
- `npx drizzle-kit studio` - Open Drizzle Studio (database GUI)

## Authentication

The app uses Better Auth for authentication. Users can:
- Sign up with email and password
- Sign in to their account
- Access protected dashboard routes

## Contributing

This is a private project. For questions or issues, please contact the development team.

## License

Private - All rights reserved

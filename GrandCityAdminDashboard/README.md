# Grand City Admin Dashboard - Next.js

Admin Dashboard for Grand City Management built with Next.js, TypeScript, Tailwind CSS, and NeonDB.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- NeonDB account (for database)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your NeonDB connection string:
     ```
     DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment on Vercel

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## Database Setup (NeonDB)

To set up your NeonDB database:

1. Create a NeonDB account at https://console.neon.tech
2. Create a new project
3. Copy your connection string from the dashboard
4. Run the SQL schema from `neon-schema.sql` in the NeonDB SQL Editor

The database includes tables for:
- Projects
- Shifts
- Communications
- Photo Logs
- Tasks
- Payments
- Vendors
- Reports
- Users

Refer to the `types/index.ts` file for the data structure.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes group
│   │   ├── page.tsx       # Dashboard home
│   │   ├── users/         # Users page
│   │   ├── analytics/     # Analytics page
│   │   └── settings/      # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
└── public/               # Static files
```

## Features

- 📊 Dashboard Overview
- 👥 User Management
- 📈 Analytics & Reports
- ⚙️ Settings Configuration
- �️ NeonDB Integration
- 📱 Responsive Design
- 🎨 Tailwind CSS Styling

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** NeonDB (Serverless Postgres)
- **Deployment:** Vercel
- **Charts:** Recharts
- **Icons:** Lucide React

## License

Private - Grand City Management

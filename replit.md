# TrailShare - Collaborative Hiking Tracker

## ⚠️ IMPORTANT: Deployment Configuration

**This application requires MySQL/MariaDB and is configured for self-hosted deployment on Rocky Linux.**

- **Production Target**: Rocky Linux server with MariaDB/MySQL
- **Authentication**: Google OAuth (Passport.js) for production, Replit Auth for development
- **Database**: MySQL/MariaDB ONLY - PostgreSQL is not supported
- **⚠️ Cannot run on Replit**: This app requires MySQL and will not work with Replit's PostgreSQL database

### For Rocky Linux Deployment
See **DEPLOYMENT_ROCKY_LINUX.md** for complete deployment instructions including:
- MariaDB setup and configuration
- Google OAuth credentials from Google Cloud Console
- Environment variables configuration
- PM2 process management
- Nginx reverse proxy setup

## Overview
TrailShare is a mobile-optimized web application for tracking and sharing hiking adventures. Users can log hikes with locations, photos, difficulty ratings, and collaborate with others on shared trails.

## Features
- **User Authentication**: Google OAuth for production deployment (Replit Auth for testing)
- **Hike Logging**: Record trail name, location, date, duration, distance, difficulty, and personal notes
- **Photo Management**: Upload and store multiple photos per hike with gallery view
- **Collaborative Sharing**: Share hikes with other users via email for multi-user editing
- **Statistics Dashboard**: Track total hikes, miles, hours spent, and shared trails
- **Mobile-First Design**: Responsive interface optimized for iOS and Android browsers
- **Dark Mode**: Full light/dark theme support with localStorage persistence

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: MySQL/MariaDB with Drizzle ORM (MySQL ONLY)
- **Authentication**: Google OAuth2 via Passport.js (Replit Auth for development)
- **Sessions**: MemoryStore (express-mysql-session for production)
- **File Upload**: Multer for image handling

## Database Schema (MySQL)
- **users**: User profiles (id is Google ID - no auto-generation)
- **hikes**: Hike records with details
- **photos**: Image URLs linked to hikes
- **collaborators**: Many-to-many relationship for hike sharing
- **sessions**: Session storage (auto-created by express-mysql-session)

## Project Structure
- `client/`: Frontend React application
  - `src/components/`: Reusable UI components
  - `src/pages/`: Page-level components
  - `src/hooks/`: Custom React hooks including useAuth
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Database operations (MySQL-only)
  - `replitAuth.ts`: Replit Auth for development
  - `googleAuth.ts`: Google OAuth for production
  - `db.ts`: MySQL database connection (MySQL ONLY)
- `shared/`: Shared TypeScript types and schemas (MySQL-only)
- `uploads/`: Photo storage directory

## API Endpoints
- Auth: `/api/login`, `/api/logout`, `/api/auth/user`
- Hikes: `/api/hikes` (GET, POST), `/api/hikes/:id` (GET, PATCH, DELETE)
- Shared: `/api/hikes/shared` (GET)
- Photos: `/api/hikes/:hikeId/photos` (POST)
- Collaborators: `/api/hikes/:hikeId/collaborators` (POST, DELETE)
- Stats: `/api/stats` (GET)

## Recent Changes
- 2025-11-16: **🚀 MySQL-Only Refactoring for Rocky Linux Deployment**
  - **BREAKING**: Removed PostgreSQL support - Application is now MySQL-only
  - Simplified codebase by removing all dual-database conditionals
  - Eliminated 34 TypeScript errors caused by union database types
  - All Drizzle ORM operations now use MySQL-specific syntax
  - Schema uses `mysqlTable` exclusively (no `pgTable`)
  - Fixed `server/db.ts` to validate MySQL connection strings only
  - Updated `server/storage.ts` to remove all `isPostgres` conditionals
  - Application will NOT run on Replit's built-in PostgreSQL database
  
- 2025-11-16: **🚀 Initial Rocky Linux Migration**
  - Converted database schema from PostgreSQL to MySQL/MariaDB
  - Replaced Replit Auth with Google OAuth2 (Passport.js)
  - Changed user ID strategy: Google ID as primary key (no UUIDs)
  - Updated session storage to use MemoryStore (express-mysql-session for production)
  - Created comprehensive deployment guide for Rocky Linux
  
- 2025-10-11: **✅ Initial full-stack implementation**
  - Built complete application with Replit Auth and PostgreSQL
  - All CRUD operations for hikes, photos, and collaborators
  - Photo upload with Multer
  - Collaborative sharing system
  - Comprehensive error handling

## Deployment Notes
- **⚠️ MySQL Required**: This application requires MySQL/MariaDB database
- **Cannot Run on Replit**: Replit's built-in PostgreSQL database is not supported
- **Development Setup**: Requires local MySQL instance or external MySQL database
- **Production Deployment**: Rocky Linux server with MariaDB and Google OAuth
- **Migration Path**: Deploy code to Rocky Linux with MySQL/MariaDB configured
- **Database Setup**: Use `npm run db:push` to sync schema to MySQL database

## User Preferences
- Mobile-first responsive design
- Nature-inspired color palette (green primary, amber accents)
- Clean, scannable layouts for quick data entry
- Touch-friendly interactions with 44px minimum touch targets
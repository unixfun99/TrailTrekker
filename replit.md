# TrailShare - Collaborative Hiking Tracker

## ⚠️ IMPORTANT: Deployment Configuration

**This application is configured for self-hosted deployment on Rocky Linux with MariaDB/MySQL and Google OAuth.**

- **Production Target**: Rocky Linux server with MariaDB
- **Authentication**: Google OAuth (Passport.js)
- **Database**: MySQL/MariaDB configured schema
- **Testing on Replit**: Currently uses Replit Auth for testing only

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
- **Database**: MySQL/MariaDB with Drizzle ORM (PostgreSQL on Replit for testing)
- **Authentication**: Google OAuth2 via Passport.js (Replit Auth for testing)
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
  - `storage.ts`: Database operations
  - `replitAuth.ts`: Replit Auth for testing (temporary)
  - `googleAuth.ts`: Google OAuth for production
  - `db.ts`: Database connection (supports both PostgreSQL and MySQL)
- `shared/`: Shared TypeScript types and schemas (MySQL format)
- `uploads/`: Photo storage directory

## API Endpoints
- Auth: `/api/login`, `/api/logout`, `/api/auth/user`
- Hikes: `/api/hikes` (GET, POST), `/api/hikes/:id` (GET, PATCH, DELETE)
- Shared: `/api/hikes/shared` (GET)
- Photos: `/api/hikes/:hikeId/photos` (POST)
- Collaborators: `/api/hikes/:hikeId/collaborators` (POST, DELETE)
- Stats: `/api/stats` (GET)

## Recent Changes
- 2025-11-16: **🚀 Migrated for Rocky Linux deployment**
  - Converted database schema from PostgreSQL to MySQL/MariaDB
  - Replaced Replit Auth with Google OAuth2 (Passport.js)
  - Changed user ID strategy: Google ID as primary key (no UUIDs)
  - Updated session storage to use MemoryStore (express-mysql-session for production)
  - Created comprehensive deployment guide for Rocky Linux
  - Added dual-database support in db.ts (PostgreSQL for Replit testing, MySQL for production)
  
- 2025-10-11: **✅ Initial full-stack implementation**
  - Built complete application with Replit Auth and PostgreSQL
  - All CRUD operations for hikes, photos, and collaborators
  - Photo upload with Multer
  - Collaborative sharing system
  - Comprehensive error handling

## Deployment Notes
- **Replit Testing**: Uses PostgreSQL and Replit Auth (current environment)
- **Production**: Requires MySQL/MariaDB and Google OAuth credentials
- **Migration Path**: Download code from Replit → Deploy to Rocky Linux
- **No Data Migration**: Start fresh on production (separate databases)

## User Preferences
- Mobile-first responsive design
- Nature-inspired color palette (green primary, amber accents)
- Clean, scannable layouts for quick data entry
- Touch-friendly interactions with 44px minimum touch targets
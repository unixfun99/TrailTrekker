# TrailShare - Collaborative Hiking Tracker

## Overview
TrailShare is a mobile-optimized web application for tracking and sharing hiking adventures. Users can log hikes with locations, photos, difficulty ratings, and collaborate with others on shared trails.

## Features
- **User Authentication**: Replit Auth integration supporting Google, GitHub, X, Apple, and email/password login
- **Hike Logging**: Record trail name, location, date, duration, distance, difficulty, and personal notes
- **Photo Management**: Upload and store multiple photos per hike with gallery view
- **Collaborative Sharing**: Share hikes with other users via email for multi-user editing
- **Statistics Dashboard**: Track total hikes, miles, hours spent, and shared trails
- **Mobile-First Design**: Responsive interface optimized for iOS and Android browsers
- **Dark Mode**: Full light/dark theme support with localStorage persistence

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **File Upload**: Multer for image handling

## Database Schema
- **users**: User profiles from Replit Auth
- **hikes**: Hike records with details
- **photos**: Image URLs linked to hikes
- **collaborators**: Many-to-many relationship for hike sharing
- **sessions**: Session management for auth

## Project Structure
- `client/`: Frontend React application
  - `src/components/`: Reusable UI components
  - `src/pages/`: Page-level components
  - `src/hooks/`: Custom React hooks including useAuth
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Database operations
  - `replitAuth.ts`: Authentication setup
- `shared/`: Shared TypeScript types and schemas
- `uploads/`: Photo storage directory

## API Endpoints
- Auth: `/api/login`, `/api/logout`, `/api/auth/user`
- Hikes: `/api/hikes` (GET, POST), `/api/hikes/:id` (GET, PATCH, DELETE)
- Shared: `/api/hikes/shared` (GET)
- Photos: `/api/hikes/:hikeId/photos` (POST)
- Collaborators: `/api/hikes/:hikeId/collaborators` (POST, DELETE)
- Stats: `/api/stats` (GET)

## Recent Changes
- 2024-10-11: Initial MVP implementation with auth, CRUD operations, and collaborative features
- Integrated Replit Auth for user management
- Added photo upload functionality
- Implemented hike sharing system

## User Preferences
- Mobile-first responsive design
- Nature-inspired color palette (green primary, amber accents)
- Clean, scannable layouts for quick data entry
- Touch-friendly interactions with 44px minimum touch targets
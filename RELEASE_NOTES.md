# TrailShare Release Notes

## Version 2.0.0 - Rocky Linux Production Release
**Release Date**: November 16, 2025

### 🚀 Major Changes: Production-Ready Deployment

This release transforms TrailShare from a Replit-hosted application to a self-hosted production application ready for deployment on Rocky Linux servers.

---

## What's New

### 🗄️ Database Migration: PostgreSQL → MySQL/MariaDB

**Why**: Rocky Linux environments typically use MariaDB/MySQL for better compatibility and performance in self-hosted scenarios.

**Changes**:
- Complete schema conversion to MySQL syntax
- All Drizzle ORM definitions updated to `mysqlTable`
- Data types migrated (uuid → varchar, timestamp with time zone → timestamp)
- Dual-database support: PostgreSQL for Replit testing, MySQL for production

**Impact**: Fresh database required - no data migration from Replit

### 🔐 Authentication Migration: Replit Auth → Google OAuth

**Why**: Self-hosted deployments need independent authentication that doesn't rely on Replit infrastructure.

**Changes**:
- Implemented Passport.js with Google OAuth2 Strategy
- User ID strategy: Google ID as primary key (no UUID generation)
- Session management with express-mysql-session for production
- Replit Auth retained for testing on Replit only

**Impact**: Requires Google Cloud Console OAuth credentials for production

### 📦 Session Storage Update

**Changes**:
- **Replit/Testing**: MemoryStore (lightweight, no persistence needed)
- **Production**: express-mysql-session with MySQL backend
- Auto-created `sessions` table in database

---

## New Files

### Deployment Documentation
- **DEPLOYMENT_ROCKY_LINUX.md** - Complete deployment guide including:
  - MariaDB installation and configuration
  - Google OAuth setup instructions
  - Environment variable configuration
  - PM2 process manager setup
  - Nginx reverse proxy configuration
  - SSL/TLS setup with Let's Encrypt

- **README_DEPLOYMENT.md** - Quick start guide with:
  - Migration overview
  - Download instructions from Replit
  - Architecture diagram
  - Deployment checklist

### Authentication Files
- **server/googleAuth.ts** - Google OAuth implementation (production)
- **server/replitAuth.ts** - Replit Auth fallback (testing only)

---

## Modified Files

### Core Infrastructure
- **server/db.ts** - Dual-database support (PostgreSQL + MySQL)
- **server/index.ts** - Session store configuration for both environments
- **shared/schema.ts** - Complete MySQL schema with Google ID as primary key

### Configuration
- **replit.md** - Updated with deployment notes and configuration details

---

## Breaking Changes

⚠️ **This version is NOT backward compatible with Replit deployments**

1. **Database**: Requires MySQL/MariaDB (PostgreSQL only for Replit testing)
2. **Authentication**: Requires Google OAuth credentials for production
3. **User IDs**: Changed from auto-generated UUIDs to Google IDs
4. **No Data Migration**: Fresh database installation required

---

## Deployment Options

### Option 1: Production Deployment (Rocky Linux)

**Requirements**:
- Rocky Linux 8+ server
- MariaDB 10.5+ or MySQL 8.0+
- Node.js 20+
- Google Cloud Console OAuth credentials
- Domain with SSL/TLS certificate

**Steps**:
1. Download/clone this repository
2. Follow **DEPLOYMENT_ROCKY_LINUX.md** guide
3. Configure Google OAuth credentials
4. Set up environment variables
5. Run `npm run db:push` to create database tables
6. Build and deploy with PM2

### Option 2: Testing on Replit

**Requirements**:
- Replit account (automatic PostgreSQL database)
- No additional configuration needed

**Steps**:
1. Fork/import to Replit
2. Click "Run" - app uses Replit Auth automatically
3. Test features before production deployment

---

## Environment Variables

### Production (Rocky Linux)
```bash
DATABASE_URL=mysql://user:password@localhost:3306/trailshare
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
SESSION_SECRET=generate-random-secret
NODE_ENV=production
```

### Testing (Replit)
```bash
DATABASE_URL=postgresql://... (auto-configured)
SESSION_SECRET=any-secret-for-testing
NODE_ENV=development
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,  -- Google ID (no auto-generation)
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Other Tables
- **hikes** - Hike records with foreign key to users.id
- **photos** - Photo URLs linked to hikes
- **collaborators** - Many-to-many sharing relationships
- **sessions** - Session storage (auto-created)

---

## Migration Guide

### From Version 1.x (Replit) to 2.0 (Rocky Linux)

1. **Download Code**: Export from Replit or clone from GitHub
2. **Set Up Server**: Install Rocky Linux dependencies (MariaDB, Node.js, Nginx)
3. **Configure Google OAuth**: Create project in Google Cloud Console
4. **Update Auth Import**: Change `server/routes.ts` to use `googleAuth.ts`
5. **Environment Setup**: Configure production environment variables
6. **Database Creation**: Run `npm run db:push` to create tables
7. **Build & Deploy**: Run `npm run build` and start with PM2

**Data Migration**: Not supported - start with fresh database

---

## Security Considerations

### Production Requirements
- ✅ HTTPS/SSL required (Google OAuth mandate)
- ✅ Strong SESSION_SECRET (32+ random characters)
- ✅ Database access restricted to localhost
- ✅ File upload directory permissions (755)
- ✅ Environment variables secured (not in code)

### Recommendations
- Use Let's Encrypt for SSL certificates
- Rotate SESSION_SECRET periodically
- Regular database backups
- Consider external storage (S3, Cloudflare R2) for photos

---

## Testing

### On Replit (Pre-Deployment)
1. Import to Replit
2. Click "Run"
3. Create test hikes with photos
4. Test collaborative sharing
5. Verify all features work

### On Rocky Linux (Post-Deployment)
1. Set up staging environment first
2. Configure Google OAuth with staging URL
3. Test complete authentication flow
4. Create test data and verify database
5. Test photo uploads and collaborator features
6. Performance test with multiple users

---

## Known Issues

1. **TypeScript Warning**: Minor LSP diagnostic in `server/routes.ts` line 251 (does not affect functionality)
2. **Image Storage**: Currently uses local filesystem - consider external storage for production scale
3. **Session Persistence**: MemoryStore on Replit doesn't persist across restarts (intended for testing)

---

## Support & Documentation

- **Deployment Guide**: See `DEPLOYMENT_ROCKY_LINUX.md`
- **Quick Start**: See `README_DEPLOYMENT.md`
- **Project Overview**: See `replit.md`

---

## Credits

**Original Implementation**: Full-stack application with Replit Auth and PostgreSQL  
**Migration**: Rocky Linux production deployment with MySQL and Google OAuth  
**Stack**: React, TypeScript, Express.js, Tailwind CSS, Drizzle ORM, Passport.js

---

## Next Steps

1. ✅ Download this release from GitHub
2. ✅ Review `DEPLOYMENT_ROCKY_LINUX.md` thoroughly
3. ✅ Set up Rocky Linux server with MariaDB
4. ✅ Create Google OAuth credentials
5. ✅ Follow deployment guide step-by-step
6. ✅ Test on staging before production
7. ✅ Deploy to production with SSL/TLS

---

**Version**: 2.0.0  
**Release Date**: November 16, 2025  
**Status**: Production Ready  
**Target Platform**: Rocky Linux + MariaDB + Google OAuth

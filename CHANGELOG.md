# Changelog

All notable changes to TrailShare will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-16

### 🚀 Rocky Linux Production Release

This major version transforms TrailShare into a production-ready self-hosted application.

### Added
- Google OAuth2 authentication with Passport.js for production deployments
- MySQL/MariaDB database support with Drizzle ORM
- Comprehensive deployment guide for Rocky Linux (`DEPLOYMENT_ROCKY_LINUX.md`)
- Quick deployment reference (`README_DEPLOYMENT.md`)
- Dual-database support (PostgreSQL for Replit testing, MySQL for production)
- express-mysql-session for persistent session storage in production
- Server configuration files for PM2 and Nginx
- Google ID as primary key strategy (no UUID generation)

### Changed
- **BREAKING**: Database schema migrated from PostgreSQL to MySQL/MariaDB syntax
- **BREAKING**: User authentication changed from Replit Auth to Google OAuth for production
- **BREAKING**: User ID strategy changed from auto-generated UUIDs to Google IDs
- Session storage updated to use MemoryStore for Replit, MySQL sessions for production
- Updated all database operations to work with both PostgreSQL and MySQL
- Modified auth middleware to support both Replit Auth (testing) and Google OAuth (production)

### Fixed
- ES module compatibility issues with session store
- Database connection handling for both development and production environments
- Session persistence configuration for production deployments

### Deployment Notes
- Production deployments require Google Cloud Console OAuth credentials
- Fresh database installation required (no migration path from v1.x)
- Replit testing environment continues to work with PostgreSQL and Replit Auth
- See `DEPLOYMENT_ROCKY_LINUX.md` for complete deployment instructions

### Security
- Added HTTPS/SSL requirement for Google OAuth
- Implemented secure session management with configurable secrets
- Added environment variable validation for production deployments

---

## [1.0.0] - 2025-10-11

### Initial Release

### Added
- User authentication with Replit Auth (OpenID Connect)
- Hike tracking with location, date, duration, distance, difficulty
- Photo upload and management with Multer
- Collaborative sharing system (share hikes via email)
- Statistics dashboard (total hikes, miles, hours, shared trails)
- Mobile-first responsive design
- Dark mode support with localStorage persistence
- PostgreSQL database with Drizzle ORM
- Complete CRUD operations for hikes, photos, and collaborators
- REST API with authentication middleware
- Nature-inspired UI with Tailwind CSS and Shadcn components

### Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Express.js, Node.js
- Database: PostgreSQL (Neon)
- Authentication: Replit Auth
- File Upload: Multer

---

## Version Comparison

### v1.0.0 (Replit-hosted)
- ✅ PostgreSQL database
- ✅ Replit Auth
- ✅ Auto-generated UUIDs
- ✅ Designed for Replit platform

### v2.0.0 (Self-hosted)
- ✅ MySQL/MariaDB database
- ✅ Google OAuth
- ✅ Google IDs as primary keys
- ✅ Designed for Rocky Linux production
- ✅ Backward compatible with Replit for testing

---

[2.0.0]: https://github.com/unixfun99/TrailTrekker/releases/tag/v2.0.0
[1.0.0]: https://github.com/unixfun99/TrailTrekker/releases/tag/v1.0.0

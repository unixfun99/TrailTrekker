# TrailShare - Rocky Linux Deployment Summary

## Migration Complete ✅

Your TrailShare application has been successfully migrated from Replit's platform to a self-hosted architecture ready for deployment on Rocky Linux with MariaDB.

## What Changed

### Database Migration: PostgreSQL → MySQL/MariaDB
- **Schema Updated**: All Drizzle schema definitions converted to MySQL syntax
- **Data Types**: Changed PostgreSQL-specific types (uuid, timestamp with time zone) to MySQL equivalents (varchar, timestamp)
- **Connection**: Using `mysql2/promise` for Drizzle ORM compatibility
- **Fresh Start**: This is a new database - no data migration from Replit

### Authentication: Replit Auth → Google OAuth
- **Provider**: Passport.js with Google OAuth2 Strategy
- **User IDs**: Google ID used directly as primary key (varchar 255)
- **Session Storage**: express-mysql-session with MySQL backend
- **Required**: Google Cloud Console OAuth credentials (Client ID + Secret)

### Architecture Changes
- **Sessions**: Stored in MySQL `sessions` table (auto-created)
- **User Model**: Simplified to Google profile fields (id, email, firstName, lastName, profileImageUrl)
- **No UUID Generation**: Google IDs are used as primary keys throughout
- **Separate Pools**: Drizzle uses promise-based pool, session store creates its own callback pool

## Download Your Code from Replit

### Option 1: Download ZIP (Easiest)
1. Click the **three-dot menu** (⋮) in the top-right of Replit
2. Select **Download as ZIP**
3. Extract the ZIP on your local machine or server

### Option 2: Git Clone (Recommended)
```bash
# Install Git on Rocky Linux if needed
sudo dnf install git -y

# Clone your Replit repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPL_NAME.git
# OR use the Replit Git URL provided in your Repl's "Version Control" tab
```

### Option 3: Manual SCP/FTP
Use SCP to transfer files to your Rocky Linux server:
```bash
# From your local machine
scp -r /path/to/trailshare user@your-server-ip:/var/www/trailshare
```

## Deployment Steps

Follow the comprehensive guide in **DEPLOYMENT_ROCKY_LINUX.md** which includes:

1. **Prerequisites**
   - MariaDB 10.5+ installation
   - Node.js 20+ setup
   - Nginx/Apache configuration
   - PM2 process manager

2. **Google OAuth Setup**
   - Create project in Google Cloud Console
   - Configure OAuth consent screen
   - Generate Client ID and Secret
   - Set callback URL: `https://yourdomain.com/api/auth/google/callback`

3. **Environment Configuration**
   ```bash
   DATABASE_URL=mysql://user:password@localhost:3306/trailshare
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   SESSION_SECRET=generate-random-secret
   NODE_ENV=production
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Build and Start**
   ```bash
   npm run build
   pm2 start ecosystem.config.js
   ```

## Important Notes

### ⚠️ This Code Won't Run on Replit Anymore
The application has been reconfigured for self-hosted deployment:
- MySQL/MariaDB instead of Replit's PostgreSQL
- Google OAuth instead of Replit Auth
- Designed for Rocky Linux production environment

### 🔒 Security Considerations
- **SSL/TLS Required**: Google OAuth requires HTTPS in production
- **Session Secret**: Generate a strong random secret (see deployment guide)
- **Database Security**: Use strong passwords and restrict access to localhost
- **File Uploads**: `uploads/` directory needs proper permissions (755)

### 📸 Photo Storage
- Photos stored in `uploads/` directory on server
- Make sure this directory persists across deployments
- Consider using external storage (S3, Cloudflare R2) for production

### 🔄 Migration Path (Future)
If you want to migrate data from Replit later:
1. Export data from Replit's PostgreSQL using `pg_dump`
2. Transform the data to match new schema (Google IDs as primary keys)
3. Import into MariaDB
*This is complex - start fresh for now is recommended*

## Testing Before Going Live

1. **Local Testing on Rocky Linux**:
   - Set up MariaDB locally
   - Configure Google OAuth with `http://localhost:5000` callback
   - Test full authentication and hike creation flow

2. **Staging Environment**:
   - Deploy to staging subdomain first
   - Update Google OAuth callback to staging URL
   - Invite test users to validate all features

3. **Production Deployment**:
   - Update DNS to point to your server
   - Configure production Google OAuth callback
   - Set `NODE_ENV=production` in environment
   - Enable HTTPS with Let's Encrypt

## Support Resources

- **Deployment Guide**: See `DEPLOYMENT_ROCKY_LINUX.md` for detailed instructions
- **Google OAuth Setup**: See section in deployment guide
- **Database Schema**: Check `shared/schema.ts` for table definitions
- **Troubleshooting**: Common issues documented in deployment guide

## Quick Start Checklist

- [ ] Download code from Replit
- [ ] Install MariaDB on Rocky Linux
- [ ] Create Google Cloud Console project
- [ ] Configure OAuth consent screen and credentials
- [ ] Set up environment variables
- [ ] Install Node.js dependencies (`npm install`)
- [ ] Push database schema (`npm run db:push`)
- [ ] Build frontend (`npm run build`)
- [ ] Start application with PM2
- [ ] Configure Nginx reverse proxy
- [ ] Set up SSL with Let's Encrypt
- [ ] Test authentication flow
- [ ] Create first hike to verify functionality

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Rocky Linux Server                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐        ┌──────────────┐               │
│  │    Nginx     │───────▶│  Node.js     │               │
│  │ Reverse Proxy│        │  Express.js  │               │
│  │  (Port 80/   │        │  (Port 5000) │               │
│  │   443)       │        │              │               │
│  └──────────────┘        └──────┬───────┘               │
│                                  │                        │
│                         ┌────────▼──────────┐            │
│                         │   MariaDB         │            │
│                         │   (Port 3306)     │            │
│                         │                   │            │
│                         │  • users          │            │
│                         │  • hikes          │            │
│                         │  • photos         │            │
│                         │  • collaborators  │            │
│                         │  • sessions       │            │
│                         └───────────────────┘            │
│                                                           │
│  ┌──────────────────────────────────────────┐            │
│  │         File System                       │            │
│  │  /var/www/trailshare/uploads/            │            │
│  │  (Photo storage)                          │            │
│  └──────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
                           │
                           │ OAuth Flow
                           ▼
                  ┌────────────────┐
                  │ Google Cloud   │
                  │ OAuth Provider │
                  └────────────────┘
```

## Next Steps

1. **Review**: Read through `DEPLOYMENT_ROCKY_LINUX.md` completely
2. **Prepare**: Set up Rocky Linux server and install dependencies
3. **Configure**: Create Google OAuth credentials
4. **Deploy**: Follow the deployment guide step-by-step
5. **Test**: Verify all features work before announcing to users

---

**Need Help?** Refer to the detailed deployment guide or Google OAuth documentation linked in `DEPLOYMENT_ROCKY_LINUX.md`.

# 🥾 TrailShare - Collaborative Hiking Tracker

A mobile-optimized web application for tracking and sharing hiking adventures. Log your trails with photos, share with friends, and collaborate on group hikes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/database-MySQL%20%7C%20MariaDB-blue)](https://mariadb.org/)

![TrailShare Banner](https://via.placeholder.com/800x200/22c55e/ffffff?text=TrailShare+-+Track+Your+Adventures)

---

## 🌟 Features

- **🔐 Google OAuth Authentication** - Secure login with your Google account
- **📍 Hike Tracking** - Record trail name, location, date, duration, distance, and difficulty
- **📸 Photo Management** - Upload and organize multiple photos per hike
- **🤝 Collaborative Sharing** - Share hikes with other users for multi-person editing
- **📊 Statistics Dashboard** - Track total hikes, miles, hours spent, and shared trails
- **📱 Mobile-First Design** - Optimized for iOS and Android browsers
- **🌓 Dark Mode** - Full light/dark theme support with persistence

---

## 🚀 Quick Start

### For Production Deployment (Rocky Linux)

**Requirements:**
- Rocky Linux 8+ server
- MariaDB 10.5+ or MySQL 8.0+
- Node.js 20+
- Domain with SSL/TLS certificate
- Google Cloud Console OAuth credentials

**Deployment Steps:**
```bash
# 1. Clone the repository
git clone https://github.com/unixfun99/TrailTrekker.git
cd TrailTrekker

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env
nano .env

# 4. Create database tables
npm run db:push

# 5. Build the application
npm run build

# 6. Start with PM2
pm2 start ecosystem.config.js
```

📖 **Full deployment guide:** See [DEPLOYMENT_ROCKY_LINUX.md](./DEPLOYMENT_ROCKY_LINUX.md)

### For Testing on Replit

**One-Click Deploy:**
1. Fork this repository to Replit
2. Click "Run"
3. App uses Replit Auth automatically (no configuration needed)

---

## 🔧 Environment Variables

### Production (Rocky Linux)
```bash
DATABASE_URL=mysql://user:password@localhost:3306/trailshare
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
SESSION_SECRET=generate-random-secret-32-characters
NODE_ENV=production
```

### Testing (Replit)
```bash
DATABASE_URL=postgresql://... (auto-configured by Replit)
SESSION_SECRET=any-secret-for-testing
NODE_ENV=development
```

**Generate a secure SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** TanStack Query (React Query)
- **Routing:** Wouter
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MySQL/MariaDB with Drizzle ORM
- **Authentication:** Passport.js + Google OAuth2
- **Session Store:** express-mysql-session
- **File Upload:** Multer

---

## 📁 Project Structure

```
TrailTrekker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   ├── googleAuth.ts     # Google OAuth (production)
│   ├── replitAuth.ts     # Replit Auth (testing)
│   └── db.ts             # Database connection
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Drizzle database schema
├── uploads/              # Photo storage directory
└── DEPLOYMENT_ROCKY_LINUX.md  # Deployment guide
```

---

## 🗄️ Database Schema

### Users
- Google ID as primary key
- Email, name, profile image
- Timestamps

### Hikes
- UUID primary key
- Foreign key to users
- Trail details (location, date, duration, distance, difficulty)
- Personal notes

### Photos
- UUID primary key
- Foreign key to hikes
- Image URL/path

### Collaborators
- Many-to-many relationship between users and hikes
- Enables shared editing

---

## 🔐 Google OAuth Setup

1. **Create Project** in [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Google+ API**
3. **Create OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback`
4. **Copy Client ID and Secret** to environment variables

📖 **Detailed instructions:** See [DEPLOYMENT_ROCKY_LINUX.md](./DEPLOYMENT_ROCKY_LINUX.md#step-2-google-oauth-setup)

---

## 🌐 API Endpoints

### Authentication
- `GET /api/login` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/logout` - Sign out
- `GET /api/auth/user` - Get current user

### Hikes
- `GET /api/hikes` - List user's hikes
- `POST /api/hikes` - Create new hike
- `GET /api/hikes/:id` - Get hike details
- `PATCH /api/hikes/:id` - Update hike
- `DELETE /api/hikes/:id` - Delete hike
- `GET /api/hikes/shared` - List shared hikes

### Photos
- `POST /api/hikes/:hikeId/photos` - Upload photo

### Collaborators
- `POST /api/hikes/:hikeId/collaborators` - Add collaborator
- `DELETE /api/hikes/:hikeId/collaborators/:userId` - Remove collaborator

### Statistics
- `GET /api/stats` - User statistics

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Push database schema changes
npm run db:push
```

---

## 📦 Deployment Modes

### Production (Rocky Linux)
- MySQL/MariaDB database
- Google OAuth authentication
- PM2 process management
- Nginx reverse proxy
- SSL/TLS with Let's Encrypt

### Testing (Replit)
- PostgreSQL database
- Replit Auth (automatic)
- No configuration needed
- Great for feature testing

---

## 📝 Documentation

- **[DEPLOYMENT_ROCKY_LINUX.md](./DEPLOYMENT_ROCKY_LINUX.md)** - Complete deployment guide
- **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)** - Quick deployment reference
- **[RELEASE_NOTES.md](./RELEASE_NOTES.md)** - Version 2.0.0 release notes
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[replit.md](./replit.md)** - Project overview and architecture

---

## 🔄 Migration from v1.x

Version 2.0.0 is a major rewrite for production deployment:

**Key Changes:**
- Database: PostgreSQL → MySQL/MariaDB
- Auth: Replit Auth → Google OAuth
- User IDs: UUIDs → Google IDs
- Target: Replit Platform → Self-hosted Rocky Linux

**⚠️ No automatic migration path** - Fresh database installation required

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com/) for rapid prototyping
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Support

For deployment questions or issues:
- Check the [DEPLOYMENT_ROCKY_LINUX.md](./DEPLOYMENT_ROCKY_LINUX.md) guide
- Review [RELEASE_NOTES.md](./RELEASE_NOTES.md) for known issues
- Open an issue on GitHub

---

**Version:** 2.0.0  
**Status:** Production Ready  
**Target Platform:** Rocky Linux + MariaDB + Google OAuth

Made with ❤️ for hikers and outdoor enthusiasts

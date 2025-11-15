# TrailShare Deployment Guide for Rocky Linux with MariaDB & Google OAuth

This guide will walk you through deploying TrailShare on your Rocky Linux server using MariaDB and Google Authentication.

---

## Prerequisites

- Rocky Linux 8 or 9 server
- Root or sudo access
- Domain name (optional, but recommended for production)
- 2GB+ RAM recommended

---

## Part 1: Set Up Google OAuth Credentials

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "TrailShare" → Click "Create"
4. Wait for the project to be created

### Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type → Click **Create**
3. Fill in the required fields:
   - **App name**: TrailShare
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. Skip **Scopes** (click Save and Continue)
6. Skip **Test users** (click Save and Continue)
7. Click **Back to Dashboard**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: Web application
4. **Name**: TrailShare Web App
5. **Authorized JavaScript origins**:
   - `http://localhost:5000` (for local testing)
   - `https://your-domain.com` (for production)
6. **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (for local testing)
   - `https://your-domain.com/api/auth/google/callback` (for production)
7. Click **Create**
8. **IMPORTANT**: Copy your **Client ID** and **Client Secret** - you'll need these later!

---

## Part 2: Install Server Dependencies

### Step 1: Update System

```bash
# Update all packages
sudo dnf update -y

# Install essential tools
sudo dnf install -y curl wget git vim firewalld nginx
```

### Step 2: Install Node.js 20

```bash
# Add NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Install Node.js and npm
sudo dnf install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

### Step 3: Install MariaDB

```bash
# Add MariaDB repository (MariaDB 10.11 LTS)
sudo tee /etc/yum.repos.d/MariaDB.repo <<EOF
[mariadb]
name = MariaDB
baseurl = https://rpm.mariadb.org/10.11/rhel/9/x86_64/
gpgkey = https://rpm.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck = 1
EOF

# Install MariaDB
sudo dnf install -y MariaDB-server MariaDB-client

# Start and enable MariaDB
sudo systemctl enable mariadb
sudo systemctl start mariadb

# Secure MariaDB installation
sudo mariadb-secure-installation
```

When running `mariadb-secure-installation`:
- Set root password: **YES** (choose a strong password)
- Remove anonymous users: **YES**
- Disallow root login remotely: **YES**
- Remove test database: **YES**
- Reload privilege tables: **YES**

---

## Part 3: Configure MariaDB

### Create Database and User

```bash
# Login to MariaDB as root
sudo mariadb -u root -p
```

Execute these SQL commands:

```sql
-- Create database
CREATE DATABASE trailshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'trailshare'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON trailshare.* TO 'trailshare'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify database
SHOW DATABASES;

-- Exit
EXIT;
```

### Test Database Connection

```bash
# Test connection
mariadb -u trailshare -p trailshare
# Enter password when prompted
# If successful, you'll see: MariaDB [trailshare]>
# Type EXIT; to exit
```

---

## Part 4: Deploy Application

### Step 1: Download Application Code

If downloading from Replit:

```bash
# Create application directory
sudo mkdir -p /var/www/trailshare
sudo chown $USER:$USER /var/www/trailshare
cd /var/www/trailshare

# Download the code from Replit as a zip and extract here
# Or use git if you have it in a repository:
# git clone <your-repo-url> .
```

### Step 2: Install Application Dependencies

```bash
cd /var/www/trailshare

# Install all dependencies
npm install

# Install PM2 globally (process manager)
sudo npm install -g pm2
```

### Step 3: Configure Environment Variables

Create a `.env` file in the application root:

```bash
nano .env
```

Add the following configuration (replace values with your actual credentials):

```env
# Node Environment
NODE_ENV=production
PORT=5000

# Database Configuration (MariaDB)
DATABASE_URL=mysql://trailshare:your_secure_password_here@localhost:3306/trailshare

# Session Secret (generate a long random string)
SESSION_SECRET=change_this_to_a_long_random_string_min_32_characters

# Google OAuth Credentials (from Part 1)
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

# For local testing, use:
# GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Generate a secure SESSION_SECRET**:

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Create Database Tables

**IMPORTANT**: This application has been migrated from PostgreSQL to MySQL/MariaDB. If you're deploying from Replit code, you're starting fresh with a new database.

```bash
# Push schema to database (creates all tables)
npm run db:push

# If that doesn't work, use:
npm run db:push -- --force
```

This will create all necessary tables:
- `users` - User accounts from Google (id is the Google ID)
- `hikes` - Hike records
- `photos` - Photo attachments
- `collaborators` - Shared hike permissions
- `sessions` - Session storage (auto-created by express-mysql-session)

### Step 5: Build Frontend

```bash
# Build the React frontend
npm run build
```

---

## Part 5: Run the Application

### Option A: Development Mode (for testing)

```bash
# Run directly
npm run dev

# Access at: http://your-server-ip:5000
```

### Option B: Production Mode with PM2

```bash
# Start with PM2
pm2 start npm --name "trailshare" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Run the command that PM2 outputs

# Useful PM2 commands
pm2 status           # Check status
pm2 logs trailshare  # View logs
pm2 restart trailshare  # Restart app
pm2 stop trailshare     # Stop app
```

---

## Part 6: Configure Nginx Reverse Proxy (Recommended)

### Step 1: Install and Configure Nginx

```bash
# Install Nginx (if not already installed)
sudo dnf install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/conf.d/trailshare.conf
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Client upload size limit (for photos)
    client_max_body_size 10M;

    # Proxy all requests to Node.js app
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 2: Enable Nginx

```bash
# Test Nginx configuration
sudo nginx -t

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 3: Configure Firewall

```bash
# Enable firewall
sudo systemctl enable --now firewalld

# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Reload firewall
sudo firewall-cmd --reload
```

### Step 4: Configure SELinux

```bash
# Allow Nginx to make network connections
sudo setsebool -P httpd_can_network_connect 1

# Allow Nginx to serve files from app directory
sudo chcon -R -t httpd_sys_content_t /var/www/trailshare/client/dist
sudo chcon -R -t httpd_sys_content_t /var/www/trailshare/uploads
```

---

## Part 7: SSL Certificate with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo dnf install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically:
- Obtain an SSL certificate
- Update your Nginx configuration to use HTTPS
- Set up automatic renewal

After SSL is configured, update your `.env` file:

```env
# Change callback URL to HTTPS
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
```

And restart the application:

```bash
pm2 restart trailshare
```

---

## Testing the Application

### 1. Access the Application

Open your browser and go to:
- Development: `http://your-server-ip:5000`
- Production: `https://your-domain.com`

### 2. Test Google Login

1. Click the login button
2. You should be redirected to Google
3. Sign in with your Google account
4. Grant permissions
5. You should be redirected back to the app, logged in

### 3. Test Features

- **Create a hike**: Navigate to /add and create a test hike
- **Upload photos**: Add photos to your hike
- **Share a hike**: Try sharing with another Google account
- **View profile**: Check your profile and statistics

---

## Maintenance & Updates

### Update the Application

```bash
cd /var/www/trailshare

# Pull latest changes (if using Git)
git pull

# Install any new dependencies
npm install

# Rebuild frontend
npm run build

# Update database schema if needed
npm run db:push

# Restart the application
pm2 restart trailshare

# Reload Nginx
sudo systemctl reload nginx
```

### Database Backup

```bash
# Create backup
sudo mariadb-dump -u root -p trailshare > backup_$(date +%Y%m%d).sql

# Restore backup
sudo mariadb -u root -p trailshare < backup_20241115.sql
```

### View Logs

```bash
# Application logs
pm2 logs trailshare

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MariaDB logs
sudo tail -f /var/log/mariadb/mariadb.log
```

---

## Troubleshooting

### Database Connection Errors

```bash
# Check MariaDB is running
sudo systemctl status mariadb

# Test connection
mariadb -u trailshare -p trailshare

# Check database URL in .env file
```

### Google OAuth Errors

1. Verify Google Cloud Console settings:
   - OAuth consent screen is configured
   - Credentials have correct redirect URLs
   - Client ID and Secret match .env file

2. Check callback URL:
   - Must match exactly in Google Console and .env
   - Use HTTP for localhost testing
   - Use HTTPS for production domain

### Application Not Starting

```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs trailshare --err

# Check if port 5000 is in use
sudo lsof -i :5000

# Restart application
pm2 restart trailshare
```

### Nginx 502 Bad Gateway

```bash
# Check if app is running
pm2 status

# Check SELinux
sudo ausearch -m avc -ts recent

# Check logs
pm2 logs trailshare
sudo tail -f /var/log/nginx/error.log
```

---

## Security Checklist

- ✅ Use strong database passwords
- ✅ Set secure SESSION_SECRET
- ✅ Enable HTTPS with Let's Encrypt
- ✅ Configure firewall (ports 80, 443, 22 only)
- ✅ Keep SELinux enabled
- ✅ Regular system updates: `sudo dnf update`
- ✅ Regular database backups
- ✅ Use environment variables for secrets (never commit .env)

---

## Support

If you encounter issues:

1. Check the logs (PM2, Nginx, MariaDB)
2. Verify all environment variables are set correctly
3. Ensure firewall and SELinux are configured properly
4. Test database connection separately
5. Verify Google OAuth credentials and redirect URLs

---

**Your TrailShare application is now deployed on Rocky Linux with MariaDB and Google OAuth!**

Access your app at: `https://your-domain.com`

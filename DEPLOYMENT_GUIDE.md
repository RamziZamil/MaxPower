# MaxPower Deployment Guide - Ubuntu VPS (Hostinger)

This guide will help you deploy the MaxPower application on an Ubuntu VPS hosted on Hostinger.

## Prerequisites

- Ubuntu VPS with root/sudo access
- Domain name pointed to your VPS IP
- SSH access to your server

## Step 1: Server Setup

### 1.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (v18 or v20)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### 1.3 Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 1.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.5 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.6 Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Prepare Application Files

### 2.1 Clone or Upload Your Project

```bash
# Option 1: If using Git
cd /var/www
sudo git clone <your-repo-url> maxpower
sudo chown -R $USER:$USER /var/www/maxpower

# Option 2: Upload via SCP from your local machine
# scp -r MaxPower user@your-server-ip:/var/www/
```

### 2.2 Install Dependencies

**Backend:**

```bash
cd /var/www/maxpower/Backend
npm install --production
```

**Frontend:**

```bash
cd /var/www/maxpower/frontend
npm install
npm run build
```

## Step 3: Configure Backend

### 3.1 Create Environment File

```bash
cd /var/www/maxpower/Backend
nano .env
```

Add your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maxpower
JWT_SECRET=your-super-secret-jwt-key-change-this
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### 3.2 Update Backend Server Configuration

Check your `Backend/server.js` and ensure it's configured to listen on the correct port and handle CORS properly.

## Step 4: Configure Frontend

### 4.1 Update API URLs

Before building, update your frontend API calls to use your domain instead of `localhost:5000`.

Create or update `frontend/.env.production`:

```env
VITE_API_URL=https://yourdomain.com/api
```

Then update your axios calls in the frontend to use:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "https://yourdomain.com/api";
```

### 4.2 Build Frontend

```bash
cd /var/www/maxpower/frontend
npm run build
```

This creates a `dist` folder with production-ready files.

## Step 5: Start Backend with PM2

```bash
cd /var/www/maxpower/Backend
pm2 start server.js --name maxpower-backend
pm2 save
pm2 startup
```

## Step 6: Configure Nginx

### 6.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/maxpower
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/maxpower/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        root /var/www/maxpower/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/maxpower /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically update your Nginx configuration.

## Step 8: Firewall Configuration

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Step 9: MongoDB Security (Important!)

### 9.1 Enable MongoDB Authentication

```bash
sudo nano /etc/mongod.conf
```

Uncomment and configure:

```yaml
security:
  authorization: enabled
```

### 9.2 Create Admin User

```bash
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
exit
```

### 9.3 Update MongoDB URI in .env

```env
MONGODB_URI=mongodb://admin:your-secure-password@localhost:27017/maxpower?authSource=admin
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

## Step 10: PM2 Monitoring

```bash
# View logs
pm2 logs maxpower-backend

# Monitor
pm2 monit

# Restart
pm2 restart maxpower-backend

# Stop
pm2 stop maxpower-backend
```

## Step 11: Update DNS Records

In your Hostinger DNS settings, add:

- A Record: `@` → Your VPS IP
- A Record: `www` → Your VPS IP

## Troubleshooting

### Check Nginx Logs

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check PM2 Logs

```bash
pm2 logs maxpower-backend
```

### Check MongoDB Status

```bash
sudo systemctl status mongod
mongosh
```

### Restart Services

```bash
sudo systemctl restart nginx
pm2 restart maxpower-backend
sudo systemctl restart mongod
```

## Maintenance Commands

### Update Application

```bash
cd /var/www/maxpower
git pull  # or upload new files
cd Backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart maxpower-backend
sudo systemctl reload nginx
```

### Backup MongoDB

```bash
mongodump --out /var/backups/mongodb/$(date +%Y%m%d)
```

### View Running Processes

```bash
pm2 list
pm2 status
```

## Security Checklist

- [ ] MongoDB authentication enabled
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Strong JWT secret in .env
- [ ] Cloudinary credentials secured
- [ ] .env file not in git
- [ ] Regular backups configured
- [ ] PM2 auto-restart on reboot

## Notes

- Replace `yourdomain.com` with your actual domain
- Replace `your-secure-password` with strong passwords
- Keep your `.env` file secure and never commit it to git
- Regularly update your system and dependencies
- Monitor your application logs for errors

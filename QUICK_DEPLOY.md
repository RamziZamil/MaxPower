# Quick Deployment Checklist - MaxPower

## Pre-Deployment Checklist

### 1. Update API URLs
Before deploying, you need to update all API calls to use environment variables.

**Create `frontend/.env.production`:**
```env
VITE_API_URL=https://yourdomain.com/api
```

**Then update your code to use the API config:**
- Replace all `http://localhost:5000/api` with imports from `src/config/api.js`
- Or use the `API_ENDPOINTS` object from the config file

### 2. Update Domain References
- Replace `yourdomain.com` with your actual domain in:
  - `nginx.conf.example`
  - `DEPLOYMENT_GUIDE.md`
  - `frontend/src/Components/SEO.jsx`
  - `frontend/src/Components/StructuredData.jsx`

### 3. Prepare Environment Variables
Create `Backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maxpower
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## Quick Deployment Steps

### 1. Connect to Your VPS
```bash
ssh root@your-server-ip
```

### 2. Install Required Software
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# PM2
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx

# Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Upload Your Project
```bash
# Option 1: Using SCP from your local machine
scp -r MaxPower root@your-server-ip:/var/www/

# Option 2: Using Git
cd /var/www
git clone <your-repo-url> maxpower
```

### 4. Setup Project
```bash
cd /var/www/maxpower

# Backend
cd Backend
npm install --production
# Create .env file with your configuration
nano .env

# Frontend
cd ../frontend
npm install
# Create .env.production
echo "VITE_API_URL=https://yourdomain.com/api" > .env.production
npm run build
```

### 5. Start Backend
```bash
cd /var/www/maxpower/Backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/maxpower
# Copy content from nginx.conf.example and update domain
sudo ln -s /etc/nginx/sites-available/maxpower /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Setup SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 8. Configure Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Post-Deployment

### Test Your Application
1. Visit `https://yourdomain.com`
2. Test login/register
3. Test product browsing
4. Test cart functionality

### Monitor Logs
```bash
# Backend logs
pm2 logs maxpower-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Common Issues

**Issue: 502 Bad Gateway**
- Check if backend is running: `pm2 list`
- Check backend logs: `pm2 logs maxpower-backend`
- Verify Nginx proxy_pass URL matches backend port

**Issue: CORS Errors**
- Ensure `FRONTEND_URL` in backend .env matches your domain
- Check backend CORS configuration

**Issue: MongoDB Connection Failed**
- Check MongoDB status: `sudo systemctl status mongod`
- Verify MongoDB URI in .env
- Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`

**Issue: Static Files Not Loading**
- Verify frontend build completed: `ls -la frontend/dist`
- Check Nginx root path matches dist folder
- Check file permissions: `sudo chown -R www-data:www-data /var/www/maxpower/frontend/dist`

## Maintenance

### Update Application
```bash
cd /var/www/maxpower
git pull  # or upload new files
cd Backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart maxpower-backend
sudo systemctl reload nginx
```

### Backup Database
```bash
mongodump --out /var/backups/mongodb/$(date +%Y%m%d)
```

### View Status
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod
```


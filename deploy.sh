#!/bin/bash

# MaxPower Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting MaxPower Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Navigate to project directory
cd /var/www/maxpower || exit 1

echo -e "${GREEN}📦 Installing Backend Dependencies...${NC}"
cd Backend
npm install --production

echo -e "${GREEN}📦 Installing Frontend Dependencies...${NC}"
cd ../frontend
npm install

echo -e "${GREEN}🏗️  Building Frontend...${NC}"
npm run build

echo -e "${GREEN}🔄 Restarting Backend with PM2...${NC}"
cd ../Backend
pm2 restart maxpower-backend || pm2 start ecosystem.config.js

echo -e "${GREEN}🔄 Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${YELLOW}Check your application at: https://yourdomain.com${NC}"


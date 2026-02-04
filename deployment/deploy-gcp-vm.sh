#!/bin/bash

# GCP VM Deployment Script for Pokémon Gallery Angular App
# This script sets up and deploys the application on a GCP VM instance

set -e

echo "🚀 Starting deployment to GCP VM..."

# Configuration
APP_DIR="/var/www/pokemon-app"
NGINX_SITE_CONFIG="/etc/nginx/sites-available/pokemon-app"
NGINX_SITE_ENABLED="/etc/nginx/sites-enabled/pokemon-app"

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm (if not already installed)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install Nginx (if not already installed)
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get install -y nginx
fi

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone or copy the application
echo "📥 Copying application files..."
# If running from the repo directory
if [ -f "package.json" ]; then
    cp -r . $APP_DIR/
else
    echo "⚠️  Please run this script from the repository root or manually copy files to $APP_DIR"
    exit 1
fi

# Navigate to app directory
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building the application..."
npm run build

# Configure Nginx
echo "⚙️  Configuring Nginx..."
sudo tee $NGINX_SITE_CONFIG > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root $APP_DIR/dist/pokemon-app;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Angular routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable the site
echo "✅ Enabling Nginx site..."
sudo ln -sf $NGINX_SITE_CONFIG $NGINX_SITE_ENABLED

# Remove default Nginx site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall (if UFW is installed)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
fi

# Get the external IP
EXTERNAL_IP=$(curl -s ifconfig.me || echo "Unable to determine")

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now accessible at:"
echo "   http://$EXTERNAL_IP"
echo ""
echo "📝 Useful commands:"
echo "   - Check Nginx status: sudo systemctl status nginx"
echo "   - View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   - Restart Nginx: sudo systemctl restart nginx"
echo "   - Update app: cd $APP_DIR && git pull && npm run build && sudo systemctl restart nginx"
echo ""

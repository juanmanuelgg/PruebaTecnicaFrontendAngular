# GCP VM Deployment Guide

This guide provides step-by-step instructions for deploying the Pokémon Gallery application to a Google Cloud Platform (GCP) VM instance.

## Prerequisites

- A GCP account with billing enabled
- `gcloud` CLI installed and configured on your local machine
- Basic knowledge of GCP and Linux

## Option 1: Quick Deployment (Recommended)

### Step 1: Create a GCP VM Instance

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Create a VM instance
gcloud compute instances create pokemon-app-vm \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=10GB \
    --tags=http-server,https-server \
    --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y git'
```

### Step 2: Configure Firewall Rules

```bash
# Allow HTTP traffic
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --target-tags http-server \
    --description="Allow HTTP traffic" \
    --direction=INGRESS

# Allow HTTPS traffic (for future SSL setup)
gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --target-tags https-server \
    --description="Allow HTTPS traffic" \
    --direction=INGRESS
```

### Step 3: SSH into the VM and Deploy

```bash
# SSH into the VM
gcloud compute ssh pokemon-app-vm --zone=us-central1-a

# Clone the repository (replace with your fork if needed)
git clone https://github.com/YOUR_USERNAME/PruebaTecnicaFrontendAngular.git
cd PruebaTecnicaFrontendAngular

# Run the deployment script
chmod +x deployment/deploy-gcp-vm.sh
./deployment/deploy-gcp-vm.sh
```

### Step 4: Access Your Application

After the deployment completes, get the external IP:

```bash
gcloud compute instances describe pokemon-app-vm \
    --zone=us-central1-a \
    --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Visit `http://[EXTERNAL_IP]` in your browser.

## Option 2: Manual Deployment

If you prefer to deploy manually or need more control:

### 1. Create and SSH into the VM

```bash
gcloud compute ssh pokemon-app-vm --zone=us-central1-a
```

### 2. Install Dependencies

```bash
# Update packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Install Git (if not already installed)
sudo apt-get install -y git
```

### 3. Clone and Build the Application

```bash
# Create app directory
sudo mkdir -p /var/www/pokemon-app
sudo chown -R $USER:$USER /var/www/pokemon-app

# Clone repository (replace with your fork if needed)
cd /var/www/pokemon-app
git clone https://github.com/YOUR_USERNAME/PruebaTecnicaFrontendAngular.git .

# Install dependencies and build
npm ci
npm run build
```

### 4. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/pokemon-app
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /var/www/pokemon-app/dist/pokemon-app;
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
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 5. Enable the Site and Restart Nginx

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/pokemon-app /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 6. Configure Firewall

```bash
# Allow Nginx through UFW
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Updating the Application

To update the application after making changes:

```bash
# SSH into the VM
gcloud compute ssh pokemon-app-vm --zone=us-central1-a

# Navigate to app directory
cd /var/www/pokemon-app

# Pull latest changes
git pull origin main

# Rebuild
npm ci
npm run build

# Restart Nginx
sudo systemctl restart nginx
```

## Setting Up a Custom Domain (Optional)

### 1. Reserve a Static IP

```bash
gcloud compute addresses create pokemon-app-ip --region=us-central1
gcloud compute instances delete-access-config pokemon-app-vm \
    --access-config-name="external-nat" --zone=us-central1-a
gcloud compute instances add-access-config pokemon-app-vm \
    --access-config-name="external-nat" \
    --address=$(gcloud compute addresses describe pokemon-app-ip --region=us-central1 --format="value(address)") \
    --zone=us-central1-a
```

### 2. Update DNS Records

Add an A record in your domain registrar pointing to the static IP.

### 3. Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/pokemon-app
```

Update the `server_name` line:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Setting Up SSL/HTTPS with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Maintenance

### Check Application Status

```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Performance Optimization

1. **Enable HTTP/2**: Add `http2` to the listen directive in Nginx config
2. **Configure Caching**: Adjust cache headers for optimal performance
3. **CDN**: Consider using Cloud CDN for global distribution

## Troubleshooting

### Application not loading

1. Check Nginx is running: `sudo systemctl status nginx`
2. Check logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify firewall: `sudo ufw status`
4. Check build files exist: `ls -la /var/www/pokemon-app/dist/pokemon-app`

### Port 80 blocked

Ensure firewall rules are configured correctly:
```bash
gcloud compute firewall-rules list
```

### Out of memory during build

Upgrade to a larger machine type:
```bash
gcloud compute instances stop pokemon-app-vm --zone=us-central1-a
gcloud compute instances set-machine-type pokemon-app-vm \
    --machine-type=e2-small --zone=us-central1-a
gcloud compute instances start pokemon-app-vm --zone=us-central1-a
```

## Cost Optimization

- **e2-micro** instances are free tier eligible (1 per month)
- Use preemptible instances for development: `--preemptible`
- Set up auto-shutdown for non-production VMs
- Monitor usage with GCP Cost Management

## Security Best Practices

1. **Keep system updated**: `sudo apt-get update && sudo apt-get upgrade`
2. **Configure firewall**: Only allow necessary ports
3. **Use SSH keys**: Disable password authentication
4. **Enable automatic security updates**
5. **Use SSL/HTTPS**: Always in production
6. **Regular backups**: Use GCP snapshots

## Cleanup

To delete the VM and resources:

```bash
# Delete the VM instance
gcloud compute instances delete pokemon-app-vm --zone=us-central1-a

# Delete firewall rules
gcloud compute firewall-rules delete allow-http
gcloud compute firewall-rules delete allow-https

# Delete static IP (if created)
gcloud compute addresses delete pokemon-app-ip --region=us-central1
```

## Additional Resources

- [GCP Compute Engine Documentation](https://cloud.google.com/compute/docs)
- [Nginx Configuration Best Practices](https://nginx.org/en/docs/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

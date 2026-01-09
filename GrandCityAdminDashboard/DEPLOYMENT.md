# Deployment Guide: GrandCity + GuestPass Integration

This guide describes how to deploy the integrated "GrandCity Admin Dashboard" which now includes the "GuestPass" module.

## 1. System Architecture
The system consists of **two separate Node.js applications** running simultaneously:
1.  **GrandCity Admin** (Next.js): The main frontend and dashboard. Runs on Port `3000`.
2.  **GuestPass System** (Express/Node): The internal module for visitors. Runs on Port `3001`.

GrandCity **proxies** traffic to GuestPass, making it appear as a single application to the end user.

## 2. Server Requirements
*   **OS**: Ubuntu 20.04/22.04 LTS (Recommended) or Windows Server.
*   **Runtime**: Node.js v18+ (LTS).
*   **Database**: PostgreSQL (NeonDB or self-hosted).
*   **Process Manager**: PM2 (Recommended for keeping apps alive).

## 3. Deployment Steps

### Step A: Prepare the Server
1.  Install Node.js & NPM.
2.  Install PM2: `npm install -g pm2`.

### Step B: Clone & Install
Transfer your project files to the server (e.g., `/var/www/grandcity`).

**1. Install GuestPass Dependencies:**
```bash
cd /var/www/grandcity/GuestPass
npm install --production
```

**2. Install GrandCity Dependencies:**
```bash
cd /var/www/grandcity/Grandcityadmindashboard
npm install --production
```

### Step C: Environment Variables

**1. GuestPass (.env)**
Location: `/var/www/grandcity/GuestPass/.env`
```ini
PORT=3001
JWT_SECRET=your_secure_random_string
DATABASE_URL=postgres://user:pass@host/db_name?options=-csearch_path%3Dguestpass,public
```

**2. GrandCity (.env.local)**
Location: `/var/www/grandcity/Grandcityadmindashboard/.env.local`
```ini
DATABASE_URL=postgres://user:pass@host/db_name
```

### Step D: Database Migration
Ensure you have run the schema isolation script on your production database:
```bash
psql "YOUR_DATABASE_URL" -f /var/www/grandcity/Grandcityadmindashboard/grandcity_guestpass_schema.sql
```

### Step E: Startup with PM2 (Recommended)
Use PM2 to run both processes in the background.

```bash
# Start GuestPass on 3001
cd /var/www/grandcity/GuestPass
pm2 start server.js --name "grandcity-guestpass" --env PORT=3001

# Start GrandCity on 3000
cd /var/www/grandcity/Grandcityadmindashboard
npm run build
pm2 start npm --name "grandcity-dashboard" -- start
```

### Step F: Reverse Proxy (Nginx)
Expose only Port `3000` to the public internet. Port `3001` should stay private (localhost only).

**Nginx Config Block:**
```nginx
server {
    listen 80;
    server_name dashboard.grandcity.pk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. Verification
1.  Navigate to `http://dashboard.grandcity.pk`.
2.  Click "GuestPass" in the Sidebar.
3.  Ensure the GuestPass UI loads within the dashboard without errors.

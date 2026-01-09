# Deploying to Vercel

We have configured your system to run **Both Applications** on Vercel using a "Wrapper" method for GuestPass.

## 1. Prerequisites
*   A Vercel Account.
*   Your project code pushed to GitHub (as two separate folders in one repo, or separate repos).
*   Your NeonDB Connection String.

## 2. Deploying GuestPass (The Backend)
Vercel needs to know this is an Express app. We added `vercel.json` and `api/index.js` to handle this.

1.  **Log in to Vercel Dashboard** and click **Add New Project**.
2.  Import your GitHub Repository.
3.  **Root Directory**: Click "Edit" and select `GuestPass`.
4.  **Environment Variables**: Add these:
    *   `DATABASE_URL`: `postgres://user:pass@host/db?options=-csearch_path%3Dguestpass,public`
    *   `JWT_SECRET`: A long random string.
5.  **Deploy**.
6.  **Copy the URL**: Once deployed, copy the domain (e.g., `https://guestpass-backend.vercel.app`).

## 3. Deploying GrandCity (The Dashboard)
1.  **Add New Project** in Vercel.
2.  Import the same Repository.
3.  **Root Directory**: Click "Edit" and select `Grandcityadmindashboard`.
4.  **Framework Preset**: Select **Next.js**.
5.  **Environment Variables**: Add these:
    *   `DATABASE_URL`: `postgres://user:pass@host/db` (No search_path options needed here).
    *   `GUESTPASS_URL`: Paste the URL from Step 2 (e.g., `https://guestpass-backend.vercel.app`). **Important**: Do NOT include a trailing slash.
6.  **Deploy**.

## 4. Verification
1.  Open your **GrandCity Dashboard URL**.
2.  Click **GuestPass** in the sidebar.
3.  It should load the GuestPass UI (proxied from the other Vercel deployment) inside the iframe!

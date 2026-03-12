# Deploying ThinkDSA

This guide walks you through deploying the ThinkDSA application using free-tier friendly services.

## Prerequisites

1.  **A GitHub Account**: You need to upload this project's code to a GitHub repository.
2.  **Commit your code**: Run `git init`, `git add .`, and `git commit -m "Initial commit"` in this folder, then push it to your GitHub repo.

## Phase 1: Deploying the Database (Neon)

We use Neon.tech for a serverless PostgreSQL database.

1.  Go to [Neon.tech](https://neon.tech/) and create an account.
2.  Create a new project (name it `thinkdsa-db` or similar).
3.  On your project dashboard, find the **Connection Details** box.
4.  Copy the **Postgres connection string** (it looks like `postgresql://user:password@hostname/dbname?sslmode=require`).
5.  Save this string; you will need it for the backend in Phase 2.

## Phase 2: Deploying the Backend (Render)

We use Render to host the Node.js API.

1.  Go to [Render.com](https://render.com/) and create an account using your GitHub.
2.  Click **New +** and select **Web Service**.
3.  Connect the GitHub repository you created earlier.
4.  Configure the service:
    *   **Name**: `thinkdsa-api`
    *   **Root Directory**: `apps/api`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
    *   **Instance Type**: Free
5.  Scroll down to **Environment Variables** and add the following:
    *   `DATABASE_URL`: Add the Neon connection string you copied in Phase 1.
    *   `PORT`: `10000` (Render's default)
    *   `JWT_SECRET`: A long, random string.
    *   `GROQ_API_KEY`: Your Groq API key.
    *   `FIREBASE_SERVICE_ACCOUNT_JSON`: **IMPORTANT**: Open your `serviceAccountKey.json` file on your computer, copy its entire contents, and paste it exactly as-is into this environment variable value.
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. Once it says "Live", copy the Render URL (e.g., `https://thinkdsa-api.onrender.com`).

*(Optional Database Seeding on Render)*
To seed your database with the initial problems on Render, click the "Shell" tab in your Render dashboard after it deploys, and run: `npm run prisma:seed` (You may need to add `"prisma:seed": "npx prisma db seed"` to the `apps/api/package.json` scripts first).

## Phase 3: Deploying the Frontend (Vercel)

We use Vercel to host the React/Vite web application.

1.  Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2.  Click **Add New...** -> **Project**.
3.  Import your ThinkDSA GitHub repository.
4.  In the configuration view, set the **Framework Preset** to **Vite**.
5.  Set the **Root Directory** to `apps/web`.
6.  Open the **Environment Variables** section and add all your Firebase variables from your local `.env` file, **PLUS** the backend URL:
    *   `VITE_FIREBASE_API_KEY`: `AIzaSyBTZyAHt...`
    *   `VITE_FIREBASE_AUTH_DOMAIN`: `dsathinkit.firebaseapp.com`
    *   `VITE_FIREBASE_PROJECT_ID`: `dsathinkit`
    *   `VITE_FIREBASE_STORAGE_BUCKET`: `dsathinkit.firebasestorage.app`
    *   `VITE_FIREBASE_MESSAGING_SENDER_ID`: `788137438029`
    *   `VITE_FIREBASE_APP_ID`: `1:788137438029:web:...`
    *   `VITE_API_URL`: Paste the URL from your newly deployed Render API (e.g., `https://thinkdsa-api.onrender.com`). *Make sure there is no trailing slash.*
7.  Click **Deploy**.

Once Vercel finishes, click to visit your live site! If everything is configured correctly, your frontend will securely talk to your Render backend, which communicates with Neon and Firebase.

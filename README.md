# CodeAlpha_CloudBasedBusPassSystem

Cloud-Based Bus Pass System is a React + Firebase web application for booking secure digital bus passes. It prevents ticket loss through QR-based digital passes, protects users from incorrect pricing with route-based fare validation, and demonstrates autoscaling behavior for high-traffic booking windows.

## Live Project Link

Add your deployed free cloud URL here after deployment:

**Live Demo:** `https://your-vercel-project-url.vercel.app`

Recommended free hosting: [Vercel](https://vercel.com/) for always-on static hosting. Optional database/cloud integration: [Firebase Firestore](https://firebase.google.com/products/firestore) free Spark plan.

## Features

- Online bus pass booking with passenger, route, pass type, and travel date details.
- Fare is calculated from protected route rules to avoid incorrect pricing.
- Digital ticket ID, checksum, and QR-style pass view reduce ticket loss and theft.
- Firebase Firestore integration for cloud booking storage.
- Local backup mode works when Firebase credentials are not configured.
- Cloud operations panel shows simulated traffic load and dynamic server provisioning.
- Responsive UI for desktop and mobile evaluators.
- Ready for Vercel and Firebase Hosting free-tier deployment.

## Tech Stack

- React 18
- Vite
- Firebase Firestore
- Firebase Hosting configuration
- Vercel deployment configuration
- Lucide React icons

## Run Locally in VS Code

1. Open this folder in VS Code.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Firebase Free Cloud Setup

The project runs without Firebase credentials, but Firestore cloud storage is enabled when you add Firebase environment values.

1. Create a Firebase project using the free Spark plan.
2. Enable Firestore Database in test mode for evaluation.
3. Register a web app in Firebase.
4. Copy `.env.example` to `.env`.
5. Paste your Firebase web app values:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

6. Restart the dev server.

Bookings will be written to the `bookings` collection in Firestore. If Firebase is not configured or unavailable, the app stores a backup in browser local storage.

## Deploy Free on Vercel

1. Push this project to GitHub.
2. Open [Vercel](https://vercel.com/) and import the GitHub repository.
3. Use these settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. Add Firebase environment variables in Vercel Project Settings if using Firestore.
5. Deploy.
6. Copy the deployed URL and replace the placeholder in the **Live Project Link** section.

Vercel free hosting keeps the frontend available without needing to run your laptop or VS Code continuously.

## Deploy Free on Firebase Hosting

Install Firebase CLI if you want Firebase Hosting instead of Vercel:

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase init hosting
firebase deploy
```

The included `firebase.json` is already configured to serve the `dist` folder.

## Build Check

```bash
npm run build
```

## Project Structure

```text
CodeAlpha_CloudBasedBusPassSystem/
  src/
    main.jsx
    styles.css
    services/
      cloudStore.js
  .env.example
  firebase.json
  vercel.json
  package.json
  README.md
```

## Reliability and Scalability Notes

- Static frontend can be served globally from Vercel/Firebase CDN.
- Firestore provides managed cloud storage for bookings.
- The UI models autoscaling by calculating required server capacity from traffic load.
- Digital pass records prevent physical ticket loss.
- Route-based fare calculation prevents manual pricing mistakes.

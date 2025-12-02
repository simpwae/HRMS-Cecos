# Deploying HRMS on Vercel

## 1. Project Structure

- Your app is a Vite + React project, which is fully supported by Vercel.
- All static assets (including PDFs) are in the `public` folder. Vercel will serve these correctly.

## 2. Build Settings for Vercel

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (default)

## 3. Routing for SPA

- The included `vercel.json` ensures all routes are rewritten to `index.html` (for React Router to work).

## 4. Case Sensitivity

- On Vercel (Linux), file and folder names are case-sensitive. Your folder is named `PDF's` (with an apostrophe and capital letters). All references in code must match this exactly.

## 5. Environment Variables

- No special environment variables are required for Vercel. The Vite config will use `/` as the base path.

## 6. Common Issues

- If you get a 404 for PDFs, check that the file path and case match exactly (e.g., `/PDF's/HARASSMENT-POLICY.pdf`).
- If you see a blank page on refresh, make sure the `vercel.json` file is present and correct.

## 7. Steps to Deploy

1. Push your code to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com/) and import your repository.
3. Set the framework preset to `Vite`.
4. Deploy!

---

If you follow these steps, your HRMS app should work perfectly on Vercel.

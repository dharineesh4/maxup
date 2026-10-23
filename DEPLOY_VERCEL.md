# Placement & Career Portal - Placement AI

A multi-tenant campus placement portal featuring:
- **Multi-Tenant Institution Selector** (IIT Bombay, BITS Pilani, NITK Surathkal, MIT Manipal)
- **Campus Job Drives Dashboard** with eligibility filtering and 1-click apply
- **Gemini-Powered AI Mock Interview Coach** with dynamic evaluation & scorecards
- **Timed Aptitude Practice Tests** with auto-submission and solution explanations
- **AI Resume Reviewer** with ATS score and Google X-Y-Z bullet rewrites
- **Automated Email Notifications** for deadlines & recruitment stage advancements
- **Training & Placement Officer (TPO) Console**
- **Firebase Firestore Persistence**

---

## Deploying to Vercel

### Option 1: Automatic Git Deployment (Recommended)
1. Push this repository to **GitHub / GitLab / Bitbucket**.
2. Open [Vercel Dashboard](https://vercel.com/new).
3. Import this repository.
4. Add the following **Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `VITE_GEMINI_API_KEY`: Same Gemini API key.
5. Click **Deploy**. Vercel will build using the included `vercel.json` configuration.

### Option 2: Deploy with Vercel CLI (Local Machine)
If you have the repository on your local computer:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```
When prompted:
- **Set up and deploy?**: `y`
- **Which scope?**: Choose your personal/team account
- **Link to existing project?**: `n`
- **Project name**: `placement-ai-portal`
- **Directory**: `./`
- **Override settings?**: `n` (Automatically detected Vite + `vercel.json`)

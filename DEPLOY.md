# SquadIQ — Deploy Guide
## Live on Google in ~10 minutes, AI fully working

---

## STEP 1 — Get a free Anthropic API key

1. Go to **https://console.anthropic.com** → Sign up free
2. Click **API Keys** → **Create Key** → copy it (starts with sk-ant-...)
3. Keep this tab open, you will paste it in Step 2

---

## STEP 2 — Deploy to Netlify (free, easiest)

1. Go to **https://netlify.com** and sign up free (use Google)
2. Click "Add new site" then "Deploy manually"
3. Drag the entire squadiq-deploy FOLDER into the upload box
4. Wait 30 seconds — your site is live at something like https://random-name.netlify.app

### Add your API key (AI will not work without this):
5. In Netlify dashboard, click your site, then Site configuration, then Environment variables
6. Click "Add a variable"
   - Key:   ANTHROPIC_API_KEY
   - Value: paste your sk-ant-... key
7. Click Save, then go to Deploys, click "Trigger deploy", then "Deploy site"
8. Done. AI works on the live site.

---

## STEP 3 — Get on Google (optional)

1. Go to https://search.google.com/search-console
2. Add your Netlify URL as a property
3. Click URL Inspection, paste your URL, click "Request Indexing"
4. Appears in Google within 1-2 weeks

---

## Alternative: Vercel

1. Go to https://vercel.com, sign up, click "Add New Project" then "Upload"
2. Upload the squadiq-deploy folder
3. After deploy: Project Settings, Environment Variables
   - Add ANTHROPIC_API_KEY = your key
4. Redeploy. AI works.

---

## Files in this package

index.html                    - The entire SquadIQ app
netlify/functions/claude.js   - Serverless proxy (keeps API key secret)
netlify.toml                  - Routes /api/claude to the function
vercel.json                   - Vercel config
manifest.json                 - Makes it installable as a phone app
sitemap.xml                   - Helps Google find the site
robots.txt                    - Tells Google it can crawl
DEPLOY.md                     - This file

---

## How the AI works

Browser sends request to /api/claude on your domain.
Netlify function receives it and forwards to Anthropic API using your secret key.
Your API key is NEVER visible in the browser. Secure by design.

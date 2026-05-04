# Cloudflare Pages Dashboard Setup

**Status:** Repository is fully configured. Dashboard settings required for automated deployment.

## ✅ What's Ready
- Vite v6.4.2 configured and building successfully
- pnpm locked as package manager globally
- wrangler.toml configured with `pages_build_output_dir = "./dist"`
- All PWA files generated automatically (manifest.webmanifest, sw.js, registerSW.js)
- dist/ folder generation verified and working

## ⚠️ What You Must Do (One-Time Setup)

### Step 1: Open Cloudflare Dashboard
Navigate to: **https://dash.cloudflare.com**

### Step 2: Select Your Pages Project
Click **Pages** → Find **wakili-client** project

### Step 3: Configure Build Settings
Go to **Settings** → **Builds & Deployments**

Set these values:
| Setting | Value |
|---------|-------|
| **Build command** | `pnpm run build` |
| **Publish directory** | `dist` |
| **Root directory** | `wakiliclient/wakilifrontend` (monorepo) or leave blank |

### Step 4: Save & Redeploy
- Click **Save**
- Return to the project and click **Redeploy** to test with new settings

## ✅ After Dashboard Setup

Your deployment workflow becomes automatic:

```
git push
  ↓
Cloudflare detects push
  ↓
Runs: pnpm run build
  ↓
Deploys dist/ contents
  ↓
Pages renders automatically ✨
```

## Manual Deployment (Optional)

If you want to deploy manually without Git push:

```bash
pnpm run deploy:cloudflare
```

This runs:
```
wrangler pages deploy dist --project-name=wakili-client --branch=main
```

## Build Verification

To verify build locally before pushing:

```bash
pnpm run build
```

Expected output:
- ✅ `dist/index.html` created
- ✅ `dist/manifest.webmanifest` created
- ✅ `dist/sw.js` created
- ✅ `dist/registerSW.js` created
- ✅ `dist/assets/` folder with CSS/JS chunks
- ✅ Build completes in ~1-2 minutes

## Troubleshooting

**"Output directory 'dist' not found"**
→ Dashboard build command is blank or not set to `pnpm run build`
→ Go back to Dashboard Settings and verify Build command is set

**"Failed to load module script"**
→ Legacy PWA files might exist; they've been removed from this repo
→ Clear browser cache or use incognito mode

**Large chunk warnings**
→ Normal for feature-rich apps; does not prevent deployment
→ Can optimize later with code-splitting (see vite.config.ts comments)

## Project Structure

```
wakiliclient/
└── wakilifrontend/          ← Your app directory
    ├── package.json          (pnpm scripts)
    ├── wrangler.toml         (Pages config: pages_build_output_dir)
    ├── vite.config.ts        (Build config with PWA plugin)
    ├── pwa.config.ts         (PWA manifest & SW options)
    ├── src/                  (React source)
    ├── public/               (Static assets)
    └── dist/                 (Generated on `pnpm build`)
```

---

**Once Dashboard is configured, you're done!** Subsequent pushes will build and deploy automatically. 🎉

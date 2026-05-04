Deploying wakili-client to Cloudflare Pages

Prerequisites:
- Install Wrangler globally or as dev dependency: pnpm add -D wrangler or pnpm add -g wrangler.
- Create a Cloudflare account and get your account_id (if using wrangler publish for workers).
- Ensure the `dist` folder contains your built frontend assets.

Quick steps:

1. Build the app:

pnpm run build

2. The `wrangler.toml` is pre-configured with:
   - Assets directory set to `./dist`
   - Single-page application (SPA) routing enabled for client-side navigation
   - Analytics enabled for deployment insights

3. Deploy to Pages (recommended):

pnpx wrangler pages deploy dist --project-name wakili-client --branch main

Or if using a saved Wrangler authentication:

pnpx wrangler pages publish dist

Notes:
- The `wrangler.toml` configuration follows Cloudflare's modern Pages format with `[assets]` section.
- `not_found_handling = "single-page-application"` ensures all routes fall back to `index.html` for React Router.
- For Git-based automated Pages deployments, connect your repository in the Cloudflare Pages dashboard and set:
  - Build command: `pnpm run build`
  - Publish directory: `dist`
- `compatibility_date` is set to ensure consistent behavior across Cloudflare's infrastructure.
- Cloudflare Pages must either run `pnpm run build` itself or receive a prebuilt `dist/` folder; if the build command is blank, deployment will fail with `Output directory "dist" not found`.

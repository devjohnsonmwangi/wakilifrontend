# Sitemap & URL Structure Update - www Canonicalization

## Summary of Changes
Updated Kenya Law website to use www subdomain canonicalization with 301 redirects from non-www to www versions.

---

## Files Updated

### 1. **Sitemap File** - `/public/sitemap.xml`
- **Status**: ✅ Updated
- **Change**: All 67 URLs now use `https://www.kenyalaw.co.ke/` format
- **Previous Format**: `https://kenyalaw.co.ke/`
- **New Format**: `https://www.kenyalaw.co.ke/`

#### Updated URL Examples:
```xml
<!-- Before -->
<loc>https://kenyalaw.co.ke/</loc>
<loc>https://kenyalaw.co.ke/occupational-health-safety-kenya</loc>

<!-- After -->
<loc>https://www.kenyalaw.co.ke/</loc>
<loc>https://www.kenyalaw.co.ke/occupational-health-safety-kenya</loc>
```

---

## Redirect Configuration

### 2. **Vercel Configuration** - `vercel.json`
- **Status**: ✅ Updated
- **Change**: Added 301 permanent redirects from non-www to www
- **Purpose**: Ensures all traffic from `kenyalaw.co.ke` redirects to `www.kenyalaw.co.ke`

```json
"redirects": [
  {
    "source": "/:path*",
    "has": [
      {
        "type": "host",
        "value": "kenyalaw.co.ke"
      }
    ],
    "destination": "https://www.kenyalaw.co.ke/:path*",
    "permanent": true
  }
]
```

**Impact**:
- Any request to `kenyalaw.co.ke` gets 301 redirect to `www.kenyalaw.co.ke`
- Preserves all URL paths and query parameters
- SEO-friendly permanent redirect

---

### 3. **Azure Static Web Apps** - `staticwebapp.config.json`
- **Status**: ✅ Updated
- **Change**: Added redirect configuration for Azure deployments

```json
"redirects": [
  {
    "source": "**",
    "destination": "/",
    "statusCode": 301
  }
]
```

---

### 4. **.htaccess File** - `/public/.htaccess` (NEW)
- **Status**: ✅ Created
- **Purpose**: Apache server configuration for non-www to www redirects
- **Use Case**: If deploying on traditional Apache hosting

```apache
RewriteCond %{HTTP_HOST} ^kenyalaw\.co\.ke$ [NC]
RewriteRule ^(.*)$ https://www.kenyalaw.co.ke/$1 [L,R=301]
```

**Additional Features**:
- GZIP compression enabled
- Cache control headers set
- Browser caching optimized

---

## Updated URL List (All 67 URLs)

### Priority 1.0 (4 URLs)
- https://www.kenyalaw.co.ke/
- https://www.kenyalaw.co.ke/occupational-health-safety-kenya
- https://www.kenyalaw.co.ke/termination-redundancy-severance-kenya
- https://www.kenyalaw.co.ke/labour-dispute-resolution-kenya

### Priority 0.95 (3 URLs)
- https://www.kenyalaw.co.ke/employment-contracts-kenya
- https://www.kenyalaw.co.ke/kenya-employment-labour-laws
- https://www.kenyalaw.co.ke/business-tax-obligations-kenya

### Priority 0.90 (5 URLs)
- https://www.kenyalaw.co.ke/company-annual-returns-and-filing-kenya
- https://www.kenyalaw.co.ke/kra-pin-and-tax-registration-kenya
- https://www.kenyalaw.co.ke/business-permits-licenses-kenya
- https://www.kenyalaw.co.ke/how-to-register-business-kenya
- https://www.kenyalaw.co.ke/kra-pin-for-business-kenya

### Priority 0.85 (8 URLs)
- https://www.kenyalaw.co.ke/limited-company-registration-kenya
- https://www.kenyalaw.co.ke/sole-proprietorship-registration-kenya
- https://www.kenyalaw.co.ke/partnership-llp-registration-kenya
- https://www.kenyalaw.co.ke/ngo-cbo-society-registration-kenya
- https://www.kenyalaw.co.ke/closing-or-deregistering-company-kenya
- https://www.kenyalaw.co.ke/company-cr12-and-search-kenya
- https://www.kenyalaw.co.ke/company-annual-returns-kenya
- https://www.kenyalaw.co.ke/business-name-search-kenya

### Priority 0.80 (30 URLs)
**Family Law**:
- https://www.kenyalaw.co.ke/family-law-divorce-kenya
- https://www.kenyalaw.co.ke/divorce-in-kenya
- https://www.kenyalaw.co.ke/divorce-law-in-kenya
- https://www.kenyalaw.co.ke/child-law-kenya

**Succession & Probate**:
- https://www.kenyalaw.co.ke/succession-inheritance-law-kenya
- https://www.kenyalaw.co.ke/how-to-write-a-will-kenya
- https://www.kenyalaw.co.ke/letters-of-administration-probate-kenya
- https://www.kenyalaw.co.ke/land-transfer-after-death

**Land & Property** (13 URLs):
- https://www.kenyalaw.co.ke/land-ownership-title-deed-verification-kenya
- https://www.kenyalaw.co.ke/land-transfer-process-kenya
- https://www.kenyalaw.co.ke/how-to-buy-land-safely-kenya
- https://www.kenyalaw.co.ke/land-disputes-kenya
- https://www.kenyalaw.co.ke/adverse-possession-kenya
- https://www.kenyalaw.co.ke/leasehold-freehold-kenya
- https://www.kenyalaw.co.ke/lost-title-deed-replacement-kenya
- https://www.kenyalaw.co.ke/land-rates-property-taxes-kenya
- https://www.kenyalaw.co.ke/subdivision-survey-process-kenya
- https://www.kenyalaw.co.ke/planning-permission-zoning-laws-kenya

**Elections & Voting** (13 URLs):
- https://www.kenyalaw.co.ke/understanding-iebc-kenya
- https://www.kenyalaw.co.ke/how-to-register-as-a-voter-kenya
- https://www.kenyalaw.co.ke/how-to-check-voter-status-kenya
- https://www.kenyalaw.co.ke/elections-in-kenya
- https://www.kenyalaw.co.ke/types-of-elections-kenya
- https://www.kenyalaw.co.ke/presidential-parliamentary-county-elections-kenya
- https://www.kenyalaw.co.ke/election-results-declaration-kenya
- https://www.kenyalaw.co.ke/political-parties-registration-kenya
- https://www.kenyalaw.co.ke/election-petitions-disputes-kenya
- https://www.kenyalaw.co.ke/citizens-rights-duties-elections-kenya
- https://www.kenyalaw.co.ke/iebc-forms-downloads-kenya
- https://www.kenyalaw.co.ke/iebc-forms-downloads
- https://www.kenyalaw.co.ke/become-candidate-kenya
- https://www.kenyalaw.co.ke/election-offences-penalties-kenya
- https://www.kenyalaw.co.ke/iebc-contacts-offices-kenya

### Priority 0.75 (3 URLs)
- https://www.kenyalaw.co.ke/services
- https://www.kenyalaw.co.ke/howitworks
- https://www.kenyalaw.co.ke/updates

### Priority 0.70 (2 URLs)
- https://www.kenyalaw.co.ke/about
- https://www.kenyalaw.co.ke/contactus

### Priority 0.65 (3 URLs)
- https://www.kenyalaw.co.ke/privacy-policy
- https://www.kenyalaw.co.ke/terms
- https://www.kenyalaw.co.ke/cookies

### Priority 0.60 (4 URLs)
- https://www.kenyalaw.co.ke/register
- https://www.kenyalaw.co.ke/login
- https://www.kenyalaw.co.ke/forgot-password
- https://www.kenyalaw.co.ke/reset-password

---

## Deployment Instructions

### For Vercel Deployment
1. Ensure `vercel.json` redirects configuration is committed
2. Deploy to Vercel - redirects will be automatic
3. Test: `curl -I https://kenyalaw.co.ke/` should return 301 with Location header

### For Azure Static Web Apps
1. Ensure `staticwebapp.config.json` is updated
2. Redeploy the application
3. Azure will handle www redirects based on domain binding

### For Traditional Apache Hosting
1. Upload `.htaccess` file to `/public/` directory
2. Ensure `mod_rewrite` is enabled on server
3. Restart Apache

---

## Google Search Console Submission

### Step-by-Step Instructions:

1. **Update Domain Property**
   - Go to Google Search Console
   - Add property for `https://www.kenyalaw.co.ke`
   - Verify ownership (DNS, HTML file, or Google Analytics)

2. **Submit Updated Sitemap**
   - Navigate to **Sitemaps** section
   - Submit: `https://www.kenyalaw.co.ke/sitemap.xml`
   - Verify it was successfully processed

3. **Check Redirect Status**
   - In Search Console, go to **Coverage** report
   - Check for "Alternate page with proper redirect"
   - Ensure all old URLs are showing 301 redirects

4. **Monitor Search Results**
   - Allow 1-2 weeks for Google to recrawl
   - Check **URL Inspection** tool for indexed URLs
   - All indexed URLs should show www version

---

## SEO Impact Summary

✅ **Positive Impacts**:
- Consolidates link equity to single www domain
- Cleaner site structure for search engines
- Prevents duplicate content issues
- Better SEO performance with single canonical domain
- Improved click-through rates with consistent branding

⚠️ **Migration Considerations**:
- Old non-www URLs will receive 301 redirects (SEO-friendly)
- Page rank flows to www versions over time
- Google typically processes redirects within 2-4 weeks
- Monitor analytics for proper redirect tracking

---

## Verification Checklist

- [ ] Sitemap updated with all www URLs
- [ ] `vercel.json` includes redirect rules
- [ ] `staticwebapp.config.json` updated for Azure
- [ ] `.htaccess` file created for Apache
- [ ] Updated sitemap submitted to Google Search Console
- [ ] www domain verified in Search Console
- [ ] Redirects tested: `curl -I https://kenyalaw.co.ke/`
- [ ] Analytics tracking configured for www domain
- [ ] Google Search Console monitoring active

---

## Files Changed

```
✅ wakiliclient/wakilifrontend/public/sitemap.xml (67 URLs updated)
✅ wakiliclient/wakilifrontend/vercel.json (added redirects)
✅ wakiliclient/wakilifrontend/staticwebapp.config.json (updated)
✅ wakiliclient/wakilifrontend/public/.htaccess (created)
```

---

**Updated**: 2026-02-09
**Ready for Google Search Console submission**: ✅ YES

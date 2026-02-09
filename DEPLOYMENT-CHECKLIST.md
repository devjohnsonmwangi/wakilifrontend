# ✅ COMPLETE CHECKLIST - Website www Migration

## 📋 Pre-Deployment Checklist

### Configuration Files Updated
- [x] `vercel.json` - 301 redirects added
- [x] `staticwebapp.config.json` - Azure redirects configured
- [x] `public/.htaccess` - Apache redirects created (optional)
- [x] `public/sitemap.xml` - All 67 URLs updated to www

### Documentation Generated
- [x] `WWW-MIGRATION-DOCUMENTATION.md` - Complete migration guide
- [x] `GOOGLE-SEARCH-CONSOLE-SETUP.md` - GSC submission instructions
- [x] `SITEMAP-MIGRATION-SUMMARY.md` - Executive summary
- [x] `SITEMAP-SUBMISSION-READY.md` - Quick submission guide

---

## 🚀 Deployment Checklist

### Before Deploy
- [ ] Review all changes in PR/commit
- [ ] Test locally: `npm run dev` or `pnpm dev`
- [ ] Verify no build errors
- [ ] Check console for warnings

### During Deploy
- [ ] Merge changes to main branch
- [ ] Deploy to Vercel (should be automatic)
- [ ] Monitor deployment logs for errors
- [ ] Confirm build completes successfully

### After Deploy (30 minutes)
- [ ] Test non-www redirect: `curl -I https://kenyalaw.co.ke/`
  - Expected: HTTP 301 with Location header
- [ ] Test www URL directly: `curl -I https://www.kenyalaw.co.ke/`
  - Expected: HTTP 200
- [ ] Test specific page: `https://www.kenyalaw.co.ke/occupational-health-safety-kenya`
  - Should load correctly

---

## 🔍 Google Search Console Checklist

### Setup (Day 1)
- [ ] Add www property: `https://www.kenyalaw.co.ke`
- [ ] Select verification method (DNS recommended)
- [ ] Complete ownership verification
- [ ] Verify property shows in GSC dashboard

### Sitemap Submission (Day 1)
- [ ] Navigate to Sitemaps section
- [ ] Click "Add/test sitemap"
- [ ] Enter: `https://www.kenyalaw.co.ke/sitemap.xml`
- [ ] Click Submit
- [ ] Wait for "Success" status (24-48 hours)

### Monitoring (Week 1)
- [ ] Check Sitemaps dashboard daily
- [ ] Note indexed URLs count
- [ ] Monitor for any error messages
- [ ] Check Coverage report for redirect info

### Monitoring (Week 2-4)
- [ ] Review Coverage report for alt pages with redirects
- [ ] Use URL Inspection on sample pages
- [ ] Check for "Alternate page with proper redirect" entries
- [ ] Monitor search result snippets for www versions

---

## 📊 Expected Metrics During Migration

### Day 1-3
- [ ] Sitemap shows "Processing"
- [ ] Indexed URLs: Baseline or slight increase
- [ ] No major changes yet

### Day 4-7 (Week 1)
- [ ] Sitemap shows "Success"
- [ ] Indexed URLs: Gradual increase
- [ ] May see "Alternate page with proper redirect" notices
- [ ] All 67 URLs should be in queue

### Day 8-14 (Week 2)
- [ ] Indexed URLs: Noticeable increase (30-50% of 67)
- [ ] Coverage shows redirect processing
- [ ] Some old non-www URLs showing as redirects

### Day 15-28 (Week 3-4)
- [ ] Most/all URLs indexed: 50-67 URLs
- [ ] Search results showing www versions
- [ ] Redirect processing nearly complete
- [ ] Traffic consolidated to www domain

---

## 🧪 Testing Commands

### Verify Redirects
```bash
# Test home page redirect
curl -I https://kenyalaw.co.ke/

# Test specific page redirect
curl -I https://kenyalaw.co.ke/employment-contracts-kenya

# Expected output for both:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.kenyalaw.co.ke/[path]
```

### Verify www URLs Load
```bash
# Test home page
curl -I https://www.kenyalaw.co.ke/

# Test specific page
curl -I https://www.kenyalaw.co.ke/occupational-health-safety-kenya

# Expected output:
# HTTP/1.1 200 OK
```

### Validate Sitemap
```bash
# Check sitemap accessibility
curl -I https://www.kenyalaw.co.ke/sitemap.xml

# Check sitemap content
curl https://www.kenyalaw.co.ke/sitemap.xml | head -20
```

---

## 📈 Analytics Checklist

### Setup (Week 1)
- [ ] Ensure Google Analytics is tracking www domain
- [ ] Create new segment or filter for www traffic only
- [ ] Set up comparison view: non-www vs www (optional)
- [ ] Note current baseline traffic metrics

### Monitor (Week 1-4)
- [ ] Check traffic daily for anomalies
- [ ] Look for traffic shift from non-www to www
- [ ] Monitor bounce rate and time-on-page
- [ ] Track conversion rates during migration

### Post-Migration (Week 4+)
- [ ] Confirm all traffic now on www domain
- [ ] Compare metrics: pre vs post migration
- [ ] Ensure no significant drops in traffic
- [ ] Document final metrics

---

## 🔧 Troubleshooting Checklist

### Redirects Not Working
- [ ] Verify Vercel deployment was successful
- [ ] Check DNS settings for domain
- [ ] Test with different browser (clear cache)
- [ ] Check Vercel logs for errors

### Sitemap Not Submitting
- [ ] Verify www property exists in GSC
- [ ] Confirm property is verified
- [ ] Check sitemap URL is accessible
- [ ] Try resubmitting after 1 hour

### URLs Not Indexing
- [ ] Check Coverage report for errors
- [ ] Use URL Inspection tool on sample pages
- [ ] Verify robots.txt allows crawling
- [ ] Check for noindex meta tags

### Search Traffic Dropping
- [ ] Wait at least 2 weeks for full migration
- [ ] Check if non-www traffic was redirecting
- [ ] Verify Analytics tracking both versions
- [ ] Monitor GSC Coverage for issues

---

## 📝 Documentation Review

Before deploying, ensure you have reviewed:
- [ ] `SITEMAP-SUBMISSION-READY.md` - Exact submission steps
- [ ] `GOOGLE-SEARCH-CONSOLE-SETUP.md` - Full GSC guide
- [ ] `WWW-MIGRATION-DOCUMENTATION.md` - Technical details
- [ ] `SITEMAP-MIGRATION-SUMMARY.md` - Overview

---

## 🎯 Success Criteria (Week 4)

By end of week 4, you should see:
- ✅ All 67 URLs indexed with www domain
- ✅ Old non-www URLs showing as redirects
- ✅ No significant traffic drops
- ✅ Search results showing www versions
- ✅ Analytics showing www domain traffic
- ✅ Sitemap status: "Success" in GSC
- ✅ Coverage report clean with no errors

---

## 📞 Quick Reference Links

- Google Search Console: https://search.google.com/search-console
- Sitemap Specification: https://www.sitemaps.org/
- 301 Redirect Info: https://en.wikipedia.org/wiki/HTTP_301
- GSC Help: https://support.google.com/webmasters

---

## 🎉 Completion Status

- [x] Sitemap updated (67 URLs)
- [x] Redirects configured
- [x] Documentation complete
- [x] Ready for deployment
- [ ] Deployed to production (pending)
- [ ] Submitted to Google Search Console (pending)
- [ ] Migration complete (4 weeks out)

---

**Document Version**: 1.0
**Created**: 2026-02-09
**Status**: Ready for Use
**Next Step**: Deploy to production → Submit to GSC → Monitor for 4 weeks

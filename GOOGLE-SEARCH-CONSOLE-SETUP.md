# Google Search Console Setup Guide - www.kenyalaw.co.ke

## Quick Start Checklist

### Phase 1: Add New Domain Property (5 minutes)
- [ ] Go to [Google Search Console](https://search.google.com/search-console)
- [ ] Click **"Add property"**
- [ ] Select **"URL prefix"** property type
- [ ] Enter: `https://www.kenyalaw.co.ke`
- [ ] Choose verification method (DNS recommended for consistency)
- [ ] Complete verification

### Phase 2: Submit Sitemap (2 minutes)
- [ ] In Search Console, go to **Sitemaps** (left sidebar)
- [ ] Click **"Add/test sitemap"**
- [ ] Enter: `https://www.kenyalaw.co.ke/sitemap.xml`
- [ ] Click **"Submit"**
- [ ] Verify status shows "Success" (may take 24-48 hours for full processing)

### Phase 3: Monitor Indexing (Ongoing)
- [ ] Check **Coverage** report daily for first week
- [ ] Look for **"Alternate page with proper redirect"** messages
- [ ] Monitor **URL Inspection** tool for sample URLs
- [ ] Expected: All www URLs should be indexed within 2-4 weeks

---

## Redirect Verification

### Test Redirects Before Submission
```bash
# Test non-www to www redirect
curl -I https://kenyalaw.co.ke/

# Expected Response:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.kenyalaw.co.ke/
```

### In Google Search Console
1. Go to **Sitemaps** → Your sitemap
2. Check **"Sitemap details"**
3. Look for URL samples showing www versions
4. Status should show indexed count increasing

---

## Expected Timeline

| Week | Action | Status |
|------|--------|--------|
| Week 1 | Submit www domain & sitemap | In Progress |
| Week 1-2 | Google crawls www URLs | Indexing |
| Week 2 | Monitor redirect processing | Processing Redirects |
| Week 2-3 | Old URLs show as redirects | Redirect Detected |
| Week 3-4 | Full consolidation to www | Complete |

---

## Key Metrics to Monitor

### In Google Search Console Dashboard:
1. **Coverage Report**
   - Valid: Should show all 67 www URLs
   - Excluded: Old non-www URLs (with redirect info)
   - Errors: Should be minimal

2. **URL Inspection Tool**
   - Test: https://www.kenyalaw.co.ke/occupational-health-safety-kenya
   - Expected: "URL is on Google" status
   - Canonical: Should point to www version

3. **Enhancements**
   - Sitemap: Verify all 67 URLs processed
   - Mobile-friendly: Should show all www URLs pass

---

## Common Issues & Solutions

### Issue: "Alternate page with proper redirect"
**Solution**: This is NORMAL during migration. Google is processing the redirect from non-www to www. Check back in 1-2 weeks.

### Issue: Sitemap shows old non-www URLs
**Solution**: 
1. Ensure you submitted the new www sitemap: https://www.kenyalaw.co.ke/sitemap.xml
2. Remove old sitemap from https://kenyalaw.co.ke/sitemap.xml
3. Wait 24-48 hours for reprocessing

### Issue: 404 errors on old www URLs
**Solution**: This is EXPECTED. Google is:
1. Finding old non-www URLs in its index
2. Following 301 redirects to www versions
3. Processing this may take 1-4 weeks

### Issue: Canonical URLs still pointing to non-www
**Solution**:
1. Check that HTML pages have: `<link rel="canonical" href="https://www.kenyalaw.co.ke/...">`
2. Update any hardcoded canonical links in templates
3. Redeploy and resubmit sitemap

---

## Domain Preferences Setting (Optional but Recommended)

1. In Google Search Console
2. Go to **Settings** (gear icon, bottom left)
3. Select **"Search properties"** → Your www.kenyalaw.co.ke property
4. Click **"Settings"**
5. Under **"Preferred domain"**, select: `https://www.kenyalaw.co.ke/`
6. Save

*Note: This helps Google understand your preferred domain format*

---

## URLs Submitted in Sitemap (67 Total)

**All URLs use canonical format:**
```
https://www.kenyalaw.co.ke/[page-slug]
```

**Sample high-priority URLs:**
- https://www.kenyalaw.co.ke/ (Priority 1.0)
- https://www.kenyalaw.co.ke/occupational-health-safety-kenya (Priority 1.0)
- https://www.kenyalaw.co.ke/employment-contracts-kenya (Priority 0.95)
- https://www.kenyalaw.co.ke/limited-company-registration-kenya (Priority 0.85)

*Full list available in: `public/sitemap.xml`*

---

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Sitemap Format Guide](https://www.sitemaps.org/protocol.html)
- [301 Redirect Best Practices](https://developers.google.com/search/docs/advanced/crawling/301-redirects)
- [URL Canonicalization Guide](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls)

---

## Support & Next Steps

**If you need to:**
- Monitor redirect progress: Check **Coverage** report weekly
- View sample URLs: Use **URL Inspection** tool for individual pages
- Fix indexing issues: Review error messages in **Coverage** report
- Verify redirect status: Run `curl -I https://kenyalaw.co.ke/` commands

**Timeline**: After submission, allow 2-4 weeks for full indexing of www domain and consolidation of all traffic from non-www URLs.

---

**Last Updated**: 2026-02-09
**Sitemap Status**: ✅ Ready for Google Search Console
**Redirects Status**: ✅ Configured and active

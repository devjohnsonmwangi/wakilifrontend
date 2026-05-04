# 📺 Google AdSense Implementation Guide - All Pages

**Status**: ✅ Ad components created and integrated  
**AdSense Publisher ID**: `ca-pub-5457373540838326`  
**Date**: May 4, 2026

---

## 🎯 What We've Set Up

### ✅ 5 Reusable Ad Components Created

```
src/components/ads/
├── AdBanner.tsx         (Horizontal banner ads 728x90, 970x90)
├── AdSidebar.tsx        (Vertical sidebar ads 300x600, 300x250)
├── AdSquare.tsx         (Medium rectangle 300x250)
├── AdResponsive.tsx     (Auto-responsive ads)
├── AdInfeed.tsx         (Native content ads)
└── index.ts             (Export all components)
```

### ✅ Already Added to Home Page
- AdBanner after Hero section
- AdSquare after About section
- AdResponsive after Services section
- AdBanner before Footer

---

## 🚀 How to Add Ads to Other Pages

### Quick Implementation (Copy-Paste)

**Step 1: Import at the top of your page component**

```tsx
import { AdBanner, AdSquare, AdResponsive, AdSidebar, AdInfeed } from "../../components/ads";
```

**Step 2: Add ads in your JSX where you want them**

```tsx
// Add banner ad
<section className="py-4 px-4">
  <AdBanner adSlot="1234567890" adFormat="horizontal" />
</section>

// Add square ad between content
<section className="py-4 px-4">
  <AdSquare adSlot="1234567891" />
</section>

// Add responsive ad
<section className="py-4 px-4">
  <AdResponsive adSlot="1234567892" />
</section>
```

---

## 📋 Ad Component Reference

### 1. AdBanner - Horizontal Banner Ads

**Best For**: Top/bottom of pages, between sections  
**Sizes**: 728x90, 970x90, 970x250  
**Usage**:

```tsx
import { AdBanner } from "../../components/ads";

<AdBanner 
  adSlot="1234567890"           // Your Google AdSense slot ID
  adFormat="horizontal"           // 'horizontal' | 'auto'
  className="my-custom-class"     // Optional custom CSS
/>
```

**Example Placements**:
- Below Hero section ✅ (Already done on Home)
- Between main content sections
- Before Footer

---

### 2. AdSidebar - Vertical Sidebar Ads

**Best For**: Right sidebar on article/blog pages  
**Sizes**: 300x600, 300x250  
**Usage**:

```tsx
import { AdSidebar } from "../../components/ads";

// In a grid layout with sidebar
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Main content */}
  <div className="md:col-span-2">
    {/* Your article content */}
  </div>
  
  {/* Sidebar with ads */}
  <div className="md:col-span-1">
    <AdSidebar adSlot="1234567894" />
  </div>
</div>
```

**Example Placements**:
- Legal article sidebars
- Service page sidebars
- Blog post sidebars

---

### 3. AdSquare - Medium Rectangle Ads

**Best For**: Between content sections  
**Size**: 300x250 (most common)  
**Usage**:

```tsx
import { AdSquare } from "../../components/ads";

<AdSquare 
  adSlot="1234567895"
  className="my-optional-class"
/>
```

**Example Placements**:
- Between FAQ sections ✅ (Already done on Home)
- Between testimonials
- Between service descriptions

---

### 4. AdResponsive - Auto-Responsive Ads

**Best For**: Mobile-friendly responsive design  
**Adapts to**: Any screen size  
**Usage**:

```tsx
import { AdResponsive } from "../../components/ads";

<AdResponsive 
  adSlot="1234567896"
  className="my-optional-class"
/>
```

**Example Placements**:
- Main content areas ✅ (Already done on Home)
- Before footer (responsive)
- Any flexible content area

---

### 5. AdInfeed - Native Content Ads

**Best For**: Between articles/posts, looks like native content  
**Usage**:

```tsx
import { AdInfeed } from "../../components/ads";

<AdInfeed 
  adSlot="1234567897"
  className="my-optional-class"
/>
```

**Example Placements**:
- Between blog posts
- Between FAQ items
- Between service cards

---

## 🔧 Step-by-Step: Add Ads to a Service Page

Let's say you want to add ads to `DivorceKenya.tsx`:

### Step 1: Open the file
```
src/pages/services/DivorceKenya.tsx
```

### Step 2: Import ad components at the top
```tsx
import { AdBanner, AdSquare, AdResponsive, AdSidebar } from "../../components/ads";
```

### Step 3: Find good placement spots and add ads

**Good spots**:
- After hero/title section
- Between major content sections
- After FAQ section
- Before final CTA/action section

**Example code**:

```tsx
// After title section
<h1>Divorce in Kenya</h1>
<p>Detailed introduction...</p>

{/* Add Banner Ad */}
<section className="py-4 px-4">
  <AdBanner adSlot="1234567890" />
</section>

{/* Main content section 1 */}
<h2>Step 1: Understanding Your Options</h2>
<p>Content here...</p>

{/* Add Square Ad */}
<section className="py-4 px-4">
  <AdSquare adSlot="1234567891" />
</section>

{/* Main content section 2 */}
<h2>Step 2: Filing for Divorce</h2>
<p>Content here...</p>

{/* Add another Banner Ad */}
<section className="py-4 px-4">
  <AdBanner adSlot="1234567892" />
</section>

{/* Continue with content... */}
```

### Step 4: Test
```bash
pnpm dev
# Navigate to the page and verify ads display
```

---

## 📊 Ad Slot IDs (Google AdSense)

Replace the placeholder slot IDs with your actual Google AdSense slot IDs. You can find these in your Google AdSense dashboard.

**Current slots used on Home page**:
- `1234567890` - Top banner (Hero)
- `1234567891` - Square (About)
- `1234567892` - Responsive (Services)
- `1234567893` - Bottom banner (Footer)

**To get your actual slot IDs**:
1. Go to: https://adsense.google.com/
2. Click **"Ads"** → **"Ad units"**
3. Create new ad units for different sizes
4. Copy the slot ID from each ad unit
5. Replace the placeholder IDs in your code

---

## 🎨 Best Practices for Ad Placement

### ✅ DO

- ✅ Place ads above the fold (visible without scrolling)
- ✅ Use responsive ads on mobile-first pages
- ✅ Add ads between logical content sections
- ✅ Test on mobile and desktop
- ✅ Space ads 300-500px apart
- ✅ Use matching ad sizes throughout site
- ✅ Place ads in natural reading flow

### ❌ DON'T

- ❌ Don't hide ads or make them too small
- ❌ Don't place ads too densely (max 3-4 per page)
- ❌ Don't distract from main content
- ❌ Don't use auto-rotating ads
- ❌ Don't mislead users about ad content
- ❌ Don't click your own ads
- ❌ Don't encourage ad clicks

---

## 📱 Responsive Ad Strategy

### Mobile (< 768px)
- Use `<AdResponsive />` or `<AdBanner />`
- 320x50 or 300x250 ads work best
- Avoid 728x90 banners on small screens

### Tablet (768px - 1024px)
- Can use medium rectangles (300x250)
- Use responsive ads

### Desktop (> 1024px)
- Use both horizontal (728x90, 970x90)
- Use vertical sidebars (300x600)
- Use large rectangles (970x250)

**Our components auto-handle responsive sizing!**

---

## 📋 Checklist for Adding Ads to All Pages

Use this checklist when adding ads to each page:

```
Page: ________________

□ Imported ad components
□ Added banner ad after hero/title
□ Added square ad between sections (if applicable)
□ Added responsive ad in main content
□ Added sidebar ad (if page has sidebar)
□ Verified ads display on mobile
□ Verified ads display on desktop
□ Tested click-through behavior
□ Verified no AdSense policy violations
□ Committed code to git
□ Tested on actual site
```

---

## 🚀 Quick Integration for All Pages

### Option 1: Manual (Recommended First Time)

Add ads to pages one by one using the steps above. Gives you flexibility and control.

**Time per page**: ~5-10 minutes  
**Total pages**: ~60+ pages  
**Total time**: ~6-12 hours

---

### Option 2: Create a Wrapper Component

If you have many similar pages, create a layout wrapper:

```tsx
// src/components/layouts/ServicePageLayout.tsx
import { AdBanner, AdSquare, AdResponsive } from "../ads";

interface ServicePageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const ServicePageLayout = ({ title, children }: ServicePageLayoutProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      
      {/* Top Ad */}
      <section className="py-4">
        <AdBanner adSlot="1234567890" />
      </section>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {children}
      </div>

      {/* Bottom Ad */}
      <section className="py-4">
        <AdResponsive adSlot="1234567892" />
      </section>
    </div>
  );
};
```

**Usage**:
```tsx
import { ServicePageLayout } from "../../components/layouts/ServicePageLayout";

const DivorceKenya = () => {
  return (
    <ServicePageLayout title="Divorce in Kenya">
      {/* Your content */}
    </ServicePageLayout>
  );
};
```

---

## 💰 Revenue Optimization

### Recommended Ad Count per Page
- **Short pages** (< 1000 words): 2-3 ads
- **Medium pages** (1000-2000 words): 3-4 ads
- **Long pages** (> 2000 words): 4-5 ads

### Highest CPM Placements (Best Revenue)
1. **Above the fold** (first ad visible without scroll)
2. **Between content sections** (natural reading flow)
3. **Sticky sidebar** (stays visible while scrolling)
4. **Before call-to-action** (right before user action)

### Our Current Setup ✅
✅ Home page: 4 ads positioned optimally
✅ Above-fold coverage
✅ Natural reading flow
✅ Mobile optimized

---

## 🔍 Testing & Debugging

### Verify Ads Display

1. **Check browser console** (F12)
   ```
   Should NOT see AdSense errors
   Should see ads loading
   ```

2. **Test with Google's Ad Preview Tool**
   - Go: https://adsense.google.com/
   - Use "Ad Preview & Diagnosis Tool"

3. **Use Google Rich Results Test**
   - Go: https://search.google.com/test/rich-results
   - Paste your page URL
   - Verify structured data includes ads

### Common Issues

**Problem**: Ads not showing  
**Solution**: 
- Verify AdSense script in index.html
- Check ad slot IDs are correct
- Clear browser cache
- Wait 30-60 seconds for ad serving

**Problem**: Console errors  
**Solution**:
- Check AdSense script loaded
- Verify page complies with AdSense policies
- Check ad slot format matches component

---

## 📈 Monitoring Performance

### Track Ad Performance
1. Go to: https://adsense.google.com/
2. Check **Performance Report**
   - RPM (Revenue Per Mille)
   - CTR (Click-Through Rate)
   - Impressions

### Optimize Based on Data
- If CTR is low: Reposition ads or use different formats
- If CPM is low: Ensure page quality (helps with AdSense)
- If impressions are low: Add more ads or get more traffic

---

## 📚 Complete List of Pages to Update

Priority pages to add ads (in order):

1. ✅ Home.tsx (DONE)
2. DivorceKenya.tsx
3. LandDisputesKenya.tsx
4. HowToRegisterBusinessKenya.tsx
5. EmploymentTerminationKenya.tsx
6. HowToWriteWillKenya.tsx
7. TenantRightsEvictionKenya.tsx
8. BusinessLicensesPermitsKenya.tsx
9. DebtRecoveryKenya.tsx
10. ContractReviewDraftingKenya.tsx

**Remaining pages** (60+): Follow same pattern

---

## ✨ Summary

**What we created**:
- ✅ 5 reusable ad components
- ✅ Integrated ads into Home page
- ✅ Created this comprehensive guide
- ✅ Provided multiple integration methods

**Next steps**:
1. Create Google AdSense slot IDs (if not done)
2. Replace placeholder IDs with your actual ones
3. Add ads to top 10 priority pages
4. Test thoroughly
5. Monitor performance
6. Expand to remaining pages

**Time estimate**:
- Top 10 pages: 1-2 hours
- All pages: 6-12 hours
- Total with testing: 10-15 hours

---

## 🎉 You're All Set!

Your application now has:
- ✅ Google AdSense properly configured in index.html
- ✅ 5 flexible, reusable ad components
- ✅ Ads integrated into Home page
- ✅ Complete implementation guide

**Start adding ads to more pages using the patterns shown above!**

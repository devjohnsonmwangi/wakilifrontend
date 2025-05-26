// src/components/help/HelpCenter.tsx
import React, { useState, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, Search, ChevronDown, ChevronUp, UserCircle, Settings, CreditCard,
  FileText, AlertTriangle, BookOpen, LifeBuoy, KeyRound, MailCheck, ShieldQuestion,
  Users, DollarSign, RefreshCw, PauseCircle, Info, SearchCode, Keyboard, UploadCloud,
  Share2, Smartphone, History, Globe, Bug, Newspaper, ShieldAlert, Lock, Users2,
  BarChart3, SlidersHorizontal, Zap, Network, PackageSearch, Puzzle, UserCog, Archive,
  FileLock2, HelpCircle
} from 'lucide-react';

// Map of icon names (strings) to Lucide components for dynamic rendering
const iconComponents: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Phone, Mail, Search, ChevronDown, ChevronUp, UserCircle, Settings, CreditCard,
  FileText, AlertTriangle, BookOpen, LifeBuoy, KeyRound, MailCheck, ShieldQuestion,
  Users, DollarSign, RefreshCw, PauseCircle, Info, SearchCode, Keyboard, UploadCloud,
  Share2, Smartphone, History, Globe, Bug, Newspaper, ShieldAlert, Lock, Users2,
  BarChart3, SlidersHorizontal, Zap, Network, PackageSearch, Puzzle, UserCog, Archive,
  FileLock2, HelpCircle
};

interface HelpItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
}

const helpContent: HelpItem[] = [
  // --- Account Management ---
  {
    id: 'acc-reset-pass',
    category: "Account Management",
    question: "How do I reset my password?",
    answer: "[ICON:KeyRound] To reset your password, go to the login page and click 'Forgot Password?'. Enter your registered email. Follow instructions in the email. Check spam/junk folder. If you don't receive it within 15 minutes, ensure your email is correct or contact support.",
    keywords: ["forgot", "lost password", "login help", "password recovery"],
  },
  {
    id: 'acc-update-profile',
    category: "Account Management",
    question: "How can I update my profile information (name, phone, address)?",
    answer: "[ICON:UserCircle] Navigate to 'Account Settings' (often via user menu/avatar). Find 'Profile Details' or 'Personal Information'. Edit, then click 'Save Changes'. Some changes, like legal name, might require verification.",
    keywords: ["personal details", "contact info", "change name", "edit profile"],
  },
  {
    id: 'acc-change-email',
    category: "Account Management",
    question: "How do I change my account's primary email address?",
    answer: "[ICON:MailCheck] In 'Account Settings', find 'Email Address' or 'Login Details'. You'll likely need to enter your current password and then verify the new email address via a confirmation link sent to it.",
    keywords: ["update email", "login email", "primary email"],
  },
  {
    id: 'acc-manage-notifications',
    category: "Account Management",
    question: "How do I manage email, SMS, or in-app notifications?",
    answer: "Go to 'Account Settings' > 'Notifications' or 'Communication Preferences'. You can typically toggle specific notification types (e.g., product updates, billing alerts, activity summaries) on/off for different channels (email, in-app, SMS if enabled).",
    keywords: ["alerts", "updates", "communication settings", "stop emails"],
  },
  {
    id: 'acc-delete-account',
    category: "Account Management",
    question: "How can I permanently delete my account and data?",
    answer: "Account deletion is permanent and irreversible. To request deletion, please contact support. They will guide you through the process, which may involve identity verification and confirmation of data erasure according to our policies.",
    keywords: ["close account", "remove account", "cancel permanently", "data erasure"],
  },
  {
    id: 'acc-2fa-setup',
    category: "Account Management",
    question: "How do I set up Two-Factor Authentication (2FA/MFA)?",
    answer: "[ICON:ShieldAlert] In 'Account Settings' > 'Security', enable 2FA. You'll typically scan a QR code with an authenticator app (e.g., Google Authenticator, Authy, Microsoft Authenticator) or opt for SMS codes (if available). Save your backup codes securely!",
    keywords: ["multi-factor", "mfa", "security setup", "login approval", "authenticator app"],
  },
  {
    id: 'acc-2fa-reset',
    category: "Account Management",
    question: "I've lost my 2FA device/codes. How can I regain access?",
    answer: "If you saved your backup/recovery codes, use one to log in and then reset your 2FA with a new device. If you don't have backup codes, contact support. Identity verification will be required, which can take time.",
    keywords: ["2fa locked out", "authenticator app issue", "lost phone 2fa", "backup codes"],
  },
  {
    id: 'acc-unauthorized-access',
    category: "Account Management",
    question: "What should I do if I suspect unauthorized access to my account?",
    answer: "[ICON:ShieldQuestion] 1. Immediately change your password to a strong, unique one. 2. Enable/Re-configure 2FA. 3. Review account activity log ([ICON:History] login history, recent actions). 4. Revoke access for any unrecognized devices/sessions in 'Security Settings'. 5. Contact support with details.",
    keywords: ["hacked", "compromised", "security breach", "unusual activity"],
  },
  {
    id: 'acc-security-best-practices',
    category: "Account Management",
    question: "What are critical security best practices for my account?",
    answer: "[ICON:Lock] Use a strong, unique password manager-generated password. Enable 2FA. Be vigilant against phishing attempts (check sender email, links). Do not share credentials. Regularly review account activity. Keep your OS and browser updated.",
    keywords: ["secure account", "protect account", "password tips", "phishing awareness"],
  },
  {
    id: 'acc-session-management',
    category: "Account Management",
    question: "How can I see and manage my active login sessions?",
    answer: "In 'Account Settings' > 'Security' or 'Active Sessions', you can often see a list of devices and locations where your account is currently logged in. You should be able to log out specific sessions remotely if you see suspicious activity.",
    keywords: ["active logins", "logged in devices", "remote logout"],
  },
  {
    id: 'acc-user-roles-permissions',
    category: "Account Management",
    question: "How do user roles and permissions work (if I'm on a team plan)?",
    answer: "[ICON:Users2] If your plan supports multiple users, administrators can assign roles (e.g., Admin, Member, Viewer) in the 'Team Management' or 'Users' section. Each role has predefined permissions controlling access to features and data. Custom roles might be available on higher-tier plans.",
    keywords: ["team access", "user privileges", "admin rights", "manage users"],
  },

  // --- Billing & Subscriptions ---
  {
    id: 'bill-update-payment',
    category: "Billing & Subscriptions",
    question: "How do I update or change my primary payment method?",
    answer: "Go to 'Account Settings' > 'Billing' or 'Subscription'. Select 'Update Payment Method' or 'Add Card'. Enter new details. Ensure the card is valid, has sufficient funds, and is authorized for online/recurring payments.",
    keywords: ["credit card", "payment details", "change card", "billing info"],
  },
  {
    id: 'bill-accepted-methods',
    category: "Billing & Subscriptions",
    question: "What payment methods do you accept (cards, PayPal, bank transfer)?",
    answer: "We accept major credit/debit cards (Visa, MasterCard, Amex). PayPal may be an option in some regions. For enterprise plans, bank transfers (ACH/Wire) might be supported. Check the 'Billing' section or contact sales for specifics.",
    keywords: ["paypal", "amex", "visa", "mastercard", "payment options", "ach", "wire"],
  },
  {
    id: 'bill-view-invoices',
    category: "Billing & Subscriptions",
    question: "Where can I find and download my past invoices or payment history?",
    answer: "Invoices are in 'Account Settings' > 'Billing' > 'Invoice History' or 'Payment History'. They are typically available in PDF format. You can see dates, amounts, and subscription details.",
    keywords: ["receipts", "billing history", "charges", "download invoice"],
  },
  {
    id: 'bill-upgrade-downgrade',
    category: "Billing & Subscriptions",
    question: "How do I upgrade, downgrade, or change my subscription plan?",
    answer: "In 'Account Settings' > 'Subscription' or 'Manage Plan'. Select 'Change Plan'. Upgrades are often prorated and immediate. Downgrades usually apply at the end of the current billing cycle. Be aware of feature changes between plans.",
    keywords: ["change plan", "subscription tier", "modify subscription"],
  },
  {
    id: 'bill-failed-payment',
    category: "Billing & Subscriptions",
    question: "My payment failed. What should I do? Will my service be interrupted?",
    answer: "You'll get an email notification. Update your payment method in 'Billing' settings promptly. We usually offer a grace period (e.g., 3-7 days) before service interruption or account suspension. Check the notification for specific deadlines.",
    keywords: ["payment declined", "card expired", "billing error", "service suspension"],
  },
  {
    id: 'bill-cancel-subscription',
    category: "Billing & Subscriptions",
    question: "How do I cancel my subscription? What happens after cancellation?",
    answer: "In 'Account Settings' > 'Subscription', find 'Cancel Subscription'. Follow prompts. Cancellation usually takes effect at the end of your current paid period. Data retention policies post-cancellation are in our Terms of Service.",
    keywords: ["stop subscription", "end plan", "terminate service"],
  },
  {
    id: 'bill-refund-policy',
    category: "Billing & Subscriptions",
    question: "What is your refund policy for subscriptions or one-time purchases?",
    answer: "[ICON:DollarSign] Our refund policy is in our Terms of Service. Generally, subscriptions are non-refundable unless specified otherwise (e.g., a money-back guarantee period for new users). For specific cases, contact support.",
    keywords: ["money back", "cancellation fee", "refund request"],
  },
  {
    id: 'bill-pause-subscription',
    category: "Billing & Subscriptions",
    question: "Can I pause my subscription temporarily instead of canceling?",
    answer: "[ICON:PauseCircle] Some plans might allow pausing for 1-3 months. Check 'Subscription Management' or contact support. If paused, you won't be billed, and access might be limited or read-only during the pause.",
    keywords: ["hold subscription", "temporary stop", "suspend billing"],
  },
  {
    id: 'bill-proration',
    category: "Billing & Subscriptions",
    question: "How does proration work if I upgrade or downgrade mid-cycle?",
    answer: "Upgrades: You're typically charged a prorated amount for the remainder of the current cycle for the new plan, and your billing date might adjust. Downgrades: Often, no refund for the current cycle; the new lower rate applies from the next billing cycle.",
    keywords: ["prorated charges", "mid-cycle changes", "billing adjustment"],
  },
  {
    id: 'bill-sales-tax-vat',
    category: "Billing & Subscriptions",
    question: "Why am I being charged sales tax/VAT? How can I provide my tax ID?",
    answer: "Sales tax or VAT is applied based on your billing address and local regulations. If you're tax-exempt or have a VAT ID, there's usually a field in the 'Billing Information' section to enter it. Ensure it's correctly formatted.",
    keywords: ["tax", "vat", "gst", "tax exemption", "vat id"],
  },

  // --- Platform Features In-Depth ---
  {
    id: 'feat-dashboard-overview',
    category: "Platform Features In-Depth",
    question: "Can you give me an overview of the main dashboard and its widgets?",
    answer: "The main dashboard provides a snapshot of your key activities and data. Common widgets include recent projects, upcoming tasks, performance metrics ([ICON:BarChart3]), notifications, and quick access links. Many dashboards are customizable - look for a 'Customize' or 'Edit Widgets' button.",
    keywords: ["main page", "home screen", "widgets", "data summary", "analytics overview"],
  },
  {
    id: 'feat-creating-item',
    category: "Platform Features In-Depth",
    question: "What are the steps to create and configure a new [Project/Case/Document]?",
    answer: "[ICON:FileText] 1. Navigate to the relevant section (e.g., 'Projects'). 2. Click 'Create New' or '+'. 3. Fill in required fields (name, description, dates). 4. Configure advanced options (e.g., assign users, set privacy, add tags). 5. Save. Templates might be available for common types.",
    keywords: ["add new", "start project", "initiate case", "document setup", "item configuration"],
  },
  {
    id: 'feat-managing-tasks',
    category: "Platform Features In-Depth",
    question: "How do I manage tasks, subtasks, deadlines, and assignments?",
    answer: "Tasks can usually be created within projects or as standalone items. Features often include setting due dates, assigning to team members, adding descriptions/attachments, creating subtasks, setting priorities, and tracking progress (e.g., to-do, in-progress, completed).",
    keywords: ["to-do list", "task management", "sub-tasks", "due dates", "assign tasks", "Gantt chart"],
  },
  {
    id: 'feat-collaboration-tools',
    category: "Platform Features In-Depth",
    question: "What collaboration tools are available (comments, mentions, sharing)?",
    answer: "Most platforms offer in-app commenting on items (projects, tasks, documents). You can often @mention team members to notify them. Sharing options ([ICON:Share2]) might include inviting external collaborators (with specific permissions) or generating shareable links.",
    keywords: ["teamwork", "comments", "user mentions", "sharing files", "guest access"],
  },
  {
    id: 'feat-reporting-analytics',
    category: "Platform Features In-Depth",
    question: "How can I generate reports or view analytics for my activities?",
    answer: "[ICON:BarChart3] Look for a 'Reports' or 'Analytics' section. You can often generate pre-defined reports (e.g., project progress, user activity, time tracking) or build custom reports by selecting metrics, date ranges, and filters. Data can usually be exported (CSV, PDF).",
    keywords: ["data analysis", "metrics", "performance tracking", "custom reports", "export reports"],
  },
  {
    id: 'feat-search-filtering',
    category: "Platform Features In-Depth",
    question: "What are the advanced search and filtering capabilities?",
    answer: "[ICON:SearchCode] Beyond basic keyword search, look for advanced filters (by date, user, status, tags, custom fields). Boolean operators (AND, OR, NOT) and exact phrase matching (using \"quotes\") might be supported. Saved searches/filters are often available.",
    keywords: ["find data", "advanced search", "filter results", "boolean search", "saved views"],
  },
  {
    id: 'feat-integrations-setup',
    category: "Platform Features In-Depth",
    question: "How do I set up and manage integrations with other apps (e.g., Slack, Google Drive, Zapier)?",
    answer: "[ICON:Zap] Go to 'Settings' > 'Integrations' or 'Apps'. Select the app you want to connect. You'll usually need to authorize access by logging into the third-party app and granting permissions. Configuration options vary per integration.",
    keywords: ["connect apps", "third-party tools", "API connections", "automation", "Zapier", "Slack"],
  },
  {
    id: 'feat-custom-fields',
    category: "Platform Features In-Depth",
    question: "Can I add custom fields to my [Projects/Tasks/Contacts]?",
    answer: "[ICON:Settings] Many platforms allow adding custom fields (e.g., text, number, date, dropdown) to better tailor data capture to your needs. Look for this option in 'Settings' or when editing an item type template. This is often a feature of higher-tier plans.",
    keywords: ["customize fields", "add data fields", "metadata", "tailor platform"],
  },
  {
    id: 'feat-templates',
    category: "Platform Features In-Depth",
    question: "How do I use or create templates for [Projects/Documents/Workflows]?",
    answer: "Templates can save time by pre-filling common structures or content. Look for a 'Templates' section or an option to 'Save as Template' when creating/editing an item. You can then use these templates when starting new items.",
    keywords: ["project templates", "document templates", "workflow automation", "reusable content"],
  },
  {
    id: 'feat-version-history',
    category: "Platform Features In-Depth",
    question: "Is there version history or an audit trail for changes to [Documents/Items]?",
    answer: "[ICON:History] Many systems keep a version history for documents or key data items, allowing you to see past versions and potentially revert changes. An audit trail often logs who made what change and when. Check item details or 'Activity' tabs.",
    keywords: ["revision history", "track changes", "audit log", "restore previous version"],
  },
  {
    id: 'feat-data-import-export',
    category: "Platform Features In-Depth",
    question: "What are the options for importing and exporting my data?",
    answer: "Data import (e.g., from CSV, Excel) is often available for bulk adding items. Export options (CSV, Excel, PDF, JSON) allow you to get your data out. Look for 'Import/Export' tools in 'Settings' or relevant sections. Full account export might be available.",
    keywords: ["bulk upload", "migrate data", "download data", "backup data", "CSV import"],
  },
  {
    id: 'feat-accessibility-features',
    category: "Platform Features In-Depth",
    question: "What accessibility features (e.g., keyboard navigation, screen reader support) are available?",
    answer: "We aim to comply with WCAG guidelines. Features often include [ICON:Keyboard] keyboard navigation, ARIA labels for screen readers, sufficient color contrast, and resizable text. If you encounter accessibility issues, please report them to support.",
    keywords: ["a11y", "WCAG", "screen reader", "keyboard only", "disability access"],
  },
  {
    id: 'feat-mobile-access',
    category: "Platform Features In-Depth",
    question: "Is there a mobile app or mobile-friendly version of the site?",
    answer: "[ICON:Smartphone] Our platform is designed to be responsive and accessible on modern mobile browsers.Click on   download app  button to  get  our  app.Our  application is  PWA designed  for  crossplatform  compactbility   . If a dedicated mobile app (iOS/Android) is available, you'll find links on our website or in app stores.",
    keywords: ["iphone app", "android app", "on the go", "responsive design"],
  },
  {
    id: 'feat-customize-dashboard',
    category: "Platform Features In-Depth",
    question: "How do I customize my dashboard or workspace appearance/layout?",
    answer: "[ICON:SlidersHorizontal] You can often customize your dashboard layout and widgets from 'Dashboard Settings' or a 'Customize' option on the dashboard itself. Drag and drop widgets, add new ones, or remove those you don't need. Appearance settings like theme (dark/light) might also be available.",
    keywords: ["personalize", "widgets", "layout", "theme", "dark mode", "dashboard settings"],
  },
  {
    id: 'feat-archive-items',
    category: "Platform Features In-Depth",
    question: "How do I archive or unarchive items like projects or documents?",
    answer: "[ICON:Archive] To archive an item, typically select it and look for an 'Archive' option in a menu or action bar. Archived items are hidden from active views but not permanently deleted. There's usually an 'Archived Items' section where you can view and unarchive them.",
    keywords: ["hide item", "store old data", "unarchive", "restore archived"],
  },
  {
    id: 'feat-document-security',
    category: "Platform Features In-Depth",
    question: "How are my uploaded documents secured within the platform?",
    answer: "[ICON:FileLock2] Documents are typically secured using encryption at rest and in transit. Access controls ensure only authorized users can view or edit them. Regular security audits and compliance with standards like SOC 2 (if applicable) further protect your data. Refer to our Security Policy for details.",
    keywords: ["file security", "encryption", "data protection documents", "secure storage"],
  },
  {
    id: 'feat-language-options',
    category: "Platform Features In-Depth",
    question: "Are there language options or international support available?",
    answer: "[ICON:Globe] Our platform may support multiple languages. Look for a language selector in your 'Account Settings' or the website footer. International support details, including time zone settings, can also be found in 'Account Settings'.",
    keywords: ["translation", "multi-language", "internationalization", "locale", "timezone"],
  },


  // --- Troubleshooting Specific Scenarios ---
  {
    id: 'ts-login-loop',
    category: "Troubleshooting Specific Scenarios",
    question: "I'm stuck in a login loop or keep getting redirected to the login page.",
    answer: "1. Clear browser cookies and cache specifically for our site. 2. Try an incognito/private browsing window. 3. Ensure your browser accepts third-party cookies (if our login uses them). 4. Disable VPN or browser extensions temporarily. 5. Check if your system clock is accurate.",
    keywords: ["login problem", "redirect loop", "can't sign in", "cookie issue"],
  },
  {
    id: 'ts-file-upload-fail',
    category: "Troubleshooting Specific Scenarios",
    question: "My file upload is failing or getting stuck. What can I check?",
    answer: "[ICON:UploadCloud] 1. Check file size against limits. 2. Ensure file type is supported (e.g., PDF, DOCX, JPG). 3. Check your internet connection stability. 4. Try a different browser. 5. Ensure the filename doesn't contain special characters. 6. Disable ad-blockers temporarily.",
    keywords: ["upload error", "file not attaching", "attachment problem", "storage issue"],
  },
  {
    id: 'ts-slow-performance-specific-page',
    category: "Troubleshooting Specific Scenarios",
    question: "The platform is generally fast, but one specific page or feature is very slow.",
    answer: "[ICON:Network] This could be due to large amounts of data on that page or a specific network issue. 1. Try applying filters to reduce data shown. 2. Check if there are known issues for that feature on our status page. 3. Report to support with details of the slow page and any console errors (F12 in browser).",
    keywords: ["page lag", "feature slow", "performance bottleneck", "data loading issue", "connectivity"],
  },
  {
    id: 'ts-email-notif-delayed',
    category: "Troubleshooting Specific Scenarios",
    question: "Email notifications are significantly delayed or not arriving.",
    answer: "1. Check spam/junk and other filtered folders (Promotions, Social). 2. Add our sending domains to your email provider's safe sender list. 3. Verify your notification settings in-app. 4. There might be temporary email delivery delays; check our status page. 5. Contact support if persistent.",
    keywords: ["late emails", "missing notifications", "email delivery issue", "spam filter"],
  },
  {
    id: 'ts-integration-not-syncing',
    category: "Troubleshooting Specific Scenarios",
    question: "My integration with [Third-Party App] is not syncing data correctly.",
    answer: "[ICON:RefreshCw] 1. Go to 'Integrations' settings and check the status. Is it connected? 2. Try disconnecting and reconnecting the integration. 3. Check for error messages in the integration logs (if available). 4. Ensure permissions granted to the integration are still valid. 5. Check if the third-party app has API limits or issues.",
    keywords: ["sync error", "integration broken", "app connection failed", "data not transferring"],
  },
  {
    id: 'ts-unexpected-error-message',
    category: "Troubleshooting Specific Scenarios",
    question: "I received an unexpected error message: '[Specific Error Code/Text]'. What does it mean?",
    answer: "Generic steps: 1. Refresh the page. 2. Try the action again. 3. Note the exact error message and what you were doing. If the error isn't listed in our known issues/FAQ, contact support with this information. Screenshots are very helpful.",
    keywords: ["error code", "system error", "platform bug", "unknown issue", "crash"],
  },
  {
    id: 'ts-browser-compatibility-issue',
    category: "Troubleshooting Specific Scenarios",
    question: "A feature looks broken or doesn't work in my browser, but works in another.",
    answer: "1. Ensure your browser is updated to the latest version. 2. Try disabling browser extensions one by one, as they can interfere. 3. Clear browser cache and cookies for our site. 4. Report the issue to support, specifying your browser name and version.",
    keywords: ["browser bug", "display error", "UI glitch", "extension conflict", "css error"],
  },
  {
    id: 'ts-data-not-saving',
    category: "Troubleshooting Specific Scenarios",
    question: "I'm trying to save changes, but it's not working or I get an error.",
    answer: "1. Check your internet connection. 2. Ensure all required fields are filled correctly. 3. Look for specific error messages near the save button or form fields. 4. Try saving in smaller chunks if it's a large amount of data. 5. Open browser console (F12) for error messages to provide to support.",
    keywords: ["save failed", "update error", "form submission problem", "data persistence issue"],
  },

  // --- Technical Issues (General) ---
  {
    id: 'tech-encounter-error',
    category: "Technical Issues",
    question: "What are general troubleshooting steps if I encounter an error or unexpected behavior?",
    answer: "1. [ICON:RefreshCw] Refresh page. 2. Clear browser cache/cookies. 3. Try incognito/private window. 4. Try a different browser. 5. Check our status page for outages. 6. Disable VPN/proxy. 7. Restart your computer/device. 8. If persistent, note error messages, steps to reproduce, and contact support.",
    keywords: ["bug", "glitch", "site not working", "problem", "general troubleshooting"],
  },
  {
    id: 'tech-slow-performance',
    category: "Technical Issues",
    question: "The entire platform is running slow. What can I do?",
    answer: "1. Test your internet speed (e.g., fast.com). 2. Clear browser cache. 3. Disable resource-heavy browser extensions. 4. Close other apps/tabs consuming bandwidth/CPU. 5. Check our status page for platform-wide issues. 6. If isolated to your network, check router/modem.",
    keywords: ["lag", "loading issue", "speed problem", "slow website", "performance"],
  },
  {
    id: 'tech-browser-compatibility',
    category: "Technical Issues",
    question: "Which web browsers and versions are officially supported?",
    answer: "We support the latest stable versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari. Using older versions or less common browsers may result in degraded performance or display issues. Keep your browser updated.",
    keywords: ["supported browsers", "chrome", "firefox", "safari", "edge", "browser versions"],
  },
  {
    id: 'tech-status-page',
    category: "Technical Issues",
    question: "Do you have a status page for system outages or maintenance?",
    answer: "Yes, we maintain a status page at status.example.com (replace with actual URL). You can check it for real-time information on system performance, scheduled maintenance, and incident reports.",
    keywords: ["system status", "outage updates", "maintenance schedule", "platform availability"],
  },
  
  // --- General & Feedback ---
  {
    id: 'general-contact-support',
    category: "General & Feedback",
    question: "What's the best way to contact support and what information should I provide?",
    answer: "1. Via 'Contact Support' link (often includes diagnostic info). 2. Email: support@example.com. 3. Phone: 0112810203. Provide: Your account email, detailed description of issue, steps to reproduce, screenshots/videos, error messages, browser/OS details.",
    keywords: ["help desk", "customer service", "assistance", "support ticket", "technical help"],
  },
  {
    id: 'general-submit-feedback',
    category: "General & Feedback",
    question: "How can I submit feedback, suggest a new feature, or report a minor bug?",
    answer: "We love feedback! Use the 'Feedback' form in-app, email feedback@example.com, or join our community forum (if available). For bugs, provide steps to reproduce. For features, explain the use case.",
    keywords: ["suggestion box", "feature request", "report issue", "product idea", "improvement"],
  },
  {
    id: 'general-data-privacy',
    category: "General & Feedback",
    question: "How is my data protected? Where can I find your Privacy Policy and ToS?",
    answer: "Data security is paramount. Our Privacy Policy and Terms of Service (ToS) are linked in the website footer and often in 'Account Settings'. They detail data collection, usage, protection measures (encryption, access controls), and compliance (GDPR, CCPA).",
    keywords: ["security policy", "gdpr", "ccpa", "confidentiality", "terms and conditions", "data protection"],
  },
  {
    id: 'general-tutorials-guides',
    category: "General & Feedback",
    question: "Where can I find tutorials, user guides, or video walkthroughs?",
    answer: "[ICON:Info] Check for 'Resources', 'Guides', 'Learn', 'Academy', or 'Knowledge Base' sections on our website or in-app. We often provide onboarding guides, feature tutorials, best practice articles, and video content.",
    keywords: ["documentation", "training materials", "how-to videos", "user manual", "knowledge base"],
  },
  {
    id: 'general-release-notes',
    category: "General & Feedback",
    question: "Where can I find information about new features, improvements, or platform updates (release notes)?",
    answer: "[ICON:Newspaper] Look for a 'What's New', 'Changelog', 'Release Notes', or 'Product Updates' section on our blog or in-app. We announce significant updates there. You might also receive email summaries if opted-in.",
    keywords: ["changelog", "new features", "product updates", "version history", "latest changes"],
  },
  {
    id: 'general-community-forum',
    category: "General & Feedback",
    question: "Is there a community forum where I can ask questions or share tips with other users?",
    answer: "[ICON:Users] Some platforms have a community forum. Check our website for a 'Community' or 'Forum' link. It's a great place to learn from others, share solutions, and connect with fellow users.",
    keywords: ["user forum", "discussion board", "peer support", "community help"],
  },
];


const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  const formatAnswer = (text: string) => {
    const parts = text.split(/(\[ICON:[A-Za-z0-9]+\])/g);
    const elements = parts.map((part, index) => {
      if (part.startsWith('[ICON:') && part.endsWith(']')) {
        const iconName = part.substring(6, part.length - 1);
        const IconComponent = iconComponents[iconName];
        if (IconComponent) {
          // Render the icon component
          return <IconComponent key={index} className="inline-block w-4 h-4 mr-1.5 align-text-bottom text-teal-600 dark:text-teal-400" />;
        }
        return part; // Fallback if icon name is wrong or not in map
      }
      // Basic link detection
      const urlRegex = /(https?:\/\/[^\s"'(<]+)/g;
      const linkParts = part.split(urlRegex);
      return linkParts.map((linkPart, linkIndex) => {
        if (linkPart.match(urlRegex)) {
          return <a key={`${index}-${linkIndex}`} href={linkPart} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">{linkPart}</a>;
        }
        // Handle newlines by splitting and inserting <br />
        const newlineParts = linkPart.split(/\n/g);
        return newlineParts.map((nlPart, nlIndex) => (
          <Fragment key={`${index}-${linkIndex}-${nlIndex}`}>
            {nlPart}
            {nlIndex < newlineParts.length - 1 && <br />}
          </Fragment>
        ));
      });
    });
    return elements;
  };

  return (
    <li className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-md"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200">{question}</h3>
        {isOpen ? <ChevronUp size={20} className="text-teal-500 dark:text-teal-400" /> : <ChevronDown size={20} className="text-slate-500 dark:text-slate-400" />}
      </button>
      {isOpen && (
        <div className="px-2 pb-4 text-slate-600 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
          <p>{formatAnswer(answer)}</p>
        </div>
      )}
    </li>
  );
};

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredContent = useMemo(() => {
    if (!searchTerm.trim()) {
      return helpContent;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return helpContent.filter(item =>
      item.question.toLowerCase().includes(lowerSearchTerm) ||
      item.answer.replace(/\[ICON:[A-Za-z0-9]+\]/g, '').toLowerCase().includes(lowerSearchTerm) ||
      item.category.toLowerCase().includes(lowerSearchTerm) ||
      (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [searchTerm]);

  const categorizedContent = useMemo(() => {
    const categoriesOrder = [
        "Account Management",
        "Billing & Subscriptions",
        "Platform Features In-Depth",
        "Troubleshooting Specific Scenarios",
        "Technical Issues",
        "General & Feedback",
    ];

    const grouped = filteredContent.reduce<Record<string, HelpItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    const orderedGrouped: Record<string, HelpItem[]> = {};
    for (const categoryName of categoriesOrder) {
        if (grouped[categoryName]) {
            orderedGrouped[categoryName] = grouped[categoryName];
        }
    }
    for (const categoryName in grouped) {
        if (!orderedGrouped[categoryName]) {
            orderedGrouped[categoryName] = grouped[categoryName];
        }
    }
    return orderedGrouped;

  }, [filteredContent]);

  const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    "Account Management": UserCog,
    "Billing & Subscriptions": CreditCard,
    "Platform Features In-Depth": Puzzle,
    "Troubleshooting Specific Scenarios": Bug,
    "Technical Issues": AlertTriangle,
    "General & Feedback": HelpCircle,
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <HelpCircle size={48} className="mx-auto text-teal-600 dark:text-teal-400 mb-4" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Wakili App Help Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto">
            We've gathered extensive information to help you. Search below or browse by category.
            If you can't find Help, our support team is ready to assist. Click  on  install  app  button  to  get  our  app  if  you  haven't
          </p>
        </header>

        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Describe your issue or question (e.g., 'reset password', 'invoice query', 'upload failed')"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 shadow-sm transition-shadow hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {Object.keys(categorizedContent).length > 0 ? (
          Object.entries(categorizedContent).map(([category, items]) => {
            const CategoryIcon = categoryIcons[category] || BookOpen;
            return (
              <section key={category} className="mb-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <CategoryIcon width={28} height={28} className="text-teal-500 dark:text-teal-400 mr-3 flex-shrink-0" />
                  <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-100">{category}</h2>
                </div>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <FAQItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={!!openItems[item.id]}
                      onClick={() => toggleItem(item.id)}
                    />
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          <div className="text-center text-slate-600 dark:text-slate-300 p-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <PackageSearch size={56} className="mx-auto text-slate-400 dark:text-slate-500 mb-6" />
            <p className="text-2xl font-semibold mb-3">No results found for "<strong>{searchTerm}</strong>".</p>
            <p className="mb-2">Tips for finding what you need:</p>
            <ul className="list-disc list-inside text-left inline-block mb-6 text-slate-500 dark:text-slate-400">
              <li>Try using different or more general keywords.</li>
              <li>Check for spelling errors.</li>
              <li>Browse the categories above if your search was too specific.</li>
            </ul>
            <p className="mt-4">If you've tried these and still can't find an answer:</p>
            <Link
              to="/contactus"
              className="inline-flex items-center mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-6 rounded-lg transition-colors text-lg font-medium shadow-md hover:shadow-lg"
            >
              <Mail size={20} className="mr-2"/> Contact Our Support Team
            </Link>
          </div>
        )}

        <section className="mt-16 p-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-center">Need More Help?</h2>
          <p className="text-lg text-teal-50 mb-6 text-center max-w-xl mx-auto">
            Our extensive Help Center aims to cover most queries, but if you're stuck or need personalized assistance, our support experts are here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="tel:0112810203" className="flex items-center bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg text-lg">
              <Phone size={22} className="text-white mr-2.5" />
              0112810203
            </a>
            <a href="mailto:supportwakili@gmail.com" className="flex items-center bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg text-lg">
              <Mail size={22} className="text-white mr-2.5" />
              supportwakili@gmail.com
            </a>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/dashboard/mytickets"
              className="inline-flex items-center bg-white text-teal-600 hover:bg-teal-50 transition-colors py-3 px-8 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg"
            >
             <LifeBuoy size={20} className="mr-2"/> Open a Support Ticket
            </Link>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Wakili Inc. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link> | <Link to="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link> | <Link to="/contactus" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Us</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HelpCenter;
import { FC } from 'react';
import { Cookie, Settings, Info, CheckCircle, BarChart2, Zap, Globe } from 'lucide-react'; // Example icons

// --- Navbar Import (Optional) ---
import Navbar from '../components/navbar/Navbar'; // Adjust path if needed
import { Link } from 'react-router-dom';

const CookiePolicyPage: FC = () => {
  const lastUpdatedDate = "Always  updated for  your   safety cookies policy  are  optional"; // CHANGE THIS TO THE ACTUAL DATE
  const appName = "Wakili Application";
  const companyWebsite = "https://www.wakiliapp.com"; // CHANGE THIS
  const supportEmail = "privacy@wakiliapp.com"; // CHANGE THIS

  // Helper component for sections
  const Section: FC<{ title: string; children: React.ReactNode; Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({ title, children, Icon }) => (
    <section className="mb-8 py-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:mb-0">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 mr-3 text-amber-500 dark:text-amber-400" />}
        {title}
      </h2>
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );

  return (
    <>
      <Navbar /> 
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 sm:py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10 md:mb-12">
            <Cookie className="mx-auto h-16 w-16 text-amber-500 dark:text-amber-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Cookie Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: {lastUpdatedDate}
            </p>
          </header>

          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8 md:p-10">
            <Section title="1. What Are Cookies?" Icon={Info}>
              <p>
                Cookies are small text files that are placed on your computer or mobile device by websites and applications that you visit. They are widely used to make websites and applications work, or work more efficiently, as well as to provide information to the owners of the site/application.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </Section>

            <Section title="2. How We Use Cookies" Icon={Settings}>
              <p>
                We use cookies and similar tracking technologies to track the activity on our {appName} ("Service") and hold certain information. This helps us to improve our Service and to deliver a better and more personalized service. The cookies we use may include:
              </p>
              {/* List general purposes */}
            </Section>

            <Section title="3. Types of Cookies We Use" Icon={Zap}>
              <p>We use different types of cookies for various purposes:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-500"/>Strictly Necessary Cookies</h4>
                  <p>These cookies are essential for you to browse the Application and use its features, such as accessing secure areas of the site. Without these cookies, services like user authentication and account management cannot be provided.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">[Example: Session cookies for login, security cookies.]</p>
                </li>
                <li>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-blue-500"/>Performance and Analytics Cookies</h4>
                  <p>These cookies collect information about how you use our Application, for instance, which pages you go to most often, and if you get error messages from web pages. These cookies don’t collect information that identifies you. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how our Application works.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">[Example: Google Analytics (if used, also list under Third-Party Cookies), internal analytics.]</p>
                </li>
                <li>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center"><Zap className="w-5 h-5 mr-2 text-purple-500"/>Functionality Cookies</h4>
                  <p>These cookies allow our Application to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features. For instance, these cookies can be used to remember changes you have made to text size, fonts, and other parts of web pages that you can customize. They may also be used to provide services you have asked for, such as watching a video or commenting on a blog.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">[Example: Remembering user preferences, language settings, dark mode preference if stored in a cookie.]</p>
                </li>
                <li>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center"><Cookie className="w-5 h-5 mr-2 text-red-500"/>Targeting or Advertising Cookies (If Applicable)</h4>
                  <p>
                    [**ONLY INCLUDE THIS SECTION IF YOU USE THEM. BE VERY TRANSPARENT.**]
                    These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with the website operator’s permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">[Example: Facebook Pixel, Google Ads cookies. If you don't use these, REMOVE this entire list item.]</p>
                  <p className="font-bold text-sm mt-2">Currently, {appName} does not use Targeting or Advertising Cookies. [**Adjust this statement based on your actual usage. If you do use them, delete this sentence and list them.**]</p>
                </li>
              </ul>
              <p className="mt-4">
                [**You might want to list specific cookies by name if you have a small, fixed set, or if required by regulations like GDPR for certain types. For many apps, categorizing them is sufficient, but transparency is key.**]
              </p>
            </Section>

            <Section title="4. Third-Party Cookies (If Applicable)" Icon={Globe}>
              <p>
                [**If you use third-party services that set their own cookies, list them here. This is very common for analytics, social media integration, etc.**]
              </p>
              <p>
                In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. For example:
              </p>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> We use Google Analytics to collect and analyze information about the use of the Service and report on activities and trends. This service may also collect information regarding the use of other websites, apps, and online resources. You can learn about Google’s practices by going to <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">www.google.com/policies/privacy/partners/</a>, and opt out of them by downloading the Google Analytics opt-out browser add-on, available at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
                </li>
                <li>
                  [**List other third-party services like Facebook Pixel, Intercom, Hotjar, etc., if you use them and they set cookies.**]
                </li>
              </ul>
              <p className="font-bold text-sm mt-2">
                Please note that we do not control these third-party cookies and their use is governed by the privacy policies of the third parties setting them.
                [**If you do not use ANY third-party cookies, you can state: "Currently, {appName} does not use cookies set by third-party domains."**]
              </p>
            </Section>

            <Section title="5. Your Choices Regarding Cookies" Icon={Settings}>
              <p>
                You have several options to control or limit how we and third parties use cookies:
              </p>
              <ul>
                <li>
                  <strong>Browser Settings:</strong> Most web browsers allow some control of most cookies through the browser settings. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">www.allaboutcookies.org</a>.
                </li>
                <li>
                  <strong>Disabling Cookies:</strong> If you disable or refuse cookies, please note that some parts of our Service may become inaccessible or not function properly. For example, you may not be able to log in or use other features that rely on cookies.
                </li>
                <li>
                  <strong>Third-Party Opt-Outs:</strong> For third-party advertising cookies, you can often opt-out via industry opt-out programs like the Network Advertising Initiative (<a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">NAI</a>) or the Digital Advertising Alliance (<a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">DAA</a>).
                </li>
                <li>
                  [**If you have a cookie consent banner/tool, refer to it here: "You can also manage your cookie preferences for our Service through our cookie consent tool, accessible [describe where/how, e.g., via the banner that appears on your first visit or a link in the footer]."**]
                </li>
              </ul>
            </Section>

            <Section title="6. Changes to This Cookie Policy">
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date at the top of this Cookie Policy.
              </p>
              <p>
                You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.
              </p>
            </Section>

            <Section title="7. Contact Us">
              <p>
                If you have any questions about this Cookie Policy, please contact us:
              </p>
              <address className="not-italic">
                By email: <a href={`mailto:${supportEmail}`} className="text-amber-600 dark:text-amber-400 hover:underline">{supportEmail}</a><br />
                By visiting this page on our website: <Link to={`/contactus`} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">{companyWebsite}/contact</Link> {/* Adjust link */}
              </address>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;
import { FC } from 'react';
import { Lock, ListChecks, UserCog, Users, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';


 import Navbar from '../components/navbar/Navbar'; 

const PrivacyPolicyPage: FC = () => {
  const lastUpdatedDate = "Always updating  for  integrity"; 
  const companyName = "WakiliApp Solutions"; 
  const appName = "Wakili Application";
  const supportEmail = "privacy@wakiliapp.com"; 
  const companyAddress = "123 Legal Avenue, Law City, LC 54321"; 

  // Helper component for sections
  const Section: FC<{ title: string; children: React.ReactNode; Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({ title, children, Icon }) => (
    <section className="mb-8 py-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:mb-0">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 mr-3 text-sky-500 dark:text-sky-400" />}
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
            <Lock className="mx-auto h-16 w-16 text-sky-500 dark:text-sky-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: {lastUpdatedDate}
            </p>
          </header>

          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8 md:p-10">
            <Section title="1. Introduction" Icon={ListChecks}>
              <p>
                Welcome to the {appName} (the "Application", "Service"), operated by {companyName} ("we", "us", or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Application.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use the Application.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.
              </p>
            </Section>

            <Section title="2. Information We Collect" Icon={Database}>
              <p>We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use, and includes:</p>
              
              <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-6 mb-2">Personal Information You Provide to Us</h3>
              <p>
                We collect personally identifiable information, such as your name, email address, phone number, postal address, and other similar contact data, when you register for an account, create a support ticket, request an appointment, contact us, or otherwise voluntarily provide it to us.
              </p>
              <p>
                If you use our ticketing system to request an appointment, we will collect the information you provide in the ticket, including the title and message detailing your appointment needs.
              </p>
              <p>
                [**CRITICAL: If users upload documents or share sensitive case details, you MUST explicitly state what kind of information is collected here. For example: "If you choose to upload documents or provide case details through the Application, this information will be collected and stored to facilitate the services you request."**]
              </p>

              <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-6 mb-2">Information Collected Automatically</h3>
              <p>
                When you access or use our Application, we may automatically collect certain information about your device and usage of our services. This information may include:
              </p>
              <ul>
                <li><strong>Log and Usage Data:</strong> IP address, browser type, operating system, access times, pages viewed, features used, and the page you visited before navigating to our Application.</li>
                <li><strong>Device Data:</strong> Information about your computer or mobile device, such as your hardware model, operating system version, unique device identifiers, and mobile network information.</li>
                <li><strong>Information Collected by Cookies and Other Tracking Technologies:</strong> We may use cookies, web beacons, and other tracking technologies to collect information about your interaction with our Application. [**If you use these, link to a more detailed "Cookie Policy" section or page.**]</li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information" Icon={UserCog}>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Provide, operate, and maintain our Application and its services.</li>
                <li>Process your appointment requests made via the ticketing system or other contact methods.</li>
                <li>Communicate with you, including responding to your comments, questions, and requests; providing customer service and support.</li>
                <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Application to improve our services.</li>
                <li>Personalize and improve the Application and provide content or features that match user profiles or interests.</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of {companyName} and others.</li>
                <li>Comply with legal and regulatory obligations.</li>
                <li>[**Add any other specific uses related to the "Wakili Application" functionality.**]</li>
              </ul>
            </Section>

            <Section title="4. How We Share Your Information" Icon={Users}>
              <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
              <ul>
                <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., data hosting, customer service, email delivery, analytics).</li>
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                <li>
                  [**CRITICAL FOR LEGAL APP: If information (e.g., ticket details, documents) is shared with specific legal professionals through the app (beyond your internal team), you MUST clearly state this. For example: "When you request an appointment or share case details intended for a specific legal professional or firm accessible through our Application, we will share the relevant information with that designated legal professional or firm to facilitate the requested service. This sharing will only occur based on your explicit action and request within the Application." Ensure you have a clear consent mechanism for this.**]
                </li>
                <li>
                  We do not sell your personal information to third parties. [**Confirm this is true for your app.**]
                </li>
              </ul>
            </Section>

            <Section title="5. Data Security">
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
              </p>
              <p>
                [**Consider mentioning specific security practices if appropriate and true, e.g., encryption, access controls, but avoid over-promising.**]
              </p>
            </Section>

            <Section title="6. Data Retention">
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p>
                [**Be more specific if possible, e.g., "Account information is retained as long as your account is active and for a reasonable period thereafter in case you decide to re-activate the services." Ticket information might have a different retention period.**]
              </p>
            </Section>

            <Section title="7. Your Data Protection Rights">
              <p>
                Depending on your location and applicable data protection laws, you may have certain rights regarding your personal information. These may include the right to:
              </p>
              <ul>
                <li>Access – You have the right to request copies of your personal information.</li>
                <li>Rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li>Erasure – You have the right to request that we erase your personal information, under certain conditions.</li>
                <li>Restrict processing – You have the right to request that we restrict the processing of your personal information, under certain conditions.</li>
                <li>Object to processing – You have the right to object to our processing of your personal information, under certain conditions.</li>
                <li>Data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p>
                If you wish to exercise any of these rights, please contact us at <a href={`mailto:${supportEmail}`} className="text-sky-600 dark:text-sky-400 hover:underline">{supportEmail}</a>. We will respond to your request in accordance with applicable law.
              </p>
              <p>
                [**IMPORTANT: Tailor this section to the specific rights afforded by laws applicable to your users (e.g., GDPR for EU residents, CCPA/CPRA for Californians). If you operate in specific regions, you may need to list those rights explicitly.**]
              </p>
            </Section>

            <Section title="8. International Data Transfers" Icon={Globe}>
              <p>
                Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
              </p>
              <p>
                If you are located outside [**Your Company's Country**] and choose to provide information to us, please note that we transfer the data, including Personal Data, to [**Your Company's Country / Server Location Country**] and process it there.
              </p>
              <p>
                Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
              </p>
              <p>[**If you use specific mechanisms for international transfers like Standard Contractual Clauses for GDPR, mention them.**]</p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>
                Our Application is not intended for use by children under the age of [**Specify Age, e.g., 13 or 16 or 18 depending on your target and laws like COPPA/GDPR**]. We do not knowingly collect personally identifiable information from children under [**Same Age**]. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
              </p>
            </Section>

            <Section title="10. Cookies and Tracking Technologies">
              <p>
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Application to help customize the Application and improve your experience. For more information about how we use cookies, please refer to our Cookie Policy [**Create a separate Cookie Policy page if your use of cookies is extensive, or detail it here if simple.**].
              </p>
              <p>
                Most browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Application.
              </p>
            </Section>

            <Section title="11. Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <address className="not-italic">
                {companyName}<br />
                Attn: Privacy Officer<br /> {/* Good practice to specify a role */}
                {companyAddress && <>{companyAddress}<br /></>}
                Email: <a href={`mailto:${supportEmail}`} className="text-sky-600 dark:text-sky-400 hover:underline">{supportEmail}</a>
              </address>
            </Section>
          </div>
        </div>
        <footer className="mt-16 pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                              <p>© {new Date().getFullYear()} Wakili Inc. All rights reserved.</p>
                              <p className="mt-1">
                                <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link> | <Link to="/privacy-policy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link> | <Link to="/contactus" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Us</Link>
                              </p>
                            </footer>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
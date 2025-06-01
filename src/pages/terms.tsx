import { FC } from 'react';
import { ShieldCheck, FileText, Info } from 'lucide-react'; // Example icons

// --- Navbar Import (Optional) ---
 import Navbar from '../components/navbar/Navbar'; // Adjust path if needed
import { Link } from 'react-router-dom';

const TermsAndServicesPage: FC = () => {
  const lastUpdatedDate = "Always Updated  as  our  obligation"; // CHANGE THIS TO THE ACTUAL DATE
  const companyName = "WakiliApp Solutions"; // CHANGE THIS
  const appName = "Wakili Application";
  const supportEmail = "support@wakiliapp.com"; // CHANGE THIS
  const companyAddress = "123 Legal Avenue, Law City, LC 54321"; // CHANGE THIS

  // Helper component for sections to maintain consistent styling
  const Section: FC<{ title: string; children: React.ReactNode; Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({ title, children, Icon }) => (
    <section className="mb-8 py-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:mb-0">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 mr-3 text-emerald-500 dark:text-emerald-400" />}
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
            <FileText className="mx-auto h-16 w-16 text-emerald-500 dark:text-emerald-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Terms and Services
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last Updated: {lastUpdatedDate}
            </p>
          </header>

          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8 md:p-10">
            <Section title="1. Introduction & Agreement to Terms" Icon={Info}>
              <p>
                Welcome to the {appName} (the "Application", "Service"), operated by {companyName} ("we", "us", or "our"). These Terms and Services ("Terms") govern your access to and use of our application, including any content, functionality, and services offered on or through the {appName}.
              </p>
              <p>
                Please read these Terms carefully before you start to use the Application. **By accessing, browsing, or using the Application (including downloading, installing, or using any associated software or services), you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, incorporated herein by reference.** If you do not agree to these Terms or the Privacy Policy, you must not access or use the Application.
              </p>
              <p>
                This Application is offered and available to users who are 18 years of age or older, or the age of majority in their jurisdiction of residence. By using this Application, you represent and warrant that you are of legal age to form a binding contract with us.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                The {appName} provides [**DETAILED DESCRIPTION OF YOUR APP'S FUNCTIONALITY HERE. Be specific. For example: "a platform for users to connect with legal professionals, manage legal documents, schedule consultations, and access legal information resources. The service may include features such as user account management, document storage, communication tools, a ticketing system for support and appointment requests, and information about our physical branch locations."**]. We reserve the right to withdraw or amend this Application, and any service or material we provide on the Application, in our sole discretion without notice.
              </p>
            </Section>

            <Section title="3. User Accounts and Responsibilities">
              <p>
                To access certain features of the Application, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account password and for any activities or actions under your account, whether or not you have authorized such activities or actions. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              <p>
                You agree not to use the Application for any unlawful purpose or in any way that interrupts, damages, impairs, or renders the Application less efficient. You agree not to misuse the Application (including, without limitation, by hacking or "scraping").
              </p>
              <p>
                Specifically regarding the ticketing system for appointments: you understand that creating a ticket is a request for an appointment. Our team will review the ticket, and its status may change (e.g., to "Closed") to indicate it has been seen. A "Closed" status means our team will contact you. If you do not receive a response within a reasonable timeframe, you may reopen the ticket.
              </p>
            </Section>

            <Section title="4. User-Generated Content (If Applicable)">
              <p>
                If our Application allows you to post, link, store, share, or otherwise make available certain information, text, graphics, videos, or other material ("User Content"), you are responsible for the User Content that you post, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting User Content, you grant us a non-exclusive, worldwide, royalty-free, irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate, and distribute it in any and all media. You retain any and all of your rights to any User Content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
              </p>
              <p>
                [**Add clauses about prohibited User Content, e.g., illegal, infringing, defamatory content.**]
              </p>
            </Section>

            <Section title="5. Intellectual Property Rights" Icon={ShieldCheck}>
              <p>
                The Application and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by {companyName}, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p>
                These Terms permit you to use the Application for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Application, except as generally permitted through the Application's functionality.
              </p>
            </Section>

            <Section title="6. Privacy Policy">
              <p>
                Our Privacy Policy, which describes how we collect, use, and share your personal information, is incorporated by reference into these Terms. Please review our <Link to="/privacy-policy" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</Link> for more information.
              </p>
            </Section>

            <Section title="7. Fees and Payments (If Applicable)">
              <p>
                [**If your app has paid features, subscriptions, etc., detail them here. Example: "Certain features of the Application may be subject to payments now or in the future (the “Paid Services”). If you elect to use Paid Services, you agree to the pricing and payment terms, as we may update them from time to time. {companyName} may add new services for additional fees and charges, or amend fees and charges for existing services, at any time in its sole discretion." Include details on billing, refunds, etc.**]
                If there are no fees, you can state: "Currently, the {appName} is provided free of charge. We reserve the right to introduce fees for certain features or services in the future, and we will notify you in advance of any such changes."
              </p>
            </Section>

            <Section title="8. Third-Party Links and Services">
              <p>
                The Application may contain links to third-party web sites or services that are not owned or controlled by {companyName}. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that {companyName} shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such web sites or services.
              </p>
            </Section>

            <Section title="9. Disclaimers of Warranties">
              <p>
                THE APPLICATION IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p>
                NEITHER {companyName} NOR ANY PERSON ASSOCIATED WITH {companyName} MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE APPLICATION. WITHOUT LIMITING THE FOREGOING, NEITHER {companyName} NOR ANYONE ASSOCIATED WITH {companyName} REPRESENTS OR WARRANTS THAT THE APPLICATION, ITS CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE APPLICATION WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR SITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT THE APPLICATION OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE APPLICATION WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
              </p>
              <p>
                **[IMPORTANT FOR A LEGAL APP: Add specific disclaimers stating that the app does not provide legal advice and that use of the app does not create an attorney-client relationship, unless that is explicitly a feature and handled appropriately. E.g., "The information provided by the {appName} is for general informational purposes only and does not constitute legal advice. No attorney-client relationship is formed by your use of this Application. You should consult with a qualified legal professional for advice regarding your specific situation." ]**
              </p>
            </Section>

            <Section title="10. Limitation of Liability">
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL {companyName}, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE APPLICATION, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE APPLICATION OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
              </p>
              <p>
                [**Consider if you need a cap on liability, e.g., "Our total liability to you for all claims arising from or relating to the Terms or your use of the Service is limited to the greater of (a) the amount paid by you, if any, for accessing the Service in the 12 months preceding the claim or (b) $100 USD." This needs legal review.**]
              </p>
            </Section>

             <Section title="11. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless {companyName}, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Application, including, but not limited to, your User Content, any use of the Application's content, services, and products other than as expressly authorized in these Terms, or your use of any information obtained from the Application.
              </p>
            </Section>

            <Section title="12. Termination">
              <p>
                We may terminate or suspend your access to all or part of the Application, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </Section>

            <Section title="13. Governing Law and Dispute Resolution">
              <p>
                These Terms shall be governed and construed in accordance with the laws of [**Your State/Country, e.g., "the State of California, United States"**], without regard to its conflict of law provisions.
              </p>
              <p>
                [**Describe your dispute resolution process. E.g., "Any dispute arising from these Terms or the Application shall be resolved through binding arbitration in [Your City, State/Country] in accordance with the rules of the [Arbitration Association, e.g., American Arbitration Association]. Judgment upon the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof." Or specify courts for litigation. THIS IS HIGHLY JURISDICTION-SPECIFIC AND NEEDS LEGAL ADVICE.**]
              </p>
            </Section>

            <Section title="14. Changes to Terms">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Application after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the Application.
              </p>
            </Section>

            <Section title="15. Contact Information">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <address className="not-italic">
                {companyName}<br />
                {companyAddress && <>{companyAddress}<br /></>}
                Email: <a href={`mailto:${supportEmail}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{supportEmail}</a>
              </address>
            </Section>

            <Section title="16. Entire Agreement & Severability">
                <p>
                    These Terms and our Privacy Policy constitute the sole and entire agreement between you and {companyName} regarding the Application and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Application.
                </p>
                <p>
                    If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.
                </p>
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

export default TermsAndServicesPage;
// import { useState } from 'react';
// import { Bell, AlertTriangle, Trash2 } from 'lucide-react';

// interface ToggleSwitchProps {
//     label: string;
//     description?: string;
//     enabled: boolean;
//     onChange: () => void;
// }

// // --- Toggle Switch Sub-component (Corrected aria-checked) ---
// const ToggleSwitch = ({ label, description, enabled, onChange }: ToggleSwitchProps) => (
//     <div className="p-5 sm:p-6 flex items-center justify-between">
//         <div>
//             <h3 className="text-base font-medium text-gray-800">{label}</h3>
//             {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
//         </div>
//         <button
//             type="button"
//             onClick={onChange}
//             className={`${
//                 enabled ? 'bg-wakili-primary-600' : 'bg-gray-200'
//             } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wakili-primary-500 focus:ring-offset-2`}
//             role="switch"
//             // Set aria-checked to a boolean value (without quotes)
//             aria-checked={enabled}
//         >
//             <span className="sr-only">Use setting</span>
//             <span
//                 aria-hidden="true"
//                 className={`${
//                     enabled ? 'translate-x-5' : 'translate-x-0'
//                 } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//             />
//         </button>
//     </div>
// );

// function WakiliSettings() {
//     const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState<boolean>(true);
//     const [inAppAlertsEnabled, setInAppAlertsEnabled] = useState<boolean>(true);
//     const [promotionalUpdatesEnabled, setPromotionalUpdatesEnabled] = useState<boolean>(false);

//     const handleToggleChange = (
//         setter: React.Dispatch<React.SetStateAction<boolean>>,
//         currentValue: boolean
//     ) => {
//         const newValue = !currentValue;
//         setter(newValue);
//         console.log(`Setting changed to: ${newValue}`);
//         // TODO: Add API call here
//     };

//     const handleDeleteAccount = () => {
//         if (window.confirm('Are you absolutely sure you want to delete your account? This action is irreversible and will permanently remove all your data.')) {
//             console.log('Initiating account deletion...');
//             // TODO: Add API call here
//         } else {
//             console.log('Account deletion cancelled.');
//         }
//     };

//     return (
//         <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 sm:p-8">
//             <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
//                 <header className="bg-gradient-to-r from-wakili-primary-600 to-wakili-primary-800 p-6 sm:p-8 text-white">
//                     <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
//                         Settings
//                     </h1>
//                     <p className="text-sm sm:text-base text-wakili-primary-100 mt-2 opacity-90">
//                         Manage your preferences and account.
//                     </p>
//                 </header>

//                 <div className="p-6 sm:p-10 space-y-10">
//                     {/* Section: Notifications */}
//                     <section aria-labelledby="notifications-heading">
//                         <div className="bg-gray-50/50 rounded-lg shadow-md overflow-hidden border border-gray-200/80">
//                             <div className="p-5 sm:p-6 border-b border-gray-200">
//                                 <h2 id="notifications-heading" className="text-xl font-semibold text-gray-800 flex items-center">
//                                     <Bell className="w-6 h-6 mr-2 text-wakili-primary-600" aria-hidden="true" />
//                                     Notifications
//                                 </h2>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Control how you receive updates from WakiliApp.
//                                 </p>
//                             </div>
//                             <div className="divide-y divide-gray-200">
//                                 <ToggleSwitch
//                                     label="Email Notifications"
//                                     description="Receive important updates via email."
//                                     enabled={emailNotificationsEnabled}
//                                     onChange={() => handleToggleChange(setEmailNotificationsEnabled, emailNotificationsEnabled)}
//                                 />
//                                 <ToggleSwitch
//                                     label="In-App Alerts"
//                                     description="Show notifications within the application."
//                                     enabled={inAppAlertsEnabled}
//                                     onChange={() => handleToggleChange(setInAppAlertsEnabled, inAppAlertsEnabled)}
//                                 />
//                                 <ToggleSwitch
//                                     label="Promotional Updates"
//                                     description="Receive occasional news and offers."
//                                     enabled={promotionalUpdatesEnabled}
//                                     onChange={() => handleToggleChange(setPromotionalUpdatesEnabled, promotionalUpdatesEnabled)}
//                                 />
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section: Account Actions */}
//                     <section aria-labelledby="account-actions-heading">
//                         <div className="bg-red-50 rounded-lg shadow-md overflow-hidden border border-red-200">
//                             <div className="p-5 sm:p-6 border-b border-red-200">
//                                 <h2 id="account-actions-heading" className="text-xl font-semibold text-red-800 flex items-center">
//                                     <AlertTriangle className="w-6 h-6 mr-2 text-red-600" aria-hidden="true" />
//                                     Account Actions
//                                 </h2>
//                                 <p className="text-sm text-red-600 mt-1">
//                                     Manage your account status. Proceed with caution.
//                                 </p>
//                             </div>
//                             <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//                                 <div>
//                                     <h3 className="text-base font-medium text-red-800">Delete Account</h3>
//                                     <p className="text-sm text-red-600 mt-1 max-w-md">
//                                         Permanently remove your WakiliApp account and all associated data. This action cannot be undone.
//                                     </p>
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={handleDeleteAccount}
//                                     className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition duration-150 ease-in-out flex-shrink-0 w-full sm:w-auto"
//                                 >
//                                     <Trash2 className="-ml-0.5 h-5 w-5" aria-hidden="true" />
//                                     Delete My Account
//                                 </button>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default WakiliSettings;

// src/pages/dashboard/main/SettingsPage.tsx (Renamed from Profile.tsx)

import React, { ReactNode, useEffect, useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../../features/users/usersAPI';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Footer from '../../landingPage/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
    FaTimes,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaUserCircle,
    FaEdit,
    FaArrowLeft,
    FaCamera,
    FaSpinner,
    FaExclamationCircle,
    FaKey,
    FaBell,
    FaPalette,
    FaEye,
    FaEyeSlash,
    FaQuestionCircle, // Added for Help Tab
} from 'react-icons/fa';

// ======= Modal Component (No changes needed) =======
interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    isOpen: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, isOpen, size = 'lg' }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter p-6 sm:p-8`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Close modal"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};
// ======= End of Modal Component =======

interface ApiErrorData {
    issues?: { [key: string]: string[] | string };
    error?: string;
    msg?: string;
    message?: string;
}

// ======= Profile Form Types & Schema (Existing) =======
type UserFormData = {
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    profile_picture?: string;
};

const profileSchema = yup.object().shape({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    profile_picture: yup.string().optional(),
});

// ======= NEW: Change Password Form Types & Schema =======
type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const passwordSchema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm new password is required'),
});

// ======= NEW: Notification Settings Types =======
interface NotificationPreferences {
    emailOnNewMessage: boolean;
    emailOnProductUpdates: boolean;
}

import type { Path } from 'react-hook-form';

// Generic Form Field Renderer
function renderFormField<T extends Record<string, unknown>>(
    id: Path<T>,
    label: string,
    type: string,
    autoComplete: string,
    error: FieldError | undefined,
    register: ReturnType<typeof useForm<T>>['register'],
    icon?: React.ReactNode,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
    rightIcon?: React.ReactNode,
    onRightIconClick?: () => void
) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" })}
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    className={`appearance-none block w-full px-3 py-2 border ${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none sm:text-sm ${inputProps?.disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    {...register(id)}
                    {...inputProps}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button type="button" onClick={onRightIconClick} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            {React.cloneElement(rightIcon as React.ReactElement, { className: "h-5 w-5" })}
                        </button>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </div>
    );
}

const SettingsGuideContent: React.FC = () => (
    <div className="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white border-b pb-2 mb-4">
            How Your Settings Work: A User's Guide
        </h2>

        <p>
            Welcome to your Settings page! This is where you can personalize your
            experience and manage your account details.
        </p>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                1. Navigating Your Settings
            </h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>At the top, you'll see several tabs: "Profile," "Account," "Appearance," "Notifications," and "Help."</li>
                <li>Click on any tab to switch to that specific section of settings.</li>
                <li>The currently selected tab will be highlighted.</li>
                <li>There's a "Back" button at the top-left to easily return to the previous page you were on.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                2. Profile Tab
            </h3>
            <p className="font-medium">View Your Info:</p>
            <p>This section displays your current profile information: your profile picture, full name, email address, phone number, and address.</p>

            <p className="font-medium mt-2">Edit Your Profile:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Click the "Edit Profile" button. A pop-up window (modal) will appear.</li>
                <li>
                    Here, you can:
                    <ul className="list-circle pl-5 mt-1 space-y-1">
                        <li><strong>Change Your Profile Picture:</strong> Click "Change Picture" to upload a new image from your device. You'll see a preview.</li>
                        <li><strong>Update Details:</strong> Modify your Full Name, Phone Number, and Address in the respective fields. (Note: Your email address is displayed but cannot be changed here).</li>
                    </ul>
                </li>
                <li>Click "Save Changes" to apply your updates or "Cancel" to close the window without saving.</li>
            </ul>
            <p className="font-medium mt-2">View Profile Picture:</p>
            <p>Click on your profile picture or the "View Picture" button to see a larger version of your avatar.</p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                3. Account Tab
            </h3>
            <p className="font-medium">Change Your Password:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Click the "Change Password" button. A pop-up window will appear.</li>
                <li>You'll need to enter your "Old Password," then type your "New Password," and "Confirm New Password."</li>
                <li>Click "Change Password" to update it, or "Cancel" to exit.</li>
                <li>You can click the eye icon next to password fields to show/hide what you're typing.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                4. Appearance Tab
            </h3>
            <p className="font-medium">Choose Your Theme:</p>
            <p>Customize the look and feel of the application.</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Light:</strong> A bright, classic interface.</li>
                <li><strong>Dark:</strong> A darker interface, often easier on the eyes in low light.</li>
                <li><strong>System:</strong> The application will automatically match your computer's or device's current light or dark mode setting.</li>
            </ul>
            <p>Your choice is saved automatically and applied immediately.</p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                5. Notifications Tab
            </h3>
            <p className="font-medium">Manage Email Alerts:</p>
            <p>Control which email notifications you receive.</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>New Message Emails:</strong> Toggle the switch ON to get an email when you receive a new message. Toggle OFF to stop these emails.</li>
                <li><strong>Product Update Emails:</strong> Toggle the switch ON to be notified about new features and updates. Toggle OFF to opt-out.</li>
            </ul>
            <p className="font-medium mt-2">Save Your Preferences:</p>
            <p>After making changes to your notification settings, click the "Save Preferences" button to apply them.</p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                General Experience
            </h3>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Feedback:</strong> When you save changes (like updating your profile or notification settings), you'll see brief messages like "Saving..." or "Profile updated successfully!" to confirm the action.</li>
                <li><strong>Loading:</strong> If data is being fetched, you might see a loading indicator.</li>
                <li><strong>Errors:</strong> If something goes wrong, an error message will be displayed to help you understand the issue.</li>
            </ul>
        </section>
        <p className="mt-4">We hope this helps you make the most of your settings!</p>
    </div>
);


const SettingsPage = () => {
    const navigate = useNavigate();
    const userState = useSelector((state: RootState) => state.user);
    const user_id = userState.user?.user_id ?? 0;

    const { data: userData, isLoading: isLoadingUser, error: queryError, refetch: refetchUser } = usersAPI.useGetUserByIdQuery(user_id, {
        pollingInterval: 60000,
        refetchOnMountOrArgChange: true,
        skip: !user_id,
    });
    const [updateUser, { isLoading: isUpdatingProfile }] = usersAPI.useUpdateUserMutation();
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isViewPictureModalOpen, setIsViewPictureModalOpen] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfileForm,
    } = useForm<UserFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: { full_name: '', email: '', phone_number: '', address: '', profile_picture: '' }
    });

    type SettingsTab = 'profile' | 'account' | 'appearance' | 'notifications' | 'help'; // Added 'help' tab
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(passwordSchema),
    });

    type Theme = 'light' | 'dark' | 'system';
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('wakii-theme') as Theme | null;
        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
            return storedTheme;
        }
        return 'system'; // Default to system if invalid or not set
    });


    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
        emailOnNewMessage: true,
        emailOnProductUpdates: false,
    });
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);

    useEffect(() => {
        if (userData) {
            resetProfileForm({
                full_name: userData.full_name,
                email: userData.email,
                phone_number: userData.phone_number || '',
                address: userData.address || '',
                profile_picture: userData.profile_picture || '',
            });
            if (!imageFile && userData.profile_picture) {
                setImagePreview(userData.profile_picture);
            } else if (!imageFile && !userData.profile_picture) {
                setImagePreview(null);
            }
        }
    }, [userData, resetProfileForm, imageFile]);

    useEffect(() => {
        const root = window.document.documentElement;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (currentTheme === 'dark' || (currentTheme === 'system' && systemPrefersDark)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('wakii-theme', currentTheme);

        const mediaQueryListener = (e: MediaQueryListEvent) => {
            if (currentTheme === 'system') {
                if (e.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', mediaQueryListener);
        return () => mediaQuery.removeEventListener('change', mediaQueryListener);

    }, [currentTheme]);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result as string); };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(userData?.profile_picture || null);
        }
    };

    const onSubmitProfile: SubmitHandler<UserFormData> = async (formData) => {
        let toastId: string | number | undefined = undefined;
        try {
            toastId = toast.loading('Updating profile...');
            let finalProfilePictureValue: string | null;

            if (imageFile) {
                const formImageData = new FormData();
                formImageData.append('file', imageFile);
                formImageData.append('upload_preset', 'upload'); // Replace with your Cloudinary preset
                const response = await axios.post(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, formImageData); // Replace YOUR_CLOUD_NAME
                if (response.status === 200 && response.data.secure_url && typeof response.data.secure_url === 'string') {
                    finalProfilePictureValue = response.data.secure_url;
                } else {
                    console.error("Cloudinary upload failed or returned invalid data:", response.data);
                    throw new Error('Failed to upload new profile picture. Cloudinary did not return a valid URL.');
                }
            } else {
                finalProfilePictureValue = (userData?.profile_picture && userData.profile_picture.trim() !== "") ? userData.profile_picture : null;
            }

            const updatePayload = {
                user_id: user_id,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                address: formData.address,
                profile_picture: finalProfilePictureValue
            };

            await updateUser(updatePayload).unwrap();

            setIsEditProfileModalOpen(false);
            setImageFile(null);
            await refetchUser();
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (err: unknown) {
            console.error('Error updating profile:', err);
            let errorMessage = 'Failed to update profile.';
            if (axios.isAxiosError(err) && err.response?.data) {
                const errorData = err.response.data as ApiErrorData;
                if (errorData.issues && typeof errorData.issues === 'object') {
                    const issueMessages = Object.entries(errorData.issues)
                        .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : String(value))}`)
                        .join('; ');
                    errorMessage = `Validation error: ${issueMessages}`;
                } else if (typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                } else if (typeof errorData.msg === 'string') {
                    errorMessage = errorData.msg;
                } else if (typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage, { id: toastId });
        }
    };

    const openEditProfileModal = () => {
        if (userData) {
            setIsEditProfileModalOpen(true);
            resetProfileForm({
                full_name: userData.full_name,
                email: userData.email,
                phone_number: userData.phone_number || '',
                address: userData.address || '',
                profile_picture: userData.profile_picture || '',
            });
            setImagePreview(userData.profile_picture || null);
            setImageFile(null);
        } else {
            toast.error("User data is not available to edit profile.");
        }
    };
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);

    const onSubmitChangePassword: SubmitHandler<ChangePasswordFormData> = async () => {
        setIsChangingPassword(true);
        const toastId: string | number | undefined = toast.loading("Changing password...");
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            toast.success("Password changed successfully!", { id: toastId });
            setIsChangePasswordModalOpen(false);
            resetPasswordForm();
        } catch (error: unknown) {
            console.error("Password change error:", error);
            let errorMessage = "Failed to change password.";
             if (typeof error === "object" && error !== null && "data" in error) {
                const errorData = error.data as { message?: string };
                if (errorData?.message) {
                    errorMessage = errorData.message;
                } else if ("message" in error && typeof error.message === "string") {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsChangingPassword(false);
        }
    };


    const handleNotificationToggle = (key: keyof NotificationPreferences) => {
        setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveNotificationPrefs = async () => {
        setIsSavingNotifications(true);
        const toastId: string | number | undefined = toast.loading("Saving notification preferences...");
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Notification preferences saved!", { id: toastId });
        } catch (error: unknown) {
            console.error("Save notification prefs error:", error);
             if (typeof error === "object" && error !== null && "data" in error && "message" in error) {
                
                const errorMsg =
                    (typeof error.data === "object" && error.data && "message" in error.data && typeof error.data.message === "string")
                        ? error.data.message
                        : (error instanceof Error && error.message)
                            ? error.message
                            : "Failed to save preferences.";
                toast.error(errorMsg, { id: toastId });
            } else if (error instanceof Error) {
                toast.error(error.message || "Failed to save preferences.", { id: toastId });
            } else {
                toast.error("Failed to save preferences.", { id: toastId });
            }
        } finally {
            setIsSavingNotifications(false);
        }
    };

    type QueryErrorType = {
        data?: ApiErrorData;
        status?: string | number;
    };

    if (isLoadingUser && !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                    <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your settings...</p>
                </div>
            </div>
        );
    }

    let displayQueryErrorMessage: string | null = null;
    if (queryError) {
        const err = queryError as QueryErrorType;
        displayQueryErrorMessage = 'An unknown error occurred while fetching profile data.';
        if (err.data) {
            displayQueryErrorMessage = err.data.message || err.data.error || err.data.msg || `Server error: ${err.status || 'Details unavailable'}`;
        } else if (err.status) {
            displayQueryErrorMessage = `Error fetching data please check your  network connection: Status ${err.status}`;
        }
    }

    if (!userData && !isLoadingUser && !queryError) {
         return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                     <FaUserCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No user data available.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This might happen if the user ID is invalid or the query was skipped.</p>
                </div>
            </div>
        );
    }

    const displayProfilePicSrc = imagePreview || userData?.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

    const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
        { id: 'profile', label: 'Profile', icon: FaUserCircle },
        { id: 'account', label: 'Account', icon: FaKey },
        { id: 'appearance', label: 'Appearance', icon: FaPalette },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'help', label: 'Help', icon: FaQuestionCircle }, // Added Help Tab
    ];

    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 sm:py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                    {displayQueryErrorMessage && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 dark:bg-red-900 dark:text-red-300 dark:border-red-700" role="alert">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaExclamationCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Oops! Something went wrong.</h3>
                                    <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                        <p>{displayQueryErrorMessage}</p>
                                    </div>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => refetchUser()}
                                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-100 dark:focus:ring-offset-red-900"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <nav
                                    className="-mb-px flex flex-nowrap px-2 space-x-2 sm:px-4 sm:space-x-3 md:px-6 md:space-x-4"
                                    aria-label="Tabs"
                                >
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`group whitespace-nowrap py-4 px-2 sm:px-3 border-b-2 font-medium text-sm flex items-center
                                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800
                                                        transition-colors duration-150 ease-in-out
                                                        ${activeTab === tab.id
                                                            ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                        >
                                            <tab.icon
                                                className={`h-5 w-5 shrink-0 mr-1 sm:mr-2
                                                           ${activeTab === tab.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`}
                                            />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 sm:p-6 md:p-8">
                            {activeTab === 'profile' && userData && (
                                <div className="animate-fadeIn">
                                    {/* Profile content as before */}
                                    <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                        <div className="relative mb-4 sm:mb-0 sm:mr-8">
                                            <img
                                                src={displayProfilePicSrc}
                                                className="rounded-full h-32 w-32 sm:h-36 sm:w-36 object-cover border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer transition-transform hover:scale-105"
                                                alt="User Avatar"
                                                onClick={() => setIsViewPictureModalOpen(true)}
                                            />
                                        </div>
                                        <div className="text-center sm:text-left flex-grow">
                                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">{userData.full_name}</h1>
                                            <div className="space-y-2 text-gray-600 dark:text-gray-400">
                                                <p className="flex items-center justify-center sm:justify-start"><FaEnvelope className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />{userData.email}</p>
                                                <p className="flex items-center justify-center sm:justify-start"><FaPhoneAlt className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />{userData.phone_number || 'N/A'}</p>
                                                <p className="flex items-center justify-center sm:justify-start"><FaMapMarkerAlt className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />{userData.address || 'N/A'}</p>
                                            </div>
                                            <button onClick={() => setIsViewPictureModalOpen(true)} className="mt-4 sm:hidden px-4 py-2 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-300 border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition">View Picture</button>
                                        </div>
                                        <button onClick={() => setIsViewPictureModalOpen(true)} className="hidden sm:block sm:ml-auto self-start px-4 py-2 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-300 border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition">View Picture</button>
                                    </div>
                                    <div className="flex justify-center sm:justify-start">
                                        <button
                                            onClick={openEditProfileModal}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                        >
                                            <FaEdit className="mr-2 h-5 w-5" /> Edit Profile
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div className="animate-fadeIn">
                                    {/* Account content as before */}
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Account Management</h2>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setIsChangePasswordModalOpen(true)}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            <FaKey className="mr-2 h-4 w-4" />
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="animate-fadeIn">
                                     {/* Appearance content as before */}
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Theme Preferences</h2>
                                    <fieldset>
                                        <legend className="text-base font-medium text-gray-900 dark:text-gray-100">Select Theme</legend>
                                        <div className="mt-4 space-y-3">
                                            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
                                                <div key={themeOption} className="flex items-center">
                                                    <input
                                                        id={`theme-${themeOption}`}
                                                        name="theme-option"
                                                        type="radio"
                                                        value={themeOption}
                                                        checked={currentTheme === themeOption}
                                                        onChange={() => setCurrentTheme(themeOption)}
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-500 dark:checked:border-indigo-500"
                                                    />
                                                    <label htmlFor={`theme-${themeOption}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                                        {themeOption}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                 <div className="animate-fadeIn">
                                    {/* Notifications content as before */}
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Notification Preferences</h2>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New Message Emails</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Receive an email when you get a new message.</p>
                                            </div>
                                            <label htmlFor="emailOnNewMessageToggle" className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id="emailOnNewMessageToggle" className="sr-only peer"
                                                    checked={notificationPrefs.emailOnNewMessage}
                                                    onChange={() => handleNotificationToggle('emailOnNewMessage')}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                             <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Product Update Emails</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about new features and updates.</p>
                                            </div>
                                            <label htmlFor="emailOnProductUpdatesToggle" className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" id="emailOnProductUpdatesToggle" className="sr-only peer"
                                                    checked={notificationPrefs.emailOnProductUpdates}
                                                    onChange={() => handleNotificationToggle('emailOnProductUpdates')}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={handleSaveNotificationPrefs}
                                                disabled={isSavingNotifications}
                                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isSavingNotifications && <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                                {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'help' && ( // New Help Tab Content
                                <div className="animate-fadeIn">
                                    <SettingsGuideContent />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals as before */}
            {userData && isEditProfileModalOpen && (
                <Modal title="Update Your Profile" isOpen={isEditProfileModalOpen} onClose={closeEditProfileModal}>
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                        <div className="flex flex-col items-center space-y-3">
                            <img src={imagePreview || userData.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="Avatar Preview" className="w-32 h-32 rounded-full object-cover shadow-md" />
                            <label htmlFor="file-upload-modal" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <FaCamera className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"/>
                                <span>{imageFile ? imageFile.name.substring(0,20) + (imageFile.name.length > 20 ? '...':'') : "Change Picture"}</span>
                                <input id="file-upload-modal" name="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        {renderFormField("full_name", "Full Name", "text", "name", profileErrors.full_name, registerProfile, <FaUserCircle />)}
                        {renderFormField("email", "Email Address", "email", "email", profileErrors.email, registerProfile, <FaEnvelope />, { disabled: true })}
                        {renderFormField("phone_number", "Phone Number", "tel", "tel", profileErrors.phone_number, registerProfile, <FaPhoneAlt />)}
                        {renderFormField("address", "Address", "text", "street-address", profileErrors.address, registerProfile, <FaMapMarkerAlt />)}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-2">
                            <button type="button" onClick={closeEditProfileModal} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-6 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Cancel</button>
                            <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600" disabled={isUpdatingProfile}>
                                {isUpdatingProfile && <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <Modal title="Change Your Password" isOpen={isChangePasswordModalOpen} onClose={() => { setIsChangePasswordModalOpen(false); resetPasswordForm(); }} size="md">
                <form onSubmit={handleSubmitPassword(onSubmitChangePassword)} className="space-y-6">
                    {renderFormField("oldPassword", "Old Password", showOldPassword ? "text" : "password", "current-password", passwordErrors.oldPassword, registerPassword, <FaKey />, undefined, showOldPassword ? <FaEyeSlash /> : <FaEye />, () => setShowOldPassword(!showOldPassword))}
                    {renderFormField("newPassword", "New Password", showNewPassword ? "text" : "password", "new-password", passwordErrors.newPassword, registerPassword, <FaKey />, undefined, showNewPassword ? <FaEyeSlash /> : <FaEye />, () => setShowNewPassword(!showNewPassword))}
                    {renderFormField("confirmNewPassword", "Confirm New Password", showConfirmPassword ? "text" : "password", "new-password", passwordErrors.confirmNewPassword, registerPassword, <FaKey />, undefined, showConfirmPassword ? <FaEyeSlash /> : <FaEye />, () => setShowConfirmPassword(!showConfirmPassword))}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-2">
                        <button type="button" onClick={() => { setIsChangePasswordModalOpen(false); resetPasswordForm();}} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-6 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Cancel</button>
                        <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600" disabled={isChangingPassword}>
                            {isChangingPassword && <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </Modal>

            {isViewPictureModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setIsViewPictureModalOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 sm:p-4 max-w-md sm:max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
                        <img src={displayProfilePicSrc} alt="Full User Avatar" className="rounded-md object-contain w-full max-h-[80vh]" />
                        <button onClick={() => setIsViewPictureModalOpen(false)} className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-700 bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 z-10"><FaTimes className="h-5 w-5" /></button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default SettingsPage;
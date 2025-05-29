// src/pages/dashboard/main/Profile.tsx (or ProfileWithModal.tsx)
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
    FaSun,
    FaMoon
} from 'react-icons/fa';

// ======= Modal Component =======
interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, isOpen }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-75 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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

// ======= Profile Component =======
type UserFormData = {
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    profile_picture?: string;
};

const schema = yup.object().shape({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    profile_picture: yup.string().optional(),
});

const renderFormField = (
    id: keyof UserFormData,
    label: string,
    type: string,
    autoComplete: string,
    error: FieldError | undefined,
    register: ReturnType<typeof useForm<UserFormData>>['register'],
    icon?: React.ReactNode,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
) => (
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
                className={`appearance-none block w-full px-3 py-2 border ${icon ? 'pl-10' : ''} 
                    ${error 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:focus:ring-red-500 dark:focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:focus:ring-indigo-400 dark:focus:border-indigo-400'
                    } 
                    rounded-md placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none sm:text-sm 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    ${inputProps?.disabled ? (inputProps.className || 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed') : ''}`}
                placeholder={`Enter your ${label.toLowerCase()}`}
                {...register(id)}
                {...inputProps}
            />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
);


const Profile = () => {
    const navigate = useNavigate();
    const userState = useSelector((state: RootState) => state.user);
    const user_id = userState.user?.user_id ?? 0;

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode !== null) {
                return savedMode === 'true';
            }
        }
        return true; // Default to dark mode
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', String(isDarkMode));
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };


    const { data: userData, isLoading, error: queryError, refetch } = usersAPI.useGetUserByIdQuery(user_id, {
        pollingInterval: 60000,
        refetchOnMountOrArgChange: true,
        skip: !user_id,
    });

    const [updateUser, { isLoading: isUpdatingProfile }] = usersAPI.useUpdateUserMutation();

    const [isEditMode, setIsEditMode] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isViewPicture, setIsViewPicture] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            full_name: '',
            email: '',
            phone_number: '',
            address: '',
            profile_picture: '',
        }
    });

    useEffect(() => {
        if (userData) {
            reset({
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
    }, [userData, reset, imageFile]);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
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
                formImageData.append('upload_preset', 'upload'); 

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dl3ovuqjn/image/upload`, 
                    formImageData
                );

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
            
            setIsEditMode(false);
            setImageFile(null); 
            await refetch(); 
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
    
    const openEditModal = () => {
        if (userData) { 
            setIsEditMode(true);
            reset({ 
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

    const closeModalAndResetEditModal = () => {
        setIsEditMode(false);
    };

    type QueryErrorType = {
        data?: ApiErrorData; 
        status?: string | number;
    };

    // Loading state: Show full page loader. Toggle button is not shown here.
    if (isLoading && !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                    <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
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
            displayQueryErrorMessage = `Error fetching data: Status ${err.status}`;
        }
    }
    
    // No User Data state: Show full page message. Toggle button is not shown here.
    if (!userData && !isLoading && !queryError) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                     <FaUserCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No user data available.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This might happen if the user ID is invalid, the user doesn't exist, or the query was skipped. Please try again later or contact support.</p>
                </div>
            </div>
        );
    }
    
    const displayProfilePicSrc = imagePreview || userData?.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

    return (
        <>
            <Toaster richColors position="top-center" theme={isDarkMode ? 'dark' : 'light'} />
            
            {/* Fixed position toggle button REMOVED from here */}

            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 sm:py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Container for Back button and Dark Mode Toggle */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                        >
                            <FaArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </button>

                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
                        </button>
                    </div>


                    {displayQueryErrorMessage && (
                        <div className="bg-red-100 dark:bg-red-900/[.2] border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md mb-6" role="alert">
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
                                            onClick={() => refetch()}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-100 dark:focus:ring-offset-red-900/[.2]"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {userData && (
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-10">
                            <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative mb-4 sm:mb-0 sm:mr-8">
                                    <img
                                        src={displayProfilePicSrc}
                                        className="rounded-full h-32 w-32 sm:h-36 sm:w-36 object-cover border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        alt="User Avatar"
                                        onClick={() => setIsViewPicture(true)}
                                    />
                                </div>

                                <div className="text-center sm:text-left flex-grow">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{userData.full_name}</h1>
                                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                                        <p className="flex items-center justify-center sm:justify-start">
                                            <FaEnvelope className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                                            {userData.email}
                                        </p>
                                        <p className="flex items-center justify-center sm:justify-start">
                                            <FaPhoneAlt className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                                            {userData.phone_number || 'N/A'}
                                        </p>
                                        <p className="flex items-center justify-center sm:justify-start">
                                            <FaMapMarkerAlt className="mr-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                                            {userData.address || 'N/A'}
                                        </p>
                                    </div>
                                     <button
                                        onClick={() => setIsViewPicture(true)}
                                        className="mt-4 sm:hidden px-4 py-2 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-300 border border-indigo-600 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                                    >
                                        View Picture
                                    </button>
                                </div>
                                 <button
                                    onClick={() => setIsViewPicture(true)}
                                    className="hidden sm:block sm:ml-auto self-start px-4 py-2 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-300 border border-indigo-600 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                                >
                                    View Picture
                                </button>
                            </div>

                            <div className="flex justify-center sm:justify-start">
                                <button
                                    onClick={openEditModal}
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                                >
                                    <FaEdit className="mr-2 h-5 w-5" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {userData && isEditMode && (
                    <Modal 
                        title="Update Your Profile" 
                        isOpen={isEditMode} 
                        onClose={closeModalAndResetEditModal}
                    >
                        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                            <div className="flex flex-col items-center space-y-3">
                                <img
                                    src={imagePreview || userData.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                                    alt="Avatar Preview"
                                    className="w-32 h-32 rounded-full object-cover shadow-md"
                                />
                                <label htmlFor="file-upload-modal" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <FaCamera className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"/>
                                    <span>{imageFile ? imageFile.name.substring(0,20) + (imageFile.name.length > 20 ? '...':'') : "Change Picture"}</span>
                                    <input id="file-upload-modal" name="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                            </div>

                            {renderFormField("full_name", "Full Name", "text", "name", errors.full_name, register, <FaUserCircle />)}
                            {renderFormField("email", "Email Address", "email", "email", errors.email, register, <FaEnvelope />, 
                                
                            )}
                            {renderFormField("phone_number", "Phone Number", "tel", "tel", errors.phone_number, register, <FaPhoneAlt />)}
                            {renderFormField("address", "Address", "text", "street-address", errors.address, register, <FaMapMarkerAlt />)}

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModalAndResetEditModal}
                                    className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isUpdatingProfile}
                                >
                                    {isUpdatingProfile && <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {isViewPicture && (
                    <div 
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-75 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                        onClick={() => setIsViewPicture(false)}
                    >
                        <div 
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 sm:p-4 max-w-md sm:max-w-lg w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={displayProfilePicSrc}
                                alt="Full User Avatar"
                                className="rounded-md object-contain w-full max-h-[80vh]"
                            />
                            <button
                                onClick={() => setIsViewPicture(false)}
                                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-700 bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 dark:bg-gray-600 dark:bg-opacity-70 dark:text-gray-100 dark:hover:bg-opacity-90 transition-colors z-10"
                                aria-label="Close image view"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};
// ======= End of Profile Component =======

export default Profile;
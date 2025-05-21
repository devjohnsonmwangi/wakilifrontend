import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../../features/users/usersAPI';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Footer from '../../landingPage/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

type UserFormData = {
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    profile_picture?: string;
    password?: string;

};

const schema = yup.object().shape({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters'),

});

const privacyPolicyContent = (
    <div className="mt-4 text-sm text-gray-700">
        <h4 className="font-semibold">Privacy Policy</h4>
        <p>
            We are committed to protecting your privacy. This privacy policy explains how we collect, use, and safeguard your personal information when you use our services.
        </p>
        <ol className="list-decimal list-inside pl-4">
            <li>
                <span className="font-semibold">Information We Collect:</span> We collect your full name, email address, phone number, and address to manage your account and provide personalized services.
            </li>
            <li>
                <span className="font-semibold">How We Use Your Information:</span> Your information is used to communicate with you, process transactions, and improve our services.
            </li>
            <li>
                <span className="font-semibold">Data Security:</span> We implement security measures to protect your personal information from unauthorized access and misuse.
            </li>
            <li>
                <span className="font-semibold">Sharing Your Information:</span> We do not share your personal information with third parties without your consent, except as required by law.
            </li>
        </ol>
        <p>
            By using our services, you agree to the terms of this privacy policy.
        </p>
    </div>
);

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const user_id = user.user?.user_id ?? 0;

    const { data: userData, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id, {
        pollingInterval: 6000,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const [updateUser] = usersAPI.useUpdateUserMutation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isViewPicture, setIsViewPicture] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        resolver: yupResolver(schema),

    });

    useEffect(() => {
        if (userData) {
            reset({
                full_name: userData.full_name,
                email: userData.email,
                phone_number: userData.phone_number,
                address: userData.address,
                profile_picture: userData.profile_picture,
            });
        }
    }, [userData, reset]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
        let toastId: string | number | undefined = undefined;

        try {
            setIsUpdating(true);
            toastId = toast.loading('Updating profile...');

            let imageUrlToUpdate = formData.profile_picture || '';
            if (image) {
                const formImageData = new FormData();
                formImageData.append('file', image);
                formImageData.append('upload_preset', 'upload');

                const response = await axios.post('https://api.cloudinary.com/v1_1/dl3ovuqjn/image/upload', formImageData);

                if (response.status === 200) {
                    imageUrlToUpdate = response.data.secure_url;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            await updateUser({ user_id: user_id, ...formData, profile_picture: imageUrlToUpdate }).unwrap();
            setIsEditMode(false);
            refetch();
            toast.success('User updated successfully', { id: toastId });
            setImagePreview(null); // Clear the temporary URL after upload

        } catch (err) {
            console.error('Error updating user', err);
            toast.error('Error updating user', { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const onSubmitPassword: SubmitHandler<UserFormData> = async (formData) => {
         let toastId: string | number | undefined = undefined;

        if (!agreeToPrivacy) {
            toast.error('You must agree to the privacy policy');
            return;
        }

        try {
            setIsPasswordUpdating(true);
            toastId = toast.loading('Updating password...');
            await updateUser({
                user_id: user_id,
                full_name: userData?.full_name,
                email: userData?.email,
                phone_number: userData?.phone_number,
                address: userData?.address,
                password: formData.password,
            }).unwrap();

            toast.success('Password updated successfully', { id: toastId });
            setIsChangePasswordMode(false);
        } catch (err) {
            console.error('Error updating user', err);
            toast.error('Error updating user', { id: toastId });
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">
    <div className="text-center text-xl text-red-600">
        Error loading users data 😞. Please check your network and  refresh the page . if connected to  internet and  this error persists contact support team
    </div>
</div>;
    if (!userData) return <div>No user data available.</div>;

    return (
        <>
            <Toaster position="top-right" />
            <div className="card shadow-xl mx-auto p-6 text-green-500 rounded-md bg-slate-100 min-h-screen">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn bg-blue-500 text-white hover:bg-blue-600 w-24 py-2 rounded-md">
                        🔙 Back
                    </button>
                </div>

                <div className="border-b-2 border-slate-600 pb-4 mt-8">
                    <div className="flex justify-center">
                        <img
                            src={userData.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                            className="rounded-full h-32 w-32 object-cover border-4 border-white"
                            alt="User Avatar"
                        />
                        <button
                            onClick={() => setIsViewPicture(true)}
                            className="btn bg-blue-500 text-white hover:bg-blue-600 ml-4">
                            View Full Picture
                        </button>
                    </div>
                    <div className="flex flex-col justify-center mt-4 text-center">
                        <h1 className="text-3xl font-bold text-indigo-600">{userData.full_name} <FaUserCircle className="inline text-xl" /></h1>
                        <p className="text-lg text-gray-700"><FaEnvelope className="inline mr-2" />{userData.email}</p>
                        <p className="text-lg text-gray-700"><FaPhoneAlt className="inline mr-2" />{userData.phone_number}</p>
                        <p className="text-lg text-gray-700"><FaMapMarkerAlt className="inline mr-2" />{userData.address}</p>
                    </div>
                </div>

                <div className="flex justify-between mt-6 gap-6">
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="btn bg-green-500 text-white hover:bg-green-600 w-1/4 px-4 py-2 rounded-md">
                        Update Profile
                    </button>
                    <button
                        onClick={() => setIsChangePasswordMode(!isChangePasswordMode)}
                        className="btn bg-yellow-500 text-white hover:bg-yellow-600 w-1/4 px-4 py-2 rounded-md">
                        {isChangePasswordMode ? 'Cancel Password' : 'Change Password'}
                    </button>
                </div>

                {isEditMode && (
                    <div className="fixed top-0 left-0 w-full h-full md:relative bg-white z-50 overflow-auto  items-center justify-center">
                        <div className=" min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                            <div className="md:max-w-2xl w-full mx-auto p-4">
                                {/* Added max-w-2xl */}
                                <div className="w-full space-y-8">
                                    <div>
                                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                            Update Profile
                                        </h2>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                                        <input type="hidden" value="true" />
                                        <div className="rounded-md shadow-sm -space-y-px">
                                            <div>
                                                <label htmlFor="full_name" className="sr-only">Full Name</label>
                                                <input
                                                    id="full_name"
                                                    type="text"
                                                    autoComplete="name"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="Full Name"
                                                    {...register("full_name")}
                                                />
                                                {errors.full_name && <p className="text-red-500">{errors.full_name.message}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="sr-only">Email address</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="Email address"
                                                    {...register("email")}
                                                />
                                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="phone_number" className="sr-only">Phone Number</label>
                                                <input
                                                    id="phone_number"
                                                    type="text"
                                                    autoComplete="tel"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="Phone Number"
                                                    {...register("phone_number")}
                                                />
                                                {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="address" className="sr-only">Address</label>
                                                <input
                                                    id="address"
                                                    type="text"
                                                    autoComplete="street-address"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="Address"
                                                    {...register("address")}
                                                />
                                                {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Profile Picture
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    {/* Display the preview image */}
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="mx-auto rounded-full h-24 w-24 object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={userData.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                                                            alt="Current Profile"
                                                            className="mx-auto rounded-full h-24 w-24 object-cover"
                                                        />
                                                    )}
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L36 12"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="file-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                disabled={isUpdating}
                                            >
                                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                                                </span>
                                                {isUpdating ? 'Updating...' : 'Update Profile'}
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditMode(false)}
                                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isChangePasswordMode && (
                    <div className="fixed top-0 left-0 w-full h-full md:relative bg-white z-50 overflow-auto  items-center justify-center">
                        <div className=" min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                            <div className="md:max-w-2xl w-full mx-auto p-4"> {/* Added max-w-2xl */}
                                <div className="w-full  space-y-8">
                                    <div>
                                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                            Change Password
                                        </h2>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmitPassword)} className="mt-8 space-y-6">
                                        <input type="hidden" value="true" />
                                     
                                        <div>
                                            <label htmlFor="password" className="sr-only">New Password</label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="New Password"
                                                    {...register("password")}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    >
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>
                                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="confirm_password" className="sr-only">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    id="confirm_password"
                                                      placeholder="Confirm New Password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    required
                                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"


                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    >
                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    title="privacy"
                                                    id="agreeToPrivacy"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    checked={agreeToPrivacy}
                                                    onChange={() => setAgreeToPrivacy(!agreeToPrivacy)}
                                                />
                                                <label className="ml-2 block text-sm text-gray-900">
                                                    I agree to the privacy policy
                                                </label>
                                            </div>
                                        </div>
                                        <div className="rounded-md shadow-sm -space-y-px">


                                        </div>
                                        {privacyPolicyContent}

                                        <div>
                                            <button
                                                type="submit"
                                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                disabled={isPasswordUpdating || !agreeToPrivacy}
                                            >
                                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                                                </span>
                                                {isPasswordUpdating ? 'Updating...' : 'Change Password'}
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setIsChangePasswordMode(false)}
                                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isViewPicture && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="bg-white rounded-lg p-4 max-w-lg mx-auto"> {/* Increased max-w-lg */}
                            <img
                                src={userData.profile_picture || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                                alt="Full User Avatar"
                                className="rounded-md object-cover w-full h-96" // Increased h-96
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsViewPicture(false)}
                                    className="btn bg-red-500 text-white hover:bg-red-600">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Profile;
// src/pages/auth/Login.tsx

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../../components/navbar/Navbar"; // Adjust path as needed
import authImage from "../../assets/images/auth/wakililogo.jpg"; // Adjust path as needed
import { loginAPI, LoginFormData } from "../../features/login/loginAPI"; // Adjust path as needed
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import { useDispatch } from "react-redux";
import { loginSuccess, UserState, User as UserType } from "../../features/users/userSlice"; // Adjust path as needed

// **Form schema for validation**
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

// Define the expected shape of the user object from the API
interface ApiUser extends UserType {
    user_id: number ;
    phone_number?: string; // Add if it's part of the API response user object
    // Ensure all fields from UserType are covered or extended
}

// Define the expected shape of your API success response
interface LoginApiResponse {
    token: string;
    user: ApiUser;
    message?: string;
}

// Define a more specific type for your API error response
interface LoginErrorData {
    message?: string; // Server's primary error message
    error?: string;   // Alternative key for server's error message
    errors?: Array<{ field?: string; message?: string }>; // For multiple validation errors
}
interface LoginApiError {
    data?: LoginErrorData;
    status?: number;
}


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading: isMutationLoading }] = loginAPI.useLoginUserMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
      resolver: yupResolver(schema)
    });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    let toastId: string | number | undefined;

    try {
      toastId = toast.loading("Attempting to log in...");
      const response = await loginUser(data).unwrap() as LoginApiResponse;

      if (!response.token || !response.user) {
        toast.error(response.message || "Invalid login response from server.", { id: toastId });
        setIsSubmitting(false);
        return;
      }

      // --- Store Token and User Data in localStorage ---
      localStorage.setItem('authToken', response.token);
      const userPayloadForLocalStorageAndSlice: UserType = {
        user_id: Number(response.user.user_id),
        full_name: response.user.full_name,
        email: response.user.email,
        role: response.user.role?.toLowerCase() as UserType['role'],
        address: response.user.address,
        profile_picture: response.user.profile_picture,
        phone_number: response.user.phone_number,
      };
      localStorage.setItem('currentUserData', JSON.stringify(userPayloadForLocalStorageAndSlice));


      // --- Dispatch to Redux Store ---
      const stateToDispatch: UserState = {
        user: userPayloadForLocalStorageAndSlice,
        token: response.token,
      };
      dispatch(loginSuccess(stateToDispatch));

      toast.success("Login successful! Redirecting...", { id: toastId });

      // --- Navigate Based on Role ---
      setTimeout(() => {
        const role = userPayloadForLocalStorageAndSlice.role;
        switch (role) {
          case 'admin':
          case 'manager':
          case 'support':
          case 'lawyer':
          case 'user':
          case 'client':
          case 'clerks':
            navigate('/dashboard');
            break;
          default:
            navigate('/');
            break;
        }
      }, 1500);

    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.error("Login Error Details:", err); // Log the raw error in dev for inspection
      }

      let errorMessageToShowOnToast = "Login failed. Please check your connection or try again later.";

      if (typeof err === 'object' && err !== null) {
        const apiError = err as LoginApiError;

        // Prioritize server-sent message for typical login failure statuses (400, 401, 403)
        if (apiError.status && (apiError.status === 400 || apiError.status === 401 || apiError.status === 403)) {
          if (apiError.data) {
            if (apiError.data.message) { // Server sends a specific 'message'
              errorMessageToShowOnToast = apiError.data.message;
            } else if (apiError.data.error) { // Server might send 'error' instead of 'message'
              errorMessageToShowOnToast = apiError.data.error;
            } else if (Array.isArray(apiError.data.errors) && apiError.data.errors.length > 0) {
              // Handle array of errors, often from validation
              errorMessageToShowOnToast = apiError.data.errors
                .map(e => e.message || `Error with field ${e.field || 'unknown'}`)
                .filter(Boolean)
                .join('\n') // Join with newline for readability on toast
                || "Invalid input. Please check the fields.";
            } else if (apiError.status === 401) {
              // Fallback for 401 if no specific message from server
              errorMessageToShowOnToast = "Invalid email or password. Please try again.";
            } else {
              // Generic message for 400/403 if no specific data.message or data.error
              errorMessageToShowOnToast = "Login failed. Please check your password  .";
            }
          } else if (apiError.status === 401) {
             // Fallback for 401 if no data object at all from server
            errorMessageToShowOnToast = "Invalid email or password. Please try again.";
          }
        }
        // Handle network error (status 0 or undefined status but data is missing)
        else if (apiError.status === 0 || (apiError.status === undefined && !apiError.data)) {
             errorMessageToShowOnToast = "Network error. Unable to connect to the server.";
        }
        // For other server errors (e.g., 5xx), or if 'data.message' or 'data.error' is available for an unhandled status
        else if (apiError.data) {
            if (apiError.data.message) {
                errorMessageToShowOnToast = apiError.data.message;
            } else if (apiError.data.error) {
                errorMessageToShowOnToast = apiError.data.error;
            }
        }
        // Fallback for other structured API errors with a status but no specific message
        else if (apiError.status) {
            errorMessageToShowOnToast = `Login attempt failed (Status: ${apiError.status}). Please try again.`;
        }
      } else if (err instanceof Error) { // Fallback for generic JavaScript errors
        errorMessageToShowOnToast = import.meta.env.PROD ? "An unexpected error occurred during login." : err.message;
      }

      toast.error(errorMessageToShowOnToast, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isMutationLoading || isSubmitting;

  return (
    <div className="pt-16 pb-16 lg:pb-0">
      <Toaster
        position="top-right"
        richColors
      />
      <Navbar />
      <div className="flex flex-col lg:flex-row items-stretch bg-[#c2d6c2] justify-center min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-4rem)]">

        <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-200 dark:bg-gray-700 lg:bg-transparent p-6 sm:p-10 lg:p-8 order-1">
          <img
            src={authImage}
            alt="Authentication"
            className="max-w-md w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-6 lg:p-8 order-2">
          <div className="card bg-base-100 w-full max-w-md shadow-2xl rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6 sm:p-8">
              <h2 className="text-center text-[#006400] text-2xl sm:text-3xl font-bold mb-6">
                Login To Access Services ✅
              </h2>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Email</span></label>
                <input
                  type="email"
                  placeholder="e.g. john.doe@example.com"
                  className="input input-bordered w-full focus:ring-green-500 focus:border-green-500"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
              </div>

              <div className="form-control mb-2">
                <label className="label pb-1"><span className="label-text text-gray-700">Password</span></label>
                <input
                  type="password"
                  placeholder="******"
                  className="input input-bordered w-full focus:ring-green-500 focus:border-green-500"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>}
              </div>

              <div className="text-right mb-4">
                <label className="label justify-end pb-0 pt-0">
                  <Link to="/forgot-password" className="label-text-alt link link-hover text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </label>
              </div>

              <div className="form-control mt-4">
                <button
                  type="submit"
                  className="btn bg-[#006400] text-white hover:bg-green-600 border-none w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      <span className="text-white">Logging in...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              <div className="text-center mt-6">
                <Link to="/register" className="text-sm text-[#006400] hover:text-green-600 hover:underline font-medium">
                  Don't have an account? Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
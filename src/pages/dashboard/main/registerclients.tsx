import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toaster, toast } from 'sonner';
import { usersAPI } from "../../../features/users/usersAPI";
import { X, User, Mail, Phone, MapPin, Lock, Loader2 } from 'lucide-react';

// --- Type Definitions ---
type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  password: string;
  confirmPassword: string;
};

interface ErrorResponse {
    message?: string;
    errors?: Array<{ message?: string }>;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// --- Validation Schema (Unchanged) ---
const schema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone_number: yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required")
});


const AddClientModal = ({ isOpen, onClose, onSuccess }: AddClientModalProps) => {
  const [createUser, { isLoading }] = usersAPI.useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formattedData = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        password: data.password,
        role: "client" 
      };
      await createUser(formattedData).unwrap();
      toast.success("Client registered successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      const error = err as { data?: ErrorResponse; status?: number };
      console.error("Registration error object:", err);
      if (error.data) {
        const message = Array.isArray(error.data.errors) 
          ? error.data.errors.map(e => e.message).join(', ') 
          : error.data.message;
        toast.error(message || "An unknown registration error occurred.");
      } else {
        toast.error("Registration failed. Please check your connection.");
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  // Modernized InputField helper with dark mode support
  const InputField = ({ id, type, placeholder, icon, registerProps, error }: {
    id: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    registerProps: ReturnType<typeof register>;
    error?: { message?: string };
  }) => (
    <div className="form-control mb-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`
            w-full pl-11 pr-4 py-2.5 rounded-lg
            bg-slate-100 dark:bg-slate-700
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            border border-slate-300 dark:border-slate-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}
          `}
          {...registerProps}
        />
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{error.message}</p>}
    </div>
  );

  return (
    <>
      <Toaster position="top-right" richColors />
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* --- Modal Header --- */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              Register New Client
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full p-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* --- Modal Body (The Form) --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <InputField
              id="full_name"
              type="text"
              placeholder="Full Name"
              icon={<User className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("full_name")}
              error={errors.full_name}
            />
            <InputField
              id="email"
              type="email"
              placeholder="Email Address"
              icon={<Mail className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("email")}
              error={errors.email}
            />
            <InputField
              id="phone_number"
              type="tel"
              placeholder="Phone Number (e.g. 0712345678)"
              icon={<Phone className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("phone_number")}
              error={errors.phone_number}
            />
            <InputField
              id="address"
              type="text"
              placeholder="Physical Address"
              icon={<MapPin className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("address")}
              error={errors.address}
            />
            <InputField
              id="password"
              type="password"
              placeholder="Create Password"
              icon={<Lock className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("password")}
              error={errors.password}
            />
            <InputField
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              icon={<Lock className="text-slate-400 dark:text-slate-500" size={20} />}
              registerProps={register("confirmPassword")}
              error={errors.confirmPassword}
            />

            {/* --- Submit Button --- */}
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="
                  btn w-full h-12 text-base font-bold text-white 
                  bg-blue-600 hover:bg-blue-700
                  dark:bg-blue-500 dark:hover:bg-blue-600 
                  border-none rounded-lg
                  transition-all duration-300
                  flex items-center justify-center
                  disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600
                " 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={22} />
                    <span>Registering...</span>
                  </>
                ) : (
                  "Register Client"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddClientModal;
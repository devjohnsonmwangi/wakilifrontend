import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../../components/navbar/Navbar";
import authImage from "../../assets/images/auth/wakililogo.jpg"; // Ensure this path is correct
import { usersAPI } from "../../features/users/usersAPI";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';

type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  password: string;
  confirmPassword: string;
  image_url?: string;
  role?: string;
};

interface ErrorResponse {
    message?: string;
    errors?: Array<{ message?: string }>;
}

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

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = usersAPI.useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formattedData = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        password: data.password,
        image_url: data.image_url || "https://randomuser.me/api/portraits/men/1.jpg",
        role: data.role || "user"
      };
      await createUser(formattedData).unwrap();
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const error = err as { data?: ErrorResponse; status?: number };
      console.error("Registration error object:", err);
      if (error.data) {
        if (Array.isArray(error.data.errors) && error.data.errors.length > 0) {
          error.data.errors.forEach((errorItem: { message?: string }) => {
            if (errorItem.message) toast.error(`${errorItem.message}`);
          });
        } else if (error.data.message) {
          toast.error(`${error.data.message}`);
        } else {
          toast.error("Registration failed. An unknown error occurred.");
        }
      } else {
        toast.error("Registration failed. Please check your internet connection and try again.");
      }
    }
  };

  return (
    <div className="pt-16 pb-16 lg:pb-0"> {/* Padding for fixed navbars */}
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="flex flex-col lg:flex-row items-stretch bg-[#c2d6c2] justify-center min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-4rem)]">

        <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-700 lg:bg-transparent p-6 sm:p-10 lg:p-8 order-1">
          <img
            src={authImage}
            alt="Authentication"
            className="max-w-md w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-6 order-2">
          {/* MODIFICATION 1: Added lg:max-h-[75vh] to the card */}
          <div className="card w-full bg-[#fefffe] max-w-md shadow-xl rounded-lg lg:max-h-[75vh]">
            {/* MODIFICATION 2: Added lg:overflow-y-auto to the form (card-body) */}
            <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6 sm:p-8 lg:overflow-y-auto">
              <h2 className="text-center text-[#006400] text-2xl sm:text-3xl font-bold mb-6">Create An Account 📢</h2>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Full Name</span></label>
                <input type="text" placeholder="e.g. John Doe" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("full_name")} />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name?.message}</p>}
              </div>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Email</span></label>
                <input type="email" placeholder="e.g. john.doe@example.com" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("email")} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
              </div>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Phone Number</span></label>
                <input type="tel" placeholder="e.g. 0712345678" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("phone_number")} />
                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number?.message}</p>}
              </div>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Address</span></label>
                <input type="text" placeholder="e.g. 123 Main St, City" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("address")} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>}
              </div>

              <div className="form-control mb-3">
                <label className="label pb-1"><span className="label-text text-gray-700">Password</span></label>
                <input type="password" placeholder="******" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("password")} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>}
              </div>

              <div className="form-control mb-4">
                <label className="label pb-1"><span className="label-text text-gray-700">Confirm Password</span></label>
                <input type="password" placeholder="******" className="input input-bordered w-full focus:ring-green-500 focus:border-green-500" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>}
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn bg-[#006400] text-white hover:bg-green-600 border-none w-full" disabled={isLoading}>
                  {isLoading ? <span className="loading loading-spinner"></span> : "Register"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-[#006400] hover:text-green-600 hover:underline font-medium">
                  Already have an account? Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
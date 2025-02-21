import { useSelector } from 'react-redux';
import { useCreateCaseMutation } from '../../../../features/case/caseAPI';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RootState } from '../../../../app/store';
import { Toaster, toast } from 'sonner';

// Define the types for the case data
type CaseType = 'criminal' | 'civil' | 'family' | 'corporate' | 'property' | 'employment' | 'intellectual_property' | 'immigration' | 'elc' | 'childrenCase' | 'tribunal' | 'conveyances';
type CaseStatus = 'open' | 'in_progress' | 'closed';
type PaymentStatus = 'pending' | 'paid' | 'failed';

// Define the type for form data
interface FormData {
  case_type: CaseType;
  case_status: CaseStatus;
  case_number: string;
  case_track_number: string;
  court: string;
  station: string;
  parties: string;
  fee: number;
  payment_status: PaymentStatus;
  case_description: string;
}

// Validation schema using Yup
const validationSchema = yup.object().shape({
  case_type: yup.string().oneOf(['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration', 'elc', 'childrenCase', 'tribunal', 'conveyances']).required('Case type is required'),
  case_status: yup.string().oneOf(['open', 'in_progress', 'closed']).required('Case status is required'),
  case_number: yup.string().required('Case number is required').min(5, 'Case number must be at least 5 characters'),
  case_track_number: yup.string().required('Track number is required').min(5, 'Track number must be at least 5 characters'),
  court: yup.string().required('Court is required'),
  station: yup.string().required('Court station is required'),
  parties: yup.string().required('Parties are required').min(5, 'Parties must be at least 5 characters'),
  fee: yup.number().typeError('Fee must be a number').required('Fee is required').positive('Fee must be a positive number'),
  payment_status: yup.string().oneOf(['pending', 'paid', 'failed']).required('Payment status is required'),
  case_description: yup.string().required('Case description is required').min(10, 'Description must be at least 10 characters'),
});

const CreateCaseForm: React.FC = () => {
  const [createCase, { isLoading, isSuccess, isError }] = useCreateCaseMutation();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.user?.user_id ?? 0;

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      case_type: 'criminal',
      case_status: 'open',
      case_description: '',
      case_number: '',
      case_track_number: '',
      court: '',
      station: '',
      parties: '',
      fee: 0,
      payment_status: 'pending',
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const caseData = {
        ...formData,
        user_id: userId,
        case_type: formData.case_type as CaseType,
        case_status: formData.case_status as CaseStatus,
      };

      await createCase(caseData).unwrap();
      toast.success('🎉 Case created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('❌ Failed to create case.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <Toaster
        toastOptions={{
          classNames: {
            error: 'bg-red-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }}
      />
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full sm:w-4/5 max-w-4xl bg-white p-4 sm:p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="bg-blue-500 text-white text-2xl font-bold text-center py-4 rounded-md">Create a New Case</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Case Type */}
          <div className="flex flex-col">
            <label htmlFor="case_type" className="font-medium text-gray-700">Case Type</label>
            <select 
              {...register('case_type')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
              <option value="family">Family</option>
              <option value="corporate">Corporate</option>
              <option value="property">Property</option>
              <option value="employment">Employment</option>
              <option value="intellectual_property">Intellectual Property</option>
              <option value="immigration">Immigration</option>
              <option value="elc">ELC</option>
              <option value="childrenCase">Children's Case</option>
              <option value="tribunal">Tribunal</option>
              <option value="conveyances">Conveyances</option>
            </select>
            {errors.case_type && <p className="text-red-500 text-sm">{errors.case_type.message}</p>}
          </div>

          {/* Case Status */}
          <div className="flex flex-col">
            <label htmlFor="case_status" className="font-medium text-gray-700">Case Status</label>
            <select 
              {...register('case_status')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            {errors.case_status && <p className="text-red-500 text-sm">{errors.case_status.message}</p>}
          </div>

          {/* Case Number */}
          <div className="flex flex-col">
            <label htmlFor="case_number" className="font-medium text-gray-700">Case Number</label>
            <input 
              type="text" 
              {...register('case_number')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.case_number && <p className="text-red-500 text-sm">{errors.case_number.message}</p>}
          </div>

          {/* Case Track Number */}
          <div className="flex flex-col">
            <label htmlFor="case_track_number" className="font-medium text-gray-700">Track Number</label>
            <input 
              type="text" 
              {...register('case_track_number')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.case_track_number && <p className="text-red-500 text-sm">{errors.case_track_number.message}</p>}
          </div>

          {/* Court */}
          <div className="flex flex-col">
            <label htmlFor="court" className="font-medium text-gray-700">Court</label>
            <input 
              type="text" 
              {...register('court')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.court && <p className="text-red-500 text-sm">{errors.court.message}</p>}
          </div>

          {/* Station */}
          <div className="flex flex-col">
            <label htmlFor="station" className="font-medium text-gray-700">Station</label>
            <input 
              type="text" 
              {...register('station')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.station && <p className="text-red-500 text-sm">{errors.station.message}</p>}
          </div>

          {/* Parties */}
          <div className="flex flex-col">
            <label htmlFor="parties" className="font-medium text-gray-700">Parties</label>
            <input 
              type="text" 
              {...register('parties')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.parties && <p className="text-red-500 text-sm">{errors.parties.message}</p>}
          </div>

          {/* Fee */}
          <div className="flex flex-col">
            <label htmlFor="fee" className="font-medium text-gray-700">Fee</label>
            <input 
              type="number" 
              {...register('fee')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.fee && <p className="text-red-500 text-sm">{errors.fee.message}</p>}
          </div>

          {/* Payment Status */}
          <div className="flex flex-col">
            <label htmlFor="payment_status" className="font-medium text-gray-700">Payment Status</label>
            <select 
              {...register('payment_status')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            {errors.payment_status && <p className="text-red-500 text-sm">{errors.payment_status.message}</p>}
          </div>

          {/* Case Description */}
          <div className="sm:col-span-2">
            <label htmlFor="case_description" className="font-medium text-gray-700">Case Description</label>
            <textarea 
              {...register('case_description')} 
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              rows={4}
            ></textarea>
            {errors.case_description && <p className="text-red-500 text-sm">{errors.case_description.message}</p>}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full sm:w-56 bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Create Case'}
        </button>

        {isSuccess && <p className="text-green-500 text-center mt-4">Case created successfully!</p>}
        {isError && <p className="text-red-500 text-center mt-4">Error creating case. Please try again.</p>}
      </form>
    </div>
  );
};

export default CreateCaseForm;

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    // Clear the cart after successful payment
    dispatch(clearCart());

    // Redirect to enrolled courses after 5 seconds
    const timer = setTimeout(() => {
      navigate('/enrolled-courses');
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600">Payment Reference:</p>
          <p className="text-gray-900 font-medium">{reference}</p>
        </div>
        <p className="text-sm text-gray-500">
          You will be redirected to your enrolled courses in 5 seconds...
        </p>
        <button
          onClick={() => navigate('/enrolled-courses')}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 
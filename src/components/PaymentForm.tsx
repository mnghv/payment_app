import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { UserInfo, checkExistingUserFromStorage } from '../utils/userUtils';

interface Plan {
    price: number;
    priceId: string;
}

interface Plans {
    [key: string]: Plan;
}

const PaymentForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        email: '',
        phone: '',
    });
    const [hasExistingPayment, setHasExistingPayment] = useState(false);
    const [existingUserId, setExistingUserId] = useState<number | null>(null);

    useEffect(() => {
        if (location.state?.selectedPlan) {
            setSelectedPlan(location.state.selectedPlan);
        } else {
            navigate('/');
        }

        const initializeUserInfo = async () => {
            const result = await checkExistingUserFromStorage();
            setHasExistingPayment(result.hasExistingPayment);
            setExistingUserId(result.existingUserId);
            setUserInfo(result.userInfo);
        };
        initializeUserInfo();
    }, [location.state, navigate]);

    const plans: Plans = {
        Starter: { price: 299, priceId: 'price_1RoOt0JfdX3e7oAIieuS94UY' },
        Growth: { price: 449, priceId: 'price_1RoOs8JfdX3e7oAIlZVdroZG' },
        Scaling: { price: 649, priceId: 'price_1RoOuvJfdX3e7oAIBBCvyXi0' },
        Enterprise: { price: 899, priceId: 'price_1RoOvFJfdX3e7oAIQ6GpnCpt' },
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedPlan) {
            console.error('Selected plan not available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError(
                    'Please complete your profile first. Go to Profile page to set up your account.'
                );
                setLoading(false);
                return;
            }

            const subscribeResponse = await axios.post('/api/subscribe', {
                user_id: parseInt(userId),
                plan_name: selectedPlan,
                price_id: plans[selectedPlan].priceId,
            });

            if (subscribeResponse.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(
                    subscribeResponse.data.message ||
                        'Failed to create subscription'
                );
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(
                err.response?.data?.message ||
                    'An error occurred. Please try again.'
            );
        }

        setLoading(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#374151',
                '::placeholder': {
                    color: '#9ca3af',
                },
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                fontFamily: 'Inter, system-ui, sans-serif',
            },
            invalid: {
                color: '#ef4444',
            },
        },
        hidePostalCode: true,
    };

    if (!selectedPlan) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-xl shadow-soft p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            Complete Your Subscription
                        </h1>
                        <p className='text-gray-600'>
                            You're subscribing to the{' '}
                            <span className='font-semibold text-primary-600'>
                                {selectedPlan}
                            </span>{' '}
                            plan for ${plans[selectedPlan].price}/month
                        </p>
                    </div>

                    {success && (
                        <div className='alert alert-success mb-8'>
                            <h3 className='text-lg font-semibold mb-2'>
                                🎉 Payment Successful!
                            </h3>
                            <p>
                                Your subscription to the {selectedPlan} plan has
                                been activated. You'll be redirected to the home
                                page shortly.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className='alert alert-error mb-8'>
                            <h3 className='text-lg font-semibold mb-2'>
                                ❌ Payment Failed
                            </h3>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-8'>
                        {hasExistingPayment ? (
                            <div className='space-y-6'>
                                <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                    Your Information
                                </h3>

                                <div className='bg-gray-50 rounded-lg p-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                        <div>
                                            <label className='text-sm font-medium text-gray-700'>
                                                Full Name
                                            </label>
                                            <p className='text-gray-900 mt-1'>
                                                {userInfo.name || 'Not set'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='text-sm font-medium text-gray-700'>
                                                Email Address
                                            </label>
                                            <p className='text-gray-900 mt-1'>
                                                {userInfo.email || 'Not set'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='text-sm font-medium text-gray-700'>
                                                Phone Number
                                            </label>
                                            <p className='text-gray-900 mt-1'>
                                                {userInfo.phone || 'Not set'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <button
                                            type='button'
                                            onClick={() => navigate('/profile')}
                                            className='text-primary-600 hover:text-primary-700 text-sm font-medium'>
                                            Update Profile →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                    Profile Required
                                </h3>

                                <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0'>
                                            <svg
                                                className='h-5 w-5 text-red-400'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </div>
                                        <div className='ml-3'>
                                            <h3 className='text-sm font-medium text-red-800'>
                                                Profile Incomplete
                                            </h3>
                                            <p className='text-sm text-red-700 mt-1'>
                                                Please complete your profile
                                                before proceeding with payment.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <button
                                            type='button'
                                            onClick={() => navigate('/profile')}
                                            className='btn btn-primary'>
                                            Complete Profile →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasExistingPayment && (
                            <div className='space-y-6'>
                                <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                    Payment Method
                                </h3>

                                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0'>
                                            <svg
                                                className='h-5 w-5 text-green-400'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </div>
                                        <div className='ml-3'>
                                            <h3 className='text-sm font-medium text-green-800'>
                                                Payment Method Ready
                                            </h3>
                                            <p className='text-sm text-green-700 mt-1'>
                                                Your saved payment method will
                                                be used for this subscription.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='space-y-6'>
                            <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                Order Summary
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-6 space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-600'>Plan:</span>
                                    <span className='font-semibold text-gray-900'>
                                        {selectedPlan}
                                    </span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-600'>
                                        Monthly Price:
                                    </span>
                                    <span className='font-semibold text-gray-900'>
                                        ${plans[selectedPlan].price}
                                    </span>
                                </div>
                                <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
                                    <span className='text-lg font-semibold text-gray-900'>
                                        Total:
                                    </span>
                                    <span className='text-lg font-bold text-primary-600'>
                                        ${plans[selectedPlan].price}/month
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                            <button
                                type='button'
                                className='btn btn-secondary flex-1'
                                onClick={() => navigate('/')}
                                disabled={loading}>
                                Back to Plans
                            </button>
                            <button
                                type={hasExistingPayment ? 'submit' : 'button'}
                                onClick={
                                    hasExistingPayment
                                        ? handleSubmit
                                        : () => navigate('/profile')
                                }
                                className={`btn btn-primary flex-1 ${
                                    !hasExistingPayment
                                        ? 'opacity-80 cursor-not-allowed'
                                        : 'cursor-pointer'
                                }`}
                                disabled={
                                    !stripe || loading || !hasExistingPayment
                                }>
                                {loading && (
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                )}
                                {loading
                                    ? 'Processing...'
                                    : `Subscribe to ${selectedPlan}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;

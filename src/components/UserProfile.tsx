import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import {
    UserInfo,
    checkExistingUserFromStorage,
    checkExistingUser,
} from '../utils/userUtils';

const UserProfile: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        email: '',
        phone: '',
    });
    const [hasExistingPayment, setHasExistingPayment] = useState(false);
    const [existingUserId, setExistingUserId] = useState<number | null>(null);

    useEffect(() => {
        const checkForExistingUser = async () => {
            const result = await checkExistingUserFromStorage();
            setHasExistingPayment(result.hasExistingPayment);
            setExistingUserId(result.existingUserId);
            setUserInfo(result.userInfo);
        };
        checkForExistingUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === 'email') {
            checkExistingUser(e.target.value).then((result) => {
                setHasExistingPayment(result.hasExistingPayment);
                setExistingUserId(result.existingUserId);
                setUserInfo(result.userInfo);
            });
        }
    };

    const handleSaveProfile = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe is not loaded');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!hasExistingPayment) {
                const { error: paymentMethodError, paymentMethod } =
                    await stripe.createPaymentMethod({
                        type: 'card',
                        card: elements.getElement(CardElement)!,
                        billing_details: {
                            name: userInfo.name,
                            email: userInfo.email,
                            phone: userInfo.phone,
                        },
                    });

                if (paymentMethodError) {
                    setError(
                        paymentMethodError.message ||
                            'Payment method creation failed'
                    );
                    setLoading(false);
                    return;
                }

                const saveResponse = await axios.post(
                    '/api/save-payment-method',
                    {
                        payment_method_id: paymentMethod.id,
                        user_info: userInfo,
                    }
                );

                if (saveResponse.data.success) {
                    setExistingUserId(saveResponse.data.user_id);
                    setHasExistingPayment(true);
                    setSuccess(true);
                    localStorage.setItem('userEmail', userInfo.email);
                    localStorage.setItem(
                        'userId',
                        saveResponse.data.user_id.toString()
                    );
                } else {
                    setError(
                        saveResponse.data.message ||
                            'Failed to save payment method'
                    );
                }
            } else {
                setSuccess(true);
                localStorage.setItem('userEmail', userInfo.email);
                if (existingUserId) {
                    localStorage.setItem('userId', existingUserId.toString());
                }
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

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-xl shadow-soft p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            {hasExistingPayment
                                ? 'Update Your Profile'
                                : 'Complete Your Profile'}
                        </h1>
                        <p className='text-gray-600'>
                            {hasExistingPayment
                                ? 'Update your information and payment method'
                                : 'Enter your information and save a payment method for future purchases'}
                        </p>
                    </div>

                    {success && (
                        <div className='alert alert-success mb-8'>
                            <h3 className='text-lg font-semibold mb-2'>
                                🎉 Profile Saved Successfully!
                            </h3>
                            <p>
                                Your information and payment method have been
                                saved. You can now subscribe to plans without
                                entering your details again.
                            </p>
                            <div className='mt-4 flex gap-4'>
                                <button
                                    onClick={() => navigate('/')}
                                    className='btn btn-primary'>
                                    Browse Plans
                                </button>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className='btn btn-secondary'>
                                    Make Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className='alert alert-error mb-8'>
                            <h3 className='text-lg font-semibold mb-2'>
                                ❌ Error
                            </h3>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className='space-y-8'>
                        <div className='space-y-6'>
                            <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                Personal Information
                            </h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        className='form-label'
                                        htmlFor='name'>
                                        Full Name
                                    </label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        className='form-control'
                                        value={userInfo.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className='form-label'
                                        htmlFor='email'>
                                        Email Address
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        className='form-control'
                                        value={userInfo.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label
                                        className='form-label'
                                        htmlFor='phone'>
                                        Phone Number
                                    </label>
                                    <input
                                        type='tel'
                                        id='phone'
                                        name='phone'
                                        className='form-control'
                                        value={userInfo.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='space-y-6'>
                            <h3 className='text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                                Payment Information
                            </h3>

                            {hasExistingPayment ? (
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
                                                ✅ Payment Method Already Saved
                                            </h3>
                                            <p className='text-sm text-green-700 mt-1'>
                                                This user already has a payment
                                                method saved. You can update
                                                personal information above.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className='form-label'>
                                        💳 Card Details
                                    </label>
                                    <div className='mt-2'>
                                        <CardElement
                                            options={cardElementOptions}
                                            className='form-control'
                                        />
                                    </div>
                                    <p className='text-sm text-gray-500 mt-2'>
                                        Enter your card details to save for
                                        future purchases.
                                    </p>
                                </div>
                            )}
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
                                type='submit'
                                className='btn btn-primary flex-1'
                                disabled={!stripe || loading}>
                                {loading && (
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                )}
                                {loading
                                    ? 'Saving...'
                                    : hasExistingPayment
                                    ? 'Update Profile'
                                    : 'Save Profile & Payment Method'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

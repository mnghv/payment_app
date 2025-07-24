import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Plan {
    name: string;
    price: number;
    range: string;
    bookkeepingType: string;
    reports: string;
    bookkeeper: boolean;
    integration: boolean;
}

const PricingTable: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        'software' | 'bookkeeping' | 'bookkeepers'
    >('bookkeeping');
    const navigate = useNavigate();

    const plans: Plan[] = [
        {
            name: 'Starter',
            price: 299,
            range: '$0 - $15k',
            bookkeepingType: 'Cash basis',
            reports: 'Basic Reports',
            bookkeeper: true,
            integration: true,
        },
        {
            name: 'Growth',
            price: 449,
            range: '$15k - $50k',
            bookkeepingType: 'Modified Cash or Accrual',
            reports: 'Advanced Reports',
            bookkeeper: true,
            integration: true,
        },
        {
            name: 'Scaling',
            price: 649,
            range: '$50k - $100k',
            bookkeepingType: 'Modified Cash or Accrual',
            reports: 'Advanced Reports',
            bookkeeper: true,
            integration: true,
        },
        {
            name: 'Enterprise',
            price: 899,
            range: '$100k+',
            bookkeepingType: 'Modified Cash or Accrual',
            reports: 'CFO-Type Insights',
            bookkeeper: true,
            integration: true,
        },
    ];

    const handleSubscribe = (planName: string) => {
        navigate('/payment', { state: { selectedPlan: planName } });
    };

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Navigation Tabs */}
                <div className='flex justify-center mb-12'>
                    <div className='bg-white rounded-lg p-1 shadow-soft'>
                        <button
                            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                                activeTab === 'software'
                                    ? 'bg-primary-600 text-white shadow-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('software')}>
                            Software Plans
                        </button>
                        <button
                            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                                activeTab === 'bookkeeping'
                                    ? 'bg-primary-600 text-white shadow-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('bookkeeping')}>
                            Bookkeeping Services
                        </button>
                        <button
                            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                                activeTab === 'bookkeepers'
                                    ? 'bg-primary-600 text-white shadow-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('bookkeepers')}>
                            Bookkeepers & Firms
                        </button>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-xl shadow-soft p-8 hover:shadow-medium transition-shadow duration-300'>
                            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                                {plan.name}
                            </h3>
                            <div className='mb-6'>
                                <div className='flex items-baseline'>
                                    <span className='text-4xl font-bold text-primary-600'>
                                        ${plan.price}
                                    </span>
                                    <span className='text-gray-500 ml-2'>
                                        /month
                                    </span>
                                </div>
                                <div className='text-sm text-gray-600 mt-2'>
                                    {plan.range}
                                    <span className='block text-xs text-gray-500'>
                                        in monthly expenses
                                    </span>
                                </div>
                            </div>
                            <button
                                className='w-full btn btn-primary'
                                onClick={() => handleSubscribe(plan.name)}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                {/* Profile Setup Section */}
                <div className='bg-white rounded-xl shadow-soft p-8 mb-8'>
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            Ready to Get Started?
                        </h2>
                        <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
                            Complete your profile and save your payment method
                            to get started with your subscription. This will
                            make future purchases quick and easy.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <button
                                onClick={() => navigate('/profile')}
                                className='btn btn-primary'>
                                Complete Your Profile
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className='btn btn-secondary'>
                                Browse Plans
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className='bg-white rounded-xl shadow-soft overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200'>
                                        Features
                                    </th>
                                    {plans.map((plan, index) => (
                                        <th
                                            key={index}
                                            className='px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200'>
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                <tr>
                                    <td className='px-6 py-4 text-sm text-gray-900 font-medium'>
                                        Bookkeeping Type
                                    </td>
                                    {plans.map((plan, index) => (
                                        <td
                                            key={index}
                                            className='px-6 py-4 text-sm text-gray-600 text-center'>
                                            {plan.bookkeepingType}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className='px-6 py-4 text-sm text-gray-900 font-medium'>
                                        Monthly Tax-Ready Financial Package
                                    </td>
                                    {plans.map((plan, index) => (
                                        <td
                                            key={index}
                                            className='px-6 py-4 text-sm text-gray-600 text-center'>
                                            {plan.reports}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className='px-6 py-4 text-sm text-gray-900 font-medium'>
                                        Dedicated U.S.-Based Bookkeeper &
                                        Support
                                    </td>
                                    {plans.map((plan, index) => (
                                        <td
                                            key={index}
                                            className='px-6 py-4 text-center'>
                                            <span className='inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium'>
                                                ✓
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className='px-6 py-4 text-sm text-gray-900 font-medium'>
                                        Automated Selling Channel Integration &
                                        Payout Reconciliation
                                    </td>
                                    {plans.map((plan, index) => (
                                        <td
                                            key={index}
                                            className='px-6 py-4 text-center'>
                                            <span className='inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium'>
                                                ✓
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingTable;

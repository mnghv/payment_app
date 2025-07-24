import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PricingTable from './components/PricingTable';
import PaymentForm from './components/PaymentForm';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Routes>
                <Route path='/' element={<PricingTable />} />
                <Route path='/profile' element={<UserProfile />} />
                <Route path='/payment' element={<PaymentForm />} />
            </Routes>
        </div>
    );
};

export default App;

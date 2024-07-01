'use client'

import { useState } from 'react';
import FlutterwavePayment from '../components/FlutterwavePayment';

const PaymentPage = () => {
  const [amount, setAmount] = useState(1000); // Example amount

  return (
    <div>
      <h1>Payment Page</h1>
      <FlutterwavePayment amount={amount} />
    </div>
  );
};

export default PaymentPage;

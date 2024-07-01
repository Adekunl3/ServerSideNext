

import React from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

const FlutterwavePayment = ({ amount }) => {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card, banktransfer, ussd',
    customer: {
      email: 'user@example.com',
      phonenumber: '08012345678',
      name: 'John Doe',
    },
    customizations: {
      title: 'My Store',
      description: 'Payment for items in cart',
      logo: 'https://example.com/logo.png',
    },
  };

  const handleFlutterwavePayment = (response) => {
    console.log(response);
    closePaymentModal(); // This will close the modal programmatically
    // Implement additional logic such as verifying payment on the server
  };

  const fwConfig = {
    ...config,
    text: 'Pay with Flutterwave',
    callback: handleFlutterwavePayment,
    onClose: () => {
      console.log('Payment closed');
    },
  };

  return <FlutterWaveButton {...fwConfig} />;
};

export default FlutterwavePayment;

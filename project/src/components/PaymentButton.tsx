import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { createCheckoutSession } from '../lib/stripe';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  type: 'subscription' | 'book';
  bookId?: string;
  className?: string;
  children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  type,
  bookId,
  className,
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAppStore();

  const handlePayment = async () => {
    if (!auth.user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setIsLoading(true);
    try {
      await createCheckoutSession({
        type,
        userId: auth.user.id,
        bookId,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default PaymentButton;
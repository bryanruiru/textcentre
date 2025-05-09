interface PaystackConfig {
  email: string;
  amount: number;
  metadata: {
    userId: string;
    bookId?: string;
    type: 'subscription' | 'book';
  };
  callback: (response: any) => void;
  onClose: () => void;
}

export const initializePayment = (config: PaystackConfig) => {
  // @ts-ignore
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount * 100, // Convert to kobo
    currency: 'KES',
    metadata: config.metadata,
    callback: config.callback,
    onClose: config.onClose,
  });

  handler.openIframe();
};

export const formatKES = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};
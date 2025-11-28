import { useState } from 'react';
import api from '../api';

function PaymentForm({ sessionDetails, onSuccess, onCancel }) {
  const [selectedProvider, setSelectedProvider] = useState('jazzcash');
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!customerInfo.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^03\d{9}$/.test(customerInfo.mobile)) {
      newErrors.mobile = 'Invalid Pakistani mobile number (03XXXXXXXXX)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initiatePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await api.post('/payment/initiate', {
        amount: sessionDetails.totalAmount,
        customer_email: customerInfo.email,
        customer_mobile: customerInfo.mobile,
        description: `Tutoring Session - ${sessionDetails.subject}`,
        session_id: sessionDetails.id,
        provider: selectedProvider
      });

      if (response.data.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.data.payment_url;
      } else if (response.data.form_data) {
        // For JazzCash, we need to submit a form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.payment_url;
        
        Object.entries(response.data.form_data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.detail || 'Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card-static max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Payment Details
      </h2>

      {/* Session Summary */}
      <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl mb-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Session Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Subject</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {sessionDetails.subject}
            </span>
          </div>
          {sessionDetails.topic && (
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Topic</span>
              <span className="text-[var(--color-text-primary)]">
                {sessionDetails.topic}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Duration</span>
            <span className="text-[var(--color-text-primary)]">
              {sessionDetails.duration} hour(s)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Date & Time</span>
            <span className="text-[var(--color-text-primary)]">
              {new Date(sessionDetails.scheduled_date).toLocaleDateString()} at {sessionDetails.scheduled_time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Teacher</span>
            <span className="text-[var(--color-text-primary)]">
              {sessionDetails.teacher_name}
            </span>
          </div>
          <div className="divider my-3"></div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Hourly Rate</span>
            <span className="text-[var(--color-text-primary)]">
              {formatCurrency(sessionDetails.hourly_rate)}/hr
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--color-border)]">
            <span>Total Amount</span>
            <span className="text-[var(--color-primary)]">
              {formatCurrency(sessionDetails.totalAmount || sessionDetails.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-[var(--color-text-primary)]">
          Contact Information
        </h3>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            className={`input-field ${errors.email ? 'border-[var(--color-error)]' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-[var(--color-error)] mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            value={customerInfo.mobile}
            onChange={(e) => setCustomerInfo({...customerInfo, mobile: e.target.value})}
            className={`input-field ${errors.mobile ? 'border-[var(--color-error)]' : ''}`}
            placeholder="03001234567"
          />
          {errors.mobile && (
            <p className="text-sm text-[var(--color-error)] mt-1">{errors.mobile}</p>
          )}
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Format: 03XXXXXXXXX (Pakistani mobile number)
          </p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedProvider('jazzcash')}
            className={`p-4 border-2 rounded-xl transition-all ${
              selectedProvider === 'jazzcash'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
          >
            <div className="h-12 flex items-center justify-center mb-2">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                JazzCash
              </div>
            </div>
            <span className="block text-center font-semibold text-[var(--color-text-primary)]">
              JazzCash
            </span>
            <span className="block text-center text-sm text-[var(--color-text-secondary)]">
              Mobile Wallet
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedProvider('easypaisa')}
            className={`p-4 border-2 rounded-xl transition-all ${
              selectedProvider === 'easypaisa'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
          >
            <div className="h-12 flex items-center justify-center mb-2">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                Easypaisa
              </div>
            </div>
            <span className="block text-center font-semibold text-[var(--color-text-primary)]">
              Easypaisa
            </span>
            <span className="block text-center text-sm text-[var(--color-text-secondary)]">
              Mobile Wallet
            </span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            `Pay ${formatCurrency(sessionDetails.totalAmount || sessionDetails.total_amount)} with ${selectedProvider === 'jazzcash' ? 'JazzCash' : 'Easypaisa'}`
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-[var(--color-bg-secondary)] rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">
              Secure Payment
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
        <p className="mb-2">
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click the pay button to be redirected to {selectedProvider === 'jazzcash' ? 'JazzCash' : 'Easypaisa'}</li>
          <li>Complete the payment using your mobile wallet</li>
          <li>You'll be redirected back after successful payment</li>
          <li>Your session will be confirmed automatically</li>
        </ol>
      </div>
    </div>
  );
}

export default PaymentForm;


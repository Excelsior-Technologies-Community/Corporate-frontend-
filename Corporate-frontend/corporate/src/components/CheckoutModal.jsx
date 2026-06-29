import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle2, Loader2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const CheckoutModal = ({ isOpen, onClose, plan }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = success, 3 = error
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsProcessing(false);
      setErrorMessage('');
      setFormData({ email: '', cardNumber: '', expiry: '', cvc: '' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Auto-format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }

    // Auto-format expiry date
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    // CVC: numbers only, max 4 digits
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user is typing
    if (errorMessage) setErrorMessage('');
  };

  if (!isOpen || !plan) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          planName: plan.name,
          price: plan.price,
          cardData: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            expiry: formData.expiry,
            cvc: formData.cvc
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment processing failed. Please try again.');
      }

      setStep(2); // Show success
    } catch (error) {
      console.error('Checkout error:', error);
      // Show inline error if it's a network/server error
      if (error.message === 'Failed to fetch') {
        setErrorMessage('Unable to connect to server. Please make sure the backend is running.');
      } else {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const annualPrice = (plan.price * 12).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 z-10 p-2 bg-black/5 md:bg-white/10 hover:bg-black/10 md:hover:bg-white/20 rounded-full transition-colors text-gray-500 md:text-white disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Left Side ── Plan Details */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#1a1f2c] to-[#2d3748] p-8 md:p-10 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-md border border-white/20">
              Selected Plan
            </div>
            <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed">{plan.description}</p>

            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0" />
                Billed annually at ${annualPrice}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0" />
                Cancel anytime, no questions asked
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 shrink-0" />
                24/7 priority customer support
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 opacity-60">
            <Lock className="w-4 h-4" />
            <span className="text-xs">Secure 256-bit SSL encryption</span>
          </div>
        </div>

        {/* ── Right Side ── Checkout or Success */}
        <div className="w-full md:w-7/12 bg-white p-8 md:p-10 flex flex-col justify-center min-h-[520px]">

          {/* ── STEP 1: Payment Form ── */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-[#4f46e5]" />
                <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">Your payment is secured and encrypted.</p>

              {/* Inline Error Banner */}
              {errorMessage && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isProcessing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all outline-none disabled:bg-gray-50"
                    placeholder="you@company.com"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all outline-none font-mono tracking-widest disabled:bg-gray-50"
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                    />
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all outline-none font-mono disabled:bg-gray-50"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all outline-none font-mono disabled:bg-gray-50"
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isProcessing}
                      className="w-full sm:w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing || !formData.email || !formData.cardNumber || !formData.expiry || !formData.cvc}
                      className="w-full sm:w-2/3 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ${plan.price}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By confirming, you allow Corporate App to charge your card for this and future payments in accordance with their terms.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 2: Success ── */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h3>
              <p className="text-gray-500 mb-2 max-w-sm">
                Welcome to the <strong>{plan.name}</strong> plan.
              </p>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                A receipt has been sent to <strong>{formData.email}</strong>. You now have access to all premium features.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-900 hover:bg-black text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

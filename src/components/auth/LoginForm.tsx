import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Phone, Sparkles, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState<UserRole>('customer');
  const [otpInput, setOtpInput] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

    try {
      // Call Node.js server API to send real OTP email
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      const data = res ? await res.json() : null;

      if (!data || !data.success) {
        setErrorMsg(data?.message || 'Failed to send OTP email. Please ensure backend server is running.');
      } else {
        if (data.otpToken) setOtpToken(data.otpToken);
        setSuccessMsg(`🔐 OTP Code sent to ${email}. Check your email inbox!`);
        setStep('otp');
      }
    } catch {
      setErrorMsg('Error requesting OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpInput || otpInput.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

    try {
      // Secure server-side OTP verification
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput, token: otpToken }),
      }).catch(() => null);

      const data = res ? await res.json() : null;

      if (!data || !data.success) {
        setErrorMsg(data?.message || 'Invalid or expired OTP code. Please try again.');
        setIsLoading(false);
        return;
      }

      // Verify successful! Perform login or register
      if (isRegister) {
        register({ name: name || 'Vibe User', email, phone, role });
      } else {
        login(email);
      }

      setSuccessMsg('✅ OTP Verified Successfully! Logging in...');
      setTimeout(() => {
        onClose();
        setStep('details');
        setOtpInput('');
      }, 800);
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-slate-100 overflow-hidden">
        
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'otp' && (
          <button
            onClick={() => setStep('details')}
            className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer flex items-center space-x-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 mb-3 shadow-lg shadow-indigo-500/20">
            {step === 'otp' ? <KeyRound className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {step === 'otp' ? 'Email OTP Verification' : isRegister ? 'Create Vibe Account' : 'Welcome to Vibe Store'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'otp' ? `Enter 6-digit OTP code sent to ${email}` : 'Login with Email OTP verification'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm mt-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP Code...' : 'Send Email OTP Code'}
              </button>
            </form>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-800 border border-indigo-500/50 rounded-2xl px-4 py-3 text-center text-2xl font-black tracking-widest text-indigo-300 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setStep('details');
                }}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setStep('details');
                }}
                className="text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Register Now
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!form.FirstName.trim()) return 'First Name is required.';
    if (!form.LastName.trim()) return 'Last Name is required.';
    if (!form.Email || !emailRegex.test(form.Email)) return 'Valid email is required.';
    if (!form.PhoneNumber || !phoneRegex.test(form.PhoneNumber)) return 'Valid phone number (10-15 digits) is required.';
    if (!form.Password || form.Password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const payload = {
      FirstName: form.FirstName.trim(),
      LastName: form.LastName.trim(),
      Email: form.Email,
      PhoneNumber: form.PhoneNumber,
      Password: form.Password,
      UserType: 'Trader',
      AccountBalance: 0,
    };
    console.log('Register payload:', payload);

    try {
      const response = await register(payload);
      console.log('Register success:', response.data);
      router.push('/login'); // Redirect to login
    } catch (err) {
      console.error('Register component error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = 'Failed to register';
      if (err.response) {
        errorMessage = err.response.data?.error || `Server error (status ${err.response.status})`;
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Ensure backend is running at http://localhost:5000.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Blurred Gradient Shapes */}
      <div className="absolute top-0 left-0 w-[60vw] h-[20vw] bg-gradient-to-tr from-purple-800/40 to-blue-400/10 rounded-full blur-3xl -rotate-12 -translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute top-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-yellow-700/30 to-purple-900/10 rounded-full blur-2xl rotate-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[12vw] bg-gradient-to-tr from-purple-900/30 to-pink-400/10 rounded-full blur-2xl rotate-6 translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="absolute bottom-10 right-0 w-[40vw] h-[10vw] bg-gradient-to-tr from-pink-700/30 to-purple-900/10 rounded-full blur-2xl -rotate-12 translate-x-1/4 z-0" />

      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl glass-effect shadow-2xl p-8 backdrop-blur-md border border-white/10">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">Create your StockScope account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/30 p-4 border border-red-500/30 text-center">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <input
              name="FirstName"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="First Name"
              value={form.FirstName}
              onChange={handleChange}
            />
            <input
              name="LastName"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Last Name"
              value={form.LastName}
              onChange={handleChange}
            />
            <input
              name="Email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Email address"
              value={form.Email}
              onChange={handleChange}
            />
            <input
              name="PhoneNumber"
              type="tel"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Phone Number (e.g., +1234567890)"
              value={form.PhoneNumber}
              onChange={handleChange}
            />
            <div className="relative">
              <input
                name="Password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition pr-12"
                placeholder="Password (min 6 characters)"
                value={form.Password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.03 0 2.02.155 2.96.445M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.06 2.06A9.978 9.978 0 0021 12c0-3-4-7-9-7-.71 0-1.4.07-2.07.2M4.22 4.22l15.56 15.56" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3-4-7-9-7s-9 4-9 7 4 7 9 7 9-4 9-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400">Already have an account?</span>{' '}
          <a
            href="/login"
            className="font-semibold bg-gradient-to-r from-purple-400 via-blue-300 to-pink-300 bg-clip-text text-transparent hover:underline transition"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
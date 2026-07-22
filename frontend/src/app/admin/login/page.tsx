"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const { user, login, token } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (token && user) {
      router.push('/admin/dashboard');
    }
  }, [token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      
      login(newToken, newUser);
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow min-h-screen bg-brand-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-brand-gold/20 overflow-hidden relative z-10">
        {/* Decorative Top Bar */}
        <div className="bg-brand-emerald p-6 text-center text-white relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern"></div>
          
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold p-0.5 bg-white mx-auto shadow-md">
            <Image
              src="/logo.jpg"
              alt="Sabuj Menar Logo"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h3 className="font-serif-title font-bold text-lg mt-3 uppercase tracking-wider text-white">
            Staff Portal
          </h3>
          <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest leading-none mt-1">
            Sabuj Menar Travel Agency
          </p>
        </div>

        {/* Login Form body */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 text-xs px-4 py-3 rounded-lg flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-emerald" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sabujmenar.com"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-emerald" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold py-3 rounded-lg text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-brand-emerald hover:text-brand-gold font-bold transition-colors uppercase tracking-widest cursor-pointer"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

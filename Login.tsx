import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-serif">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-[#dbc9a4] rounded-2xl shadow-lg border border-brown-200 overflow-hidden">
          {/* Header */}
          <div className="bg-forest-500 px-8 py-7 text-center">
            <h1 className="text-2xl font-bold text-white">Please Log In</h1>
            <p className="text-forest-100 text-sm mt-1">Welcome back, Otter!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 pr-11 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-500 text-white font-bold py-3 rounded-xl hover:bg-forest-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer links */}
          <div className="px-8 pb-8 space-y-3 text-center text-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-brown-200" />
              <span className="text-brown-400 text-xs">or</span>
              <div className="flex-1 h-px bg-brown-200" />
            </div>
            <div className="space-y-2">
              <p className="text-brown-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-forest-500 font-semibold hover:text-forest-600 transition-colors">
                  Sign Up
                </Link>
              </p>
              <p>
                <Link to="/forgot-password" className="text-brown-400 hover:text-brown-600 transition-colors text-xs">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-serif">
      <div className="w-full max-w-md animate-slide-up">
        {sent ? (
          <div className="bg-[#dbc9a4] rounded-2xl shadow-lg border border-brown-200 overflow-hidden">
            <div className="bg-forest-500 px-8 py-7 text-center">
              <h1 className="text-2xl font-bold text-white">We have e-mailed your password reset link!</h1>
            </div>
            <div className="px-8 py-8 text-center space-y-5">
              <CheckCircle size={48} className="text-forest-500 mx-auto" />
              <p className="text-brown-500 leading-relaxed text-sm">
                Please check your email for a link to reset your password. If you don't see it, check your spam folder.
              </p>
              <Link to="/login" className="inline-block bg-forest-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-forest-600 transition-colors text-sm">
                Back to Log In
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#dbc9a4] rounded-2xl shadow-lg border border-brown-200 overflow-hidden">
            <div className="bg-forest-500 px-8 py-7 text-center">
              <h1 className="text-2xl font-bold text-white">Forgot Your Password?</h1>
              <p className="text-forest-100 text-sm mt-2">Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-parchment border border-brown-200 rounded-xl pl-10 pr-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-500 text-white font-bold py-3 rounded-xl hover:bg-forest-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <div className="px-8 pb-8 text-center text-sm">
              <Link to="/login" className="text-brown-400 hover:text-brown-600 transition-colors">← Back to Log In</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

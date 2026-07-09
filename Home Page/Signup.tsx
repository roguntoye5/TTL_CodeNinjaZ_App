import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, Program } from '../lib/supabase';
import { UserPlus, Eye, EyeOff, AlertCircle, CheckSquare, Square } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('programs').select('*').order('name').then(({ data }) => {
      if (data) setPrograms(data);
    });
  }, []);

  function toggleProgram(id: string) {
    setSelectedPrograms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setError('');
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed — please try again.');

      const userId = authData.user.id;

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username: username.trim(),
        bio: bio.trim(),
      });
      if (profileError) throw profileError;

      if (selectedPrograms.length > 0) {
        await supabase.from('user_programs').insert(
          selectedPrograms.map(pid => ({ user_id: userId, program_id: pid, role: 'learner' }))
        );
      }

      const interestList = interests.split(',').map(s => s.trim()).filter(Boolean);
      if (interestList.length > 0) {
        await supabase.from('interests').insert(
          interestList.map(name => ({ user_id: userId, name }))
        );
      }

      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-serif">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="bg-[#dbc9a4] rounded-2xl shadow-lg border border-brown-200 overflow-hidden">
          {/* Header */}
          <div className="bg-forest-500 px-8 py-7">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
              <span className="text-forest-200 text-sm">Step {step} of 2</span>
            </div>
            <div className="flex gap-2 mt-3">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-white' : 'bg-forest-400'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-white' : 'bg-forest-400'}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/\s+/g, ''))}
                    required
                    minLength={3}
                    maxLength={30}
                    placeholder="your_username"
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 pr-11 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Bio <span className="font-normal normal-case text-brown-400">(optional)</span></label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="Tell the community a little about yourself..."
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition resize-none"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-3">
                    Programs I'm a part of <span className="font-normal normal-case text-brown-400">(select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                    {programs.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProgram(p.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                          selectedPrograms.includes(p.id)
                            ? 'bg-forest-500 border-forest-600 text-white'
                            : 'bg-parchment border-brown-200 text-otter-dark hover:border-brown-400'
                        }`}
                      >
                        {selectedPrograms.includes(p.id)
                          ? <CheckSquare size={16} className="flex-shrink-0" />
                          : <Square size={16} className="flex-shrink-0 opacity-50" />
                        }
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">
                    Interests <span className="font-normal normal-case text-brown-400">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={e => setInterests(e.target.value)}
                    placeholder="e.g. hiking, piano, cooking, anime..."
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-brown-300 text-brown-500 font-bold py-3 rounded-xl hover:bg-brown-100 transition-colors text-sm"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-forest-500 text-white font-bold py-3 rounded-xl hover:bg-forest-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : step === 1 ? null : <UserPlus size={16} />}
                {loading ? 'Creating...' : step === 1 ? 'Next →' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="px-8 pb-8 text-center text-sm">
            <p className="text-brown-500">
              Already have an account?{' '}
              <Link to="/login" className="text-forest-500 font-semibold hover:text-forest-600 transition-colors">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

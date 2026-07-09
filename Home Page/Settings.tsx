import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Program } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Lock, CheckSquare, Square, AlertCircle, CheckCircle, X } from 'lucide-react';

type Tab = 'account' | 'privacy' | 'programs' | 'interests';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('account');

  // Account fields
  const [bio, setBio] = useState(profile?.bio || '');
  const [instagram, setInstagram] = useState(profile?.instagram || '');
  const [emailPublic, setEmailPublic] = useState(profile?.email_public || '');
  const [gofundmeUrl, setGofundmeUrl] = useState(profile?.gofundme_url || '');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Programs
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [myProgramIds, setMyProgramIds] = useState<string[]>([]);
  const [savingProgs, setSavingProgs] = useState(false);

  // Interests
  const [myInterests, setMyInterests] = useState<{ id: string; name: string }[]>([]);
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (profile) {
      setBio(profile.bio);
      setInstagram(profile.instagram);
      setEmailPublic(profile.email_public);
      setGofundmeUrl(profile.gofundme_url);
    }
    // Load programs
    supabase.from('programs').select('*').order('name').then(({ data }) => {
      if (data) setAllPrograms(data);
    });
    supabase.from('user_programs').select('program_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setMyProgramIds(data.map(d => d.program_id));
    });
    supabase.from('interests').select('*').eq('user_id', user.id).then(({ data }) => {
      if (data) setMyInterests(data);
    });
  }, [user, profile, navigate]);

  async function saveAccount(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingAccount(true);
    setAccountMsg(null);
    const { error } = await supabase.from('profiles').update({
      bio: bio.trim(),
      instagram: instagram.trim(),
      email_public: emailPublic.trim(),
      gofundme_url: gofundmeUrl.trim(),
    }).eq('id', user.id);
    if (error) {
      setAccountMsg({ type: 'error', text: error.message });
    } else {
      await refreshProfile();
      setAccountMsg({ type: 'success', text: 'Profile updated successfully!' });
    }
    setSavingAccount(false);
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setSavingPass(true);
    setPassMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPassMsg({ type: 'error', text: error.message });
    } else {
      setPassMsg({ type: 'success', text: 'Password updated!' });
      setNewPassword('');
    }
    setSavingPass(false);
  }

  async function toggleProgram(programId: string) {
    if (!user) return;
    setSavingProgs(true);
    if (myProgramIds.includes(programId)) {
      await supabase.from('user_programs').delete().eq('user_id', user.id).eq('program_id', programId);
      setMyProgramIds(prev => prev.filter(id => id !== programId));
    } else {
      await supabase.from('user_programs').insert({ user_id: user.id, program_id: programId, role: 'learner' });
      setMyProgramIds(prev => [...prev, programId]);
    }
    setSavingProgs(false);
  }

  async function addInterest() {
    if (!user || !newInterest.trim()) return;
    const name = newInterest.trim();
    const { data, error } = await supabase.from('interests').insert({ user_id: user.id, name }).select().maybeSingle();
    if (!error && data) {
      setMyInterests(prev => [...prev, data]);
      setNewInterest('');
    }
  }

  async function removeInterest(id: string) {
    await supabase.from('interests').delete().eq('id', id);
    setMyInterests(prev => prev.filter(i => i.id !== id));
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={16} /> },
    { id: 'programs', label: 'Programs', icon: <CheckSquare size={16} /> },
    { id: 'interests', label: 'Interests', icon: <span className="w-4 h-4 rounded-full bg-sage-400 block flex-shrink-0" /> },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream font-serif">
      <div className="bg-[#dbc9a4] border-b border-brown-200 px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <SettingsIcon size={24} className="text-forest-500" />
          <h1 className="text-3xl font-bold text-otter-dark">Settings</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#dbc9a4] p-1.5 rounded-xl border border-brown-200 mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-forest-500 text-white shadow-sm'
                  : 'text-brown-500 hover:bg-brown-100'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {tab === 'account' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-[#dbc9a4] rounded-2xl border border-brown-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-brown-200 bg-parchment/60">
                <h2 className="font-bold text-otter-dark">Account Editor</h2>
                <p className="text-xs text-brown-400 mt-0.5">Update your public profile information</p>
              </div>
              <form onSubmit={saveAccount} className="px-6 py-6 space-y-4">
                {accountMsg && (
                  <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm border ${accountMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {accountMsg.type === 'success' ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                    {accountMsg.text}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Username</label>
                  <input
                    type="text"
                    value={profile?.username || ''}
                    disabled
                    className="w-full bg-parchment/60 border border-brown-200 rounded-xl px-4 py-3 text-sm text-brown-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-brown-400 mt-1">Username cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="Tell the community about yourself..."
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Instagram Handle</label>
                    <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@yourhandle" className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Public Email</label>
                    <input type="email" value={emailPublic} onChange={e => setEmailPublic(e.target.value)} placeholder="contact@example.com" className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">GoFundMe URL</label>
                  <input type="url" value={gofundmeUrl} onChange={e => setGofundmeUrl(e.target.value)} placeholder="https://gofund.me/..." className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition" />
                </div>
                <button type="submit" disabled={savingAccount} className="bg-forest-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-forest-600 disabled:opacity-60 transition-colors text-sm flex items-center gap-2">
                  {savingAccount && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {tab === 'privacy' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-[#dbc9a4] rounded-2xl border border-brown-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-brown-200 bg-parchment/60">
                <h2 className="font-bold text-otter-dark">Privacy</h2>
                <p className="text-xs text-brown-400 mt-0.5">Manage your account security</p>
              </div>
              <form onSubmit={savePassword} className="px-6 py-6 space-y-4">
                {passMsg && (
                  <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm border ${passMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {passMsg.type === 'success' ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                    {passMsg.text}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">Login Email</label>
                  <input type="email" value={user.email || ''} disabled className="w-full bg-parchment/60 border border-brown-200 rounded-xl px-4 py-3 text-sm text-brown-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brown-500 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength={6}
                    placeholder="Enter new password"
                    className="w-full bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                </div>
                <button type="submit" disabled={savingPass || !newPassword} className="bg-forest-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-forest-600 disabled:opacity-60 transition-colors text-sm flex items-center gap-2">
                  {savingPass && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Programs Tab */}
        {tab === 'programs' && (
          <div className="animate-fade-in">
            <div className="bg-[#dbc9a4] rounded-2xl border border-brown-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-brown-200 bg-parchment/60">
                <h2 className="font-bold text-otter-dark">My Programs</h2>
                <p className="text-xs text-brown-400 mt-0.5">Select the programs you're part of</p>
              </div>
              <div className="px-6 py-6">
                <div className={`space-y-2 ${savingProgs ? 'opacity-60 pointer-events-none' : ''}`}>
                  {allPrograms.map(p => (
                    <button
                      key={p.id}
                      onClick={() => toggleProgram(p.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${
                        myProgramIds.includes(p.id)
                          ? 'bg-forest-500 border-forest-600 text-white'
                          : 'bg-parchment border-brown-200 text-otter-dark hover:border-brown-400'
                      }`}
                    >
                      {myProgramIds.includes(p.id)
                        ? <CheckSquare size={16} className="flex-shrink-0" />
                        : <Square size={16} className="flex-shrink-0 opacity-50" />
                      }
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.description && <p className={`text-xs mt-0.5 ${myProgramIds.includes(p.id) ? 'text-forest-100' : 'text-brown-400'}`}>{p.description}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interests Tab */}
        {tab === 'interests' && (
          <div className="animate-fade-in">
            <div className="bg-[#dbc9a4] rounded-2xl border border-brown-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-brown-200 bg-parchment/60">
                <h2 className="font-bold text-otter-dark">My Interests</h2>
                <p className="text-xs text-brown-400 mt-0.5">Add things you love to help others find you</p>
              </div>
              <div className="px-6 py-6 space-y-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                    placeholder="Type an interest and press Enter"
                    className="flex-1 bg-parchment border border-brown-200 rounded-xl px-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-forest-400 transition"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    disabled={!newInterest.trim()}
                    className="bg-forest-500 text-white font-bold px-5 py-3 rounded-xl hover:bg-forest-600 disabled:opacity-40 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {myInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {myInterests.map(i => (
                      <div key={i.id} className="flex items-center gap-2 bg-parchment border border-tan text-brown-600 text-sm font-medium pl-4 pr-2 py-2 rounded-full">
                        {i.name}
                        <button onClick={() => removeInterest(i.id)} className="text-brown-400 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brown-400 text-sm text-center py-4">No interests yet — add some!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

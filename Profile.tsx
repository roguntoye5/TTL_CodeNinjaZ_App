import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, Profile as ProfileType, Interest } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Instagram, Mail, ExternalLink, Settings, ArrowLeft, BookOpen } from 'lucide-react';

const AVATAR_COLORS = ['bg-forest-500', 'bg-brown-300', 'bg-sage-400', 'bg-otter-mid'];

type UserProgram = {
  id: string;
  role: 'learner' | 'teacher';
  programs: { id: string; name: string } | null;
};

type FullProfile = ProfileType & {
  interests: Interest[];
  user_programs: UserProgram[];
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { profile: myProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!username) return;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (!profileData) { setNotFound(true); setLoading(false); return; }

      const [{ data: interestsData }, { data: upData }] = await Promise.all([
        supabase.from('interests').select('*').eq('user_id', profileData.id),
        supabase.from('user_programs').select('id, role, programs(id, name)').eq('user_id', profileData.id),
      ]);

      setProfile({
        ...profileData,
        interests: interestsData || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user_programs: (upData || []) as any,
      });
      setLoading(false);
    }
    load();
  }, [username]);

  const isOwn = myProfile?.username === username;
  const colorIdx = username ? username.charCodeAt(0) % AVATAR_COLORS.length : 0;

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brown-300 border-t-forest-500 rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-5 font-serif">
      <p className="text-2xl font-bold text-otter-dark">Otter not found!</p>
      <p className="text-brown-400">@{username} hasn't joined the raft yet.</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-forest-500 hover:text-forest-600 font-medium">
        <ArrowLeft size={16} /> Go back
      </button>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-cream font-serif">
      {/* Profile Header */}
      <div className="bg-[#dbc9a4] border-b border-brown-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-brown-400 hover:text-brown-600 text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className={`w-24 h-24 rounded-full ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white font-bold text-4xl shadow-md flex-shrink-0`}>
              {profile.username[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-otter-dark">@{profile.username}</h1>
                {isOwn && (
                  <Link to="/settings" className="flex items-center gap-1.5 text-xs bg-parchment border border-brown-200 text-brown-500 px-3 py-1.5 rounded-full hover:border-brown-400 transition-all">
                    <Settings size={12} /> Edit Profile
                  </Link>
                )}
              </div>
              {profile.bio && (
                <p className="text-brown-500 mt-2 leading-relaxed max-w-xl">{profile.bio}</p>
              )}
              <div className="flex gap-4 mt-3 flex-wrap">
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-brown-400 hover:text-forest-500 transition-colors">
                    <Instagram size={14} /> @{profile.instagram}
                  </a>
                )}
                {profile.email_public && (
                  <a href={`mailto:${profile.email_public}`} className="flex items-center gap-1.5 text-sm text-brown-400 hover:text-forest-500 transition-colors">
                    <Mail size={14} /> {profile.email_public}
                  </a>
                )}
                {profile.gofundme_url && (
                  <a href={profile.gofundme_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-brown-400 hover:text-forest-500 transition-colors">
                    <ExternalLink size={14} /> GoFundMe
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Programs */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={20} className="text-forest-500" />
            <h2 className="text-xl font-bold text-otter-dark">Programs</h2>
          </div>
          {profile.user_programs.length === 0 ? (
            <div className="bg-[#dbc9a4] rounded-xl p-6 border border-brown-200 text-center">
              <p className="text-brown-400 text-sm">No programs joined yet.</p>
              {isOwn && <Link to="/programs" className="mt-2 inline-block text-forest-500 text-sm font-semibold hover:text-forest-600">Browse Programs →</Link>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.user_programs.map(up => (
                <div key={up.id} className="bg-[#dbc9a4] rounded-xl px-5 py-4 border border-brown-200 flex items-center justify-between">
                  <span className="font-medium text-otter-dark text-sm">{up.programs?.name}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${up.role === 'teacher' ? 'bg-forest-500 text-white' : 'bg-parchment text-brown-500'}`}>
                    {up.role === 'teacher' ? 'Teaching' : 'Learning'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Interests */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full bg-sage-400 flex-shrink-0" />
            <h2 className="text-xl font-bold text-otter-dark">Interests</h2>
          </div>
          {profile.interests.length === 0 ? (
            <div className="bg-[#dbc9a4] rounded-xl p-6 border border-brown-200 text-center">
              <p className="text-brown-400 text-sm">No interests added yet.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(i => (
                <span key={i.id} className="bg-parchment border border-tan text-brown-500 text-sm font-medium px-4 py-2 rounded-full hover:border-brown-400 transition-colors">
                  {i.name}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Member since */}
        <p className="text-xs text-brown-300 text-center pt-4">
          Member since {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  );
}

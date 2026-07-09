import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Profile, Interest } from '../lib/supabase';
import { Users, Search } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-forest-500', 'bg-brown-300', 'bg-sage-400', 'bg-otter-mid',
  'bg-forest-400', 'bg-brown-400',
];

type MemberWithExtras = Profile & {
  interests: Interest[];
  program_names: string[];
};

export default function Community() {
  const [members, setMembers] = useState<MemberWithExtras[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!profiles) { setLoading(false); return; }

      const profileIds = profiles.map(p => p.id);

      const [{ data: interestsData }, { data: upData }] = await Promise.all([
        supabase.from('interests').select('*').in('user_id', profileIds),
        supabase.from('user_programs').select('*, programs(name)').in('user_id', profileIds),
      ]);

      const result: MemberWithExtras[] = profiles.map(profile => ({
        ...profile,
        interests: (interestsData || []).filter(i => i.user_id === profile.id),
        program_names: (upData || [])
          .filter(up => up.user_id === profile.id)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((up: any) => up.programs?.name)
          .filter(Boolean),
      }));

      setMembers(result);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter(m =>
    search === '' ||
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    m.bio.toLowerCase().includes(search.toLowerCase()) ||
    m.interests.some(i => i.name.toLowerCase().includes(search.toLowerCase())) ||
    m.program_names.some(p => p.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-cream font-serif">
      {/* Hero */}
      <div className="bg-forest-500 px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Users size={28} className="text-forest-200" />
          <h1 className="text-4xl font-bold text-white">Community</h1>
        </div>
        <p className="text-forest-100 text-base max-w-xl mx-auto">
          Meet the Otters — your neighbors, collaborators, and future friends.
        </p>
        <div className="mt-6 max-w-md mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, skill, or interest..."
            className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-otter-dark placeholder-brown-300 focus:outline-none focus:ring-2 focus:ring-white/60 border border-white/20"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-brown-300 border-t-forest-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-brown-300 mx-auto mb-4" />
            <p className="text-brown-400 text-lg font-medium">
              {search ? 'No members match your search.' : 'No members yet — be the first to join!'}
            </p>
            {!search && (
              <Link to="/signup" className="mt-4 inline-block bg-forest-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-forest-600 transition-colors text-sm">
                Join the Raft
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-brown-400 text-sm mb-6">{filtered.length} member{filtered.length !== 1 ? 's' : ''} in the community</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((member, idx) => (
                <Link
                  key={member.id}
                  to={`/profile/${member.username}`}
                  className="bg-[#dbc9a4] rounded-2xl p-6 border border-brown-200 shadow-sm hover:shadow-md hover:border-brown-400 transition-all group animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow group-hover:scale-105 transition-transform`}>
                      {member.username[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-otter-dark text-base group-hover:text-forest-600 transition-colors">@{member.username}</h3>
                      {member.bio && (
                        <p className="text-brown-500 text-sm mt-1 line-clamp-2 leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </div>

                  {member.program_names.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.program_names.slice(0, 3).map(name => (
                        <span key={name} className="text-xs bg-forest-100 text-forest-600 font-semibold px-2.5 py-1 rounded-full">
                          {name}
                        </span>
                      ))}
                      {member.program_names.length > 3 && (
                        <span className="text-xs bg-parchment text-brown-500 px-2.5 py-1 rounded-full">
                          +{member.program_names.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {member.interests.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.interests.slice(0, 4).map(i => (
                        <span key={i.id} className="text-xs bg-parchment text-brown-500 px-2.5 py-1 rounded-full border border-tan">
                          {i.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

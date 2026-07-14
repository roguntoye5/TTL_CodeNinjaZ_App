import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Program } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Users } from 'lucide-react';

type ProgramWithCount = Program & { member_count: number; joined: boolean };

export default function Programs() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<ProgramWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [{ data: progs }, { data: upData }] = await Promise.all([
        supabase.from('programs').select('*').order('name'),
        user ? supabase.from('user_programs').select('program_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
      ]);
      const { data: counts } = await supabase.from('user_programs').select('program_id');
      const myProgIds = (upData || []).map((u: { program_id: string }) => u.program_id);
      const countMap: Record<string, number> = {};
      (counts || []).forEach((c: { program_id: string }) => {
        countMap[c.program_id] = (countMap[c.program_id] || 0) + 1;
      });
      setPrograms((progs || []).map(p => ({
        ...p,
        member_count: countMap[p.id] || 0,
        joined: myProgIds.includes(p.id),
      })));
      setLoading(false);
    }
    load();
  }, [user]);

  async function toggleJoin(program: ProgramWithCount) {
    if (!user) return;
    setJoiningId(program.id);
    if (program.joined) {
      await supabase.from('user_programs').delete().eq('user_id', user.id).eq('program_id', program.id);
    } else {
      await supabase.from('user_programs').insert({ user_id: user.id, program_id: program.id, role: 'learner' });
    }
    setPrograms(prev => prev.map(p => p.id === program.id ? {
      ...p,
      joined: !p.joined,
      member_count: p.joined ? p.member_count - 1 : p.member_count + 1,
    } : p));
    setJoiningId(null);
  }

  return (
    <div className="min-h-screen bg-cream font-serif">
      <div className="bg-forest-500 px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <BookOpen size={28} className="text-forest-200" />
          <h1 className="text-4xl font-bold text-white">Programs (Rafts)</h1>
        </div>
        <p className="text-forest-100 text-base max-w-xl mx-auto">
          Find your raft — join programs to connect with people who share your skills and passions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brown-300 border-t-forest-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {programs.map((p, idx) => (
              <div
                key={p.id}
                className="bg-[#dbc9a4] rounded-2xl border border-brown-200 shadow-sm hover:shadow-md transition-all animate-slide-up overflow-hidden"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className={`px-6 py-5 ${p.joined ? 'bg-forest-500' : 'bg-parchment/60'} transition-colors`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`font-bold text-lg ${p.joined ? 'text-white' : 'text-otter-dark'}`}>{p.name}</h3>
                    {p.joined && <CheckCircle size={20} className="text-white flex-shrink-0" />}
                  </div>
                  {p.description && (
                    <p className={`text-sm mt-1 leading-relaxed ${p.joined ? 'text-forest-100' : 'text-brown-500'}`}>{p.description}</p>
                  )}
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-brown-400 text-xs">
                    <Users size={13} />
                    {p.member_count} member{p.member_count !== 1 ? 's' : ''}
                  </div>
                  {user ? (
                    <button
                      onClick={() => toggleJoin(p)}
                      disabled={joiningId === p.id}
                      className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60 ${
                        p.joined
                          ? 'bg-parchment text-brown-500 hover:bg-brown-100 border border-brown-200'
                          : 'bg-forest-500 text-white hover:bg-forest-600'
                      }`}
                    >
                      {joiningId === p.id ? '...' : p.joined ? 'Leave Raft' : 'Join Raft'}
                    </button>
                  ) : (
                    <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-xl bg-forest-500 text-white hover:bg-forest-600 transition-colors">
                      Log in to join
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

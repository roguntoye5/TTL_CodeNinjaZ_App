import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Users, BookOpen, Settings, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const OtterLogo = () => (
  <div className="w-16 h-16 rounded-full bg-forest-500 flex items-center justify-center overflow-hidden border-2 border-otter-mid shadow-md">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
      {/* otter silhouette */}
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="#5c3d1e" />
      <ellipse cx="32" cy="26" rx="13" ry="11" fill="#8b6347" />
      <ellipse cx="26" cy="22" rx="5" ry="6" fill="#8b6347" />
      <ellipse cx="38" cy="22" rx="5" ry="6" fill="#8b6347" />
      <ellipse cx="26" cy="20" rx="3.5" ry="4.5" fill="#6b4a32" />
      <ellipse cx="38" cy="20" rx="3.5" ry="4.5" fill="#6b4a32" />
      <ellipse cx="32" cy="29" rx="8" ry="7" fill="#c9a87a" />
      <circle cx="28" cy="25" r="2" fill="#2d1a0a" />
      <circle cx="36" cy="25" r="2" fill="#2d1a0a" />
      <circle cx="28.5" cy="24.5" r="0.7" fill="white" />
      <circle cx="36.5" cy="24.5" r="0.7" fill="white" />
      <ellipse cx="32" cy="30" rx="3" ry="2" fill="#8b6347" />
      <circle cx="32" cy="30" r="1.5" fill="#5c3d1e" />
    </svg>
  </div>
);

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/community', label: 'Community', icon: <Users size={18} /> },
    { to: '/programs', label: 'Programs', icon: <BookOpen size={18} /> },
    { to: '/members', label: 'Members', icon: <Users size={18} /> },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-cream flex font-serif">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col bg-[#dbc9a4] border-r border-brown-200
        w-64 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center gap-2 pt-8 pb-6 px-4 border-b border-brown-200 hover:opacity-90 transition-opacity">
          <OtterLogo />
          <div className="text-center">
            <div className="text-forest-500 font-bold text-lg leading-tight tracking-wide">Skill Otter</div>
            <div className="text-otter-dark text-xs tracking-wider uppercase opacity-70">Code NinjaZ</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-brown-400 px-3 mb-3">Navigate</p>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive(item.to)
                  ? 'bg-forest-500 text-white shadow-sm'
                  : 'text-otter-dark hover:bg-brown-100 hover:text-brown-600'}
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {user && (
            <>
              <div className="pt-4 pb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-brown-400 px-3 mb-3">Account</p>
              </div>
              <Link
                to={profile ? `/profile/${profile.username}` : '/settings'}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${location.pathname.startsWith('/profile')
                    ? 'bg-forest-500 text-white shadow-sm'
                    : 'text-otter-dark hover:bg-brown-100 hover:text-brown-600'}
                `}
              >
                <User size={18} />
                My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${location.pathname.startsWith('/settings')
                    ? 'bg-forest-500 text-white shadow-sm'
                    : 'text-otter-dark hover:bg-brown-100 hover:text-brown-600'}
                `}
              >
                <Settings size={18} />
                Settings
              </Link>
            </>
          )}
        </nav>

        {/* Auth section */}
        <div className="p-4 border-t border-brown-200">
          {loading ? null : user ? (
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-lg bg-parchment">
                <p className="text-xs text-brown-400">Signed in as</p>
                <p className="text-sm font-semibold text-otter-dark truncate">{profile?.username || user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brown-500 hover:bg-brown-100 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-forest-500 text-white hover:bg-forest-600 transition-colors"
              >
                <LogIn size={16} />
                Log In
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium border border-forest-500 text-forest-500 hover:bg-forest-100 transition-colors"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#dbc9a4] border-b border-brown-200 flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md hover:bg-brown-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-otter-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-forest-500 font-bold text-base">Skill Otter</span>
          </Link>
          {!user && (
            <div className="ml-auto flex gap-2">
              <Link to="/login" className="text-sm text-forest-500 font-medium hover:text-forest-600">Log In</Link>
              <span className="text-brown-300">|</span>
              <Link to="/signup" className="text-sm text-forest-500 font-medium hover:text-forest-600">Sign Up</Link>
            </div>
          )}
        </header>

        <main className="flex-1 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

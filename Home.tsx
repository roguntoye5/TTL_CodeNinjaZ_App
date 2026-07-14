import { Link } from 'react-router-dom';
import { Instagram, Mail, ExternalLink, ChevronRight, Heart, Users, Lightbulb } from 'lucide-react';

const OTTER_HERO = 'https://images.pexels.com/photos/38058083/pexels-photo-38058083.jpeg?auto=compress&cs=tinysrgb&w=800';
const COMMUNITY_IMGS = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function Home() {
  return (
    <div className="font-serif">
      {/* Hero Section */}
      <section className="relative h-[480px] overflow-hidden">
        <img
          src={OTTER_HERO}
          alt="Otter swimming — symbol of community and play"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#dbc9a4]/90" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-forest-500/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-4">
              Code NinjaZ presents
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight mb-3">
              Skill Otter
            </h1>
            <p className="text-xl text-cream/90 drop-shadow max-w-2xl leading-relaxed">
              Building community rafts — one shared skill at a time.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-16">

        {/* About Us */}
        <section className="animate-slide-up" id="about">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-forest-500 rounded-full" />
            <h2 className="text-3xl font-bold text-otter-dark">About Us</h2>
          </div>
          <div className="bg-[#dbc9a4] rounded-2xl p-8 shadow-sm border border-brown-200">
            <p className="text-brown-600 leading-relaxed text-base mb-5">
              Skill Otters is a student-led skill share organization dedicated to enriching our local community by
              connecting people through the sharing of skills. We noticed that many people in our area have hobbies
              and talents in common, but rarely speak to each other or collaborate.
            </p>
            <p className="text-brown-600 leading-relaxed text-base mb-5">
              Inspired by otters — community creatures who share and play together throughout their lives — we want
              to create <strong className="text-otter-dark">"Rafts"</strong> that strengthen our community and, one day, communities around the world.
            </p>
            <p className="text-brown-600 leading-relaxed text-base mb-5">
              Our mission is to provide a platform where members can share what they know, learn from others, and
              build lasting friendships. We believe that everyone has something valuable to offer, and by coming
              together, we can make our community stronger, more vibrant, and more connected.
            </p>
            <p className="text-brown-600 leading-relaxed text-base">
              The funds raised will go directly toward materials, event space, and promotions, helping us reach not
              just our local neighborhood but people across the metro Atlanta area who are looking for a Raft to join.
            </p>
          </div>

          {/* Social + Links */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://instagram.com/Skill_Otter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#dbc9a4] rounded-xl px-5 py-4 border border-brown-200 hover:border-brown-400 hover:shadow-md transition-all group"
            >
              <Instagram size={22} className="text-forest-500 group-hover:text-forest-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-brown-400 uppercase tracking-wide">Instagram</p>
                <p className="text-sm font-semibold text-otter-dark">@Skill_Otter</p>
              </div>
            </a>
            <a
              href="mailto:SkillOtter@gmail.com"
              className="flex items-center gap-3 bg-[#dbc9a4] rounded-xl px-5 py-4 border border-brown-200 hover:border-brown-400 hover:shadow-md transition-all group"
            >
              <Mail size={22} className="text-forest-500 group-hover:text-forest-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-brown-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-otter-dark">SkillOtter@gmail.com</p>
              </div>
            </a>
            <a
              href="https://gofund.me/c4f4d160a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-forest-500 rounded-xl px-5 py-4 border border-forest-600 hover:bg-forest-600 hover:shadow-md transition-all group"
            >
              <ExternalLink size={22} className="text-white flex-shrink-0" />
              <div>
                <p className="text-xs text-forest-100 uppercase tracking-wide">Support Us</p>
                <p className="text-sm font-semibold text-white">GoFundMe</p>
              </div>
            </a>
          </div>
        </section>

        {/* What is Skill Otter? */}
        <section className="animate-slide-up" id="what">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-sage-400 rounded-full" />
            <h2 className="text-3xl font-bold text-otter-dark">What is Skill Otter?</h2>
          </div>
          <div className="bg-parchment rounded-2xl p-8 border border-tan shadow-sm">
            <p className="text-brown-600 leading-relaxed mb-6">
              Skill Otter is a website where people share the skills/talents they have. Examples include physics,
              math, learning languages, art and more.
            </p>
            <p className="text-brown-500 font-semibold mb-4">Skill Otter aims to do three things:</p>
            <div className="space-y-4">
              {[
                { icon: <Lightbulb size={20} />, text: 'Help people learn new skills' },
                { icon: <Heart size={20} />, text: 'Allow people to share their skills' },
                { icon: <Users size={20} />, text: 'Build connections' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/60 rounded-xl px-5 py-3.5 border border-tan">
                  <div className="text-forest-500 flex-shrink-0">{item.icon}</div>
                  <span className="text-brown-600 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use Skill Otter */}
        <section className="animate-slide-up" id="how">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-brown-300 rounded-full" />
            <h2 className="text-3xl font-bold text-otter-dark">How to Use Skill Otter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                title: 'Create An Account',
                bullets: [
                  'Customize your account to tailor to your interests and passions.',
                ],
              },
              {
                num: '2',
                title: 'Join a Program (Raft)',
                bullets: [
                  'Visit the programs tab and search for a program that interests you.',
                ],
              },
              {
                num: '3',
                title: 'Connect with Community',
                bullets: [
                  'Go to the Community page and interact with people who have similar interests.',
                ],
              },
            ].map(step => (
              <div key={step.num} className="bg-[#dbc9a4] rounded-2xl p-6 border border-brown-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-forest-500 text-white flex items-center justify-center font-bold text-lg shadow flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-otter-dark text-lg mb-2">{step.title}</h3>
                  {step.bullets.map((b, i) => (
                    <p key={i} className="text-brown-500 text-sm leading-relaxed flex gap-2">
                      <ChevronRight size={14} className="mt-0.5 text-forest-400 flex-shrink-0" />
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Snapshot */}
        <section className="animate-slide-up" id="community-snap">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-forest-500 rounded-full" />
              <h2 className="text-3xl font-bold text-otter-dark">Community</h2>
            </div>
            <Link to="/community" className="flex items-center gap-1.5 text-forest-500 hover:text-forest-600 text-sm font-semibold transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {COMMUNITY_IMGS.map((src, i) => (
              <div key={i} className="bg-[#dbc9a4] rounded-2xl overflow-hidden border border-brown-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-40 overflow-hidden">
                  <img
                    src={src}
                    alt="Community members collaborating"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    {['Art', 'Music', 'Coding'][i] && (
                      <span className="text-xs bg-forest-100 text-forest-600 font-semibold px-2 py-0.5 rounded-full">
                        {['Art', 'Music', 'Coding'][i]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brown-400 mt-1">Community member</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action: Join the Raft */}
        <section className="animate-slide-up">
          <div className="bg-forest-500 rounded-3xl p-10 text-center shadow-lg">
            <h2 className="text-4xl font-bold text-white mb-4">Join the Raft Today!</h2>
            <p className="text-forest-100 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              As many teenagers and adults are realizing this summer — it's hot, there's nothing to do but be on
              your phone all day, and everything fun costs money. We want to change that. Join us and bring
              community and fun, safe spaces back for everyone to enjoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-forest-600 font-bold px-8 py-3.5 rounded-xl hover:bg-cream transition-colors shadow text-base"
              >
                Create Your Account
              </Link>
              <a
                href="https://gofund.me/c4f4d160a"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                Support on GoFundMe
              </a>
            </div>
          </div>
        </section>

        {/* Skill Otter title at bottom like Figma */}
        <section className="text-center py-4">
          <p className="text-brown-300 text-sm">Skill Otter &copy; {new Date().getFullYear()} · Code NinjaZ · Metro Atlanta</p>
        </section>
      </div>
    </div>
  );
}

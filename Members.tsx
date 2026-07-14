import { Link } from 'react-router-dom';
import { Users, Heart, Sparkles, ArrowLeft, Github, Instagram } from 'lucide-react';

type Section = {
  icon: string;
  title: string;
  items: string[];
};

type Member = {
  name: string;
  emoji: string;
  role: string;
  headerGradient: string;
  accent: string;
  sections: Section[];
  quote: string;
  extras?: React.ReactNode;
};

const members: Member[] = [
  {
    name: 'Hollis',
    emoji: '🐻',
    role: 'Code NinjaZ Raft Member',
    headerGradient: 'from-sky-400 to-sky-200',
    accent: 'text-sky-600',
    sections: [
      {
        icon: '⌘',
        title: 'Interests',
        items: ['Videogames', 'Gardening', 'Aviation', 'Animals'],
      },
      {
        icon: '♥',
        title: 'Favorite Pieces of Media',
        items: ['Fruits Basket', 'Bolt', 'Toy Story', 'Yona of the Dawn', 'Strange Magic', 'Brave', 'Lego Ninjago'],
      },
      {
        icon: '⚡',
        title: 'Fun Facts About Me',
        items: [
          'I enjoy working out and pushing myself to become better.',
          '2x Womens Wrestling Sectional Qualifier',
          'Womens Wrestling State Qualifier',
          'My favorite song is "Come and Get Your Love" by Redbone',
        ],
      },
    ],
    quote: 'Because it is the power of God that brings salvation to everyone who believes in Jesus Romans 1:16.',
  },
  {
    name: 'Likhita Sri Bollam',
    emoji: '🌸',
    role: 'Student & Creative Enthusiast',
    headerGradient: 'from-emerald-500 to-teal-400',
    accent: 'text-teal-600',
    sections: [
      {
        icon: '📷',
        title: 'Interests',
        items: ['Photography', 'Reading', 'Singing'],
      },
      {
        icon: '⭐',
        title: 'Favorites',
        items: [
          'TV Show: Alexa and Katie',
          'Movie Series: Harry Potter',
          'Book Series: Good Girl\'s Guide to Murder',
          'Book Series: The Inheritance Games',
        ],
      },
      {
        icon: '✨',
        title: 'Fun Fact',
        items: ["I'm left-handed"],
      },
    ],
    quote: 'Everything happens for a reason.',
  },
  {
    name: 'Rachel Oguntoye',
    emoji: '₍ᐢ. _ .ᐢ₎',
    role: 'Artist · Cybersecurity · Future Innovator',
    headerGradient: 'from-amber-400 to-yellow-300',
    accent: 'text-amber-600',
    sections: [
      {
        icon: '🌟',
        title: 'Aspirations',
        items: [
          'I would like to find passion through art and in general, computers!',
          'I would like to combine my interests in art, medicine, and computers to make a change in the world.',
        ],
      },
      {
        icon: '🎨',
        title: 'Interests',
        items: [
          'Arts and Crafts (Digital and Traditional)',
          'Video Games',
          'Reading',
          'Collecting',
          'Writing',
          'Cybersecurity',
        ],
      },
      {
        icon: '★',
        title: 'Favorites',
        items: [
          '(Videogames) Limbus Company, Stardew Valley, Jackpot Crash Course',
          '(Movie) A Silent Voice',
          '(Game Studio) Studio Investigrave',
          '(Food) Anything with potatoes',
          '(Code) CSS',
          '(Color) Yellow',
          '(Animal) Rabbits',
        ],
      },
    ],
    quote: 'Find passion through art and computers.',
    extras: (
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs bg-parchment text-brown-500 px-2.5 py-1 rounded-full border border-tan">
          You can also call me "Rae" or "Ray"!
        </span>
        <span className="inline-flex items-center gap-1 text-xs bg-forest-100 text-forest-600 px-2.5 py-1 rounded-full">
          <Github size={12} /> roguntoye5
        </span>
        <span className="inline-flex items-center gap-1 text-xs bg-forest-100 text-forest-600 px-2.5 py-1 rounded-full">
          <Instagram size={12} /> @lemonlimesodaa_
        </span>
      </div>
    ),
  },
  {
    name: 'Zoe',
    emoji: '🧠',
    role: 'Code NinjaZ Raft Member',
    headerGradient: 'from-sky-400 to-sky-200',
    accent: 'text-sky-600',
    sections: [
      {
        icon: '⌘',
        title: 'Interests',
        items: ['Vinyls', 'Music', 'Medicine', 'Anatomy'],
      },
      {
        icon: '♥',
        title: 'Favorite Pieces of Media',
        items: ['One Piece', 'Son of Batman', 'Moon Knight', 'Lego Ninjago', 'Stray Kids', 'BTS'],
      },
      {
        icon: '⚡',
        title: 'Fun Facts About Me',
        items: [
          'I play cello and am CPR certified.',
          'I am the social media manager of the North Atlanta Chapter of the American Heart Association.',
          'Administrative Assistance Manager for the North Atlanta Orchestra.',
        ],
      },
    ],
    quote: 'As iron sharpens iron, brother sharpens brother.',
  },
];

const SECTION_ICONS: Record<string, React.ReactNode> = {
  '⌘': <Sparkles size={18} />,
  '♥': <Heart size={18} />,
  '⚡': <Sparkles size={18} />,
  '📷': <Sparkles size={18} />,
  '⭐': <Sparkles size={18} />,
  '✨': <Sparkles size={18} />,
  '🌟': <Sparkles size={18} />,
  '🎨': <Sparkles size={18} />,
  '★': <Sparkles size={18} />,
};

export default function Members() {
  return (
    <div className="min-h-screen bg-cream font-serif">
      {/* Hero */}
      <div className="bg-forest-500 px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Users size={28} className="text-forest-200" />
          <h1 className="text-4xl font-bold text-white">Meet the Raft</h1>
        </div>
        <p className="text-forest-100 text-base max-w-xl mx-auto">
          The Code NinjaZ members behind Skill Otter — each bringing their own unique spark.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-brown-500 hover:text-forest-600 font-semibold text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="space-y-8">
          {members.map((member, idx) => (
            <article
              key={member.name}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-brown-200 animate-slide-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Header banner */}
              <div className={`h-20 bg-gradient-to-r ${member.headerGradient}`} />

              <div className="p-8">
                {/* Name + role */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-otter-dark leading-tight">
                    {member.name} <span className="text-2xl">{member.emoji}</span>
                  </h2>
                  <p className="text-brown-500 text-base mt-1">{member.role}</p>
                  {member.extras}
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {member.sections.map((section, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0 ${member.accent}`}>
                        {SECTION_ICONS[section.icon] || <Sparkles size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-otter-dark text-sm uppercase tracking-wide mb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-1">
                          {section.items.map((item, j) => (
                            <li key={j} className="text-brown-600 text-sm leading-relaxed flex gap-2">
                              <span className="text-brown-300 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote footer */}
                <div className="mt-8 pt-6 border-t border-brown-100">
                  <p className="text-brown-400 italic text-sm leading-relaxed">
                    "{member.quote}"
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

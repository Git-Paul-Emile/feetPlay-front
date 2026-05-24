import { useEffect } from 'react';
import { Link } from 'react-router';
import { Users, Target, Award, Globe, Heart, Zap } from 'lucide-react';

export function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passion',
      description: 'Nous aimons ce que nous faisons et mettons notre cœur dans chaque projet'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Communauté',
      description: 'Nous plaçons notre communauté au centre de tout ce que nous créons'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Nous repoussons constamment les limites de la technologie'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque aspect de notre service'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Accessibilité',
      description: 'Rendre le divertissement accessible à tous en Afrique centrale'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Impact',
      description: 'Créer un impact positif dans l\'industrie du divertissement africain'
    }
  ];

  const teamMembers = [
    {
      name: 'Jean-Claude Mbemba',
      role: 'CEO & Fondateur',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Marie Nguesso',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      name: 'David Okemba',
      role: 'Directeur Commercial',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      name: 'Sarah Mabiala',
      role: 'Directrice Contenu',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Lancement de Fééti Play',
      description: 'Première plateforme de streaming en République du Congo'
    },
    {
      year: '2025',
      title: 'Expansion régionale',
      description: 'Extension à 6 pays d\'Afrique centrale'
    },
    {
      year: '2026',
      title: '100 000 utilisateurs',
      description: 'Franchissement du cap des 100 000 utilisateurs actifs'
    },
    {
      year: '2026',
      title: 'Système créateurs',
      description: 'Lancement du système d\'abonnement aux créateurs'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#CDFF71] hover:text-[#b8e65a] transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-['Inter',sans-serif]">Retour à l'accueil</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="font-['Montserrat',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
            À propos de <span className="text-[#CDFF71]">Fééti Play</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            La première plateforme de streaming et de divertissement made in Afrique centrale,
            créée pour démocratiser l'accès aux contenus de qualité et célébrer les talents locaux.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl p-8 md:p-12 border border-white/10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
                Notre Mission
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Chez Fééti Play, nous croyons que le divertissement de qualité doit être accessible à tous.
                Notre mission est de créer une plateforme qui connecte les créateurs africains avec leur audience,
                tout en offrant une expérience de streaming exceptionnelle.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Nous nous engageons à soutenir les talents locaux, à promouvoir la culture africaine et à
                bâtir une communauté vibrante autour du divertissement digital.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                alt="Notre équipe"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-12 text-center">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 border border-white/10 rounded-2xl p-6 hover:border-[#16BDA0]/50 transition-all"
              >
                <div className="w-16 h-16 bg-[#16BDA0]/20 rounded-xl flex items-center justify-center text-[#16BDA0] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-12 text-center">
            Notre Histoire
          </h2>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Timeline line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#16BDA0] to-transparent" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-8 h-8 bg-[#16BDA0] rounded-full border-4 border-[#080808] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>

                <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[#CDFF71] text-2xl font-bold">{milestone.year}</span>
                    <h3 className="text-white text-xl font-bold">{milestone.title}</h3>
                  </div>
                  <p className="text-white/70">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-12 text-center">
            Notre Équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[#16BDA0]/50 transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-white text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-[#16BDA0]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-12 text-center">
            Fééti Play en chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-[#CDFF71] text-4xl md:text-5xl font-bold mb-2">100K+</div>
              <div className="text-white/60">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-[#16BDA0] text-4xl md:text-5xl font-bold mb-2">6</div>
              <div className="text-white/60">Pays couverts</div>
            </div>
            <div className="text-center">
              <div className="text-[#DE0035] text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/60">Créateurs</div>
            </div>
            <div className="text-center">
              <div className="text-[#CDFF71] text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-white/60">Contenus</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <h2 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Rejoignez l'aventure Fééti Play
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Faites partie de la révolution du divertissement en Afrique centrale
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
            >
              Créer un compte
            </Link>
            <Link
              to="/createurs"
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Devenir créateur
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

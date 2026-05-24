import { useEffect } from 'react';
import { Link } from 'react-router';
import { Download, Mail, Phone, ExternalLink } from 'lucide-react';

export function Press() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pressReleases = [
    {
      date: '15 Mai 2026',
      title: 'Feeti Play lance son système d\'abonnement aux créateurs',
      description: 'La plateforme de streaming et de divertissement annonce une nouvelle fonctionnalité permettant aux utilisateurs de soutenir leurs créateurs favoris.',
      link: '#'
    },
    {
      date: '3 Avril 2026',
      title: 'Feeti Play atteint 100 000 utilisateurs actifs',
      description: 'La plateforme congolaise de streaming connaît une croissance exceptionnelle dans toute l\'Afrique centrale.',
      link: '#'
    },
    {
      date: '12 Mars 2026',
      title: 'Partenariat stratégique avec les plus grands artistes africains',
      description: 'Feeti Play annonce des partenariats exclusifs pour diffuser les concerts et événements en direct.',
      link: '#'
    }
  ];

  const mediaAssets = [
    {
      title: 'Kit de presse complet',
      description: 'Logos, visuels et informations sur la plateforme',
      size: '12.4 MB',
      format: 'ZIP'
    },
    {
      title: 'Guide de la marque',
      description: 'Charte graphique et règles d\'utilisation',
      size: '3.2 MB',
      format: 'PDF'
    },
    {
      title: 'Captures d\'écran',
      description: 'Images haute résolution de l\'interface',
      size: '8.7 MB',
      format: 'ZIP'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-['Montserrat',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-4">
            Espace <span className="text-[#CDFF71]">Presse</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
            Toutes les actualités, communiqués de presse et ressources médias de Feeti Play
          </p>
        </div>

        {/* Contact Presse */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl p-8 md:p-10 border border-white/10 mb-12">
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-6">
            Contact Presse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#16BDA0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#16BDA0]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <a href="mailto:press@feeti.io" className="text-[#16BDA0] hover:text-[#0d9488] transition-colors">
                  press@feeti.io
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#DE0035]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#DE0035]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Téléphone</h3>
                <a href="tel:+242000000000" className="text-white/80 hover:text-white transition-colors">
                  +242 00 000 00 00
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Communiqués de presse */}
        <section className="mb-12">
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-8">
            Communiqués de presse
          </h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:border-[#16BDA0]/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-[#16BDA0] text-sm font-semibold mb-2">{release.date}</p>
                    <h3 className="text-white text-xl font-bold mb-2">{release.title}</h3>
                    <p className="text-white/70">{release.description}</p>
                  </div>
                  <a
                    href={release.link}
                    className="flex items-center gap-2 text-[#CDFF71] hover:text-[#b8e65a] transition-colors flex-shrink-0"
                  >
                    <span className="text-sm">Lire plus</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ressources médias */}
        <section>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-8">
            Ressources médias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaAssets.map((asset, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 border border-white/10 rounded-2xl p-6 hover:border-[#16BDA0]/50 transition-all"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-[#CDFF71]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{asset.title}</h3>
                <p className="text-white/60 text-sm mb-4">{asset.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs">
                    {asset.format} • {asset.size}
                  </span>
                  <button className="flex items-center gap-2 bg-[#16BDA0] hover:bg-[#0d9488] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* À propos de Feeti Play */}
        <section className="mt-12 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 md:p-10">
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-6">
            À propos de Feeti Play
          </h2>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              Feeti Play est la première plateforme de streaming et de divertissement d'Afrique centrale,
              développée par Eroiste SARL, une société congolaise basée à Brazzaville, République du Congo.
            </p>
            <p>
              Notre mission est de démocratiser l'accès aux contenus de qualité en Afrique centrale tout en
              offrant aux créateurs locaux une plateforme pour partager leur talent avec le monde.
            </p>
            <p>
              Avec des fonctionnalités innovantes comme le streaming en direct, les replays à la demande,
              et un système d'abonnement aux créateurs, Feeti Play révolutionne l'industrie du divertissement
              en Afrique.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

import { BannerSlider } from './BannerSlider';
import { PromoSlider } from './PromoSlider';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SliderDemo() {
  const mainBanners = [
    {
      id: 1,
      type: 'live' as const,
      title: 'NBA Finals',
      subtitle: 'Lakers vs Celtics - Game 7',
      description: 'Match décisif en direct ! Ne manquez pas la finale historique.',
      location: 'TD Garden, Boston',
      date: 'Aujourd\'hui',
      time: '21:00',
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&h=600&fit=crop',
      ctaText: 'Regarder maintenant',
      ctaAction: () => console.log('Ouvrir live NBA'),
      gradient: 'bg-gradient-to-r from-[#1a1a2e] via-[#16537e] to-transparent',
    },
    {
      id: 2,
      type: 'replay' as const,
      title: 'Disponible en Replay',
      subtitle: 'Concert de la tournée mondiale',
      description: 'Revivez l\'événement exceptionnel de ce week-end !',
      location: 'Accor Arena Paris',
      date: 'SAM 19.09.25',
      time: '20:00',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop',
      ctaText: 'Voir la vidéo',
      ctaAction: () => console.log('Ouvrir replay concert'),
      gradient: 'bg-gradient-to-r from-[#03033b] via-[#16bda0] to-transparent',
    },
    {
      id: 3,
      type: 'upcoming' as const,
      title: 'À ne pas manquer',
      subtitle: 'Ligue 1 - PSG vs OM',
      description: 'Le Classique de la saison ! Réservez vos places dès maintenant.',
      location: 'Parc des Princes, Paris',
      date: 'DIM 28.05.26',
      time: '21:00',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=600&fit=crop',
      ctaText: 'Réserver maintenant',
      ctaAction: () => console.log('Ouvrir réservation PSG OM'),
      gradient: 'bg-gradient-to-r from-[#0a1929] via-[#1565c0] to-transparent',
    },
    {
      id: 4,
      type: 'promo' as const,
      title: 'Offre exclusive',
      subtitle: '-50% sur tous les replays',
      description: 'Profitez de notre offre spéciale du week-end sur l\'ensemble du catalogue.',
      date: 'Valable ce week-end',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop',
      ctaText: 'Découvrir l\'offre',
      ctaAction: () => console.log('Ouvrir catalogue promo'),
      gradient: 'bg-gradient-to-r from-[#4a148c] via-[#7b1fa2] to-transparent',
    },
  ];

  const promoOffers = [
    {
      id: 1,
      icon: 'star' as const,
      title: 'Abonnement mensuel',
      discount: '-30%',
      description: 'Accès illimité à tous les événements en direct et replay',
      validUntil: '31 Mai 2026',
      backgroundColor: 'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]',
      accentColor: 'text-yellow-400',
      ctaText: 'S\'abonner',
      ctaAction: () => console.log('Abonnement mensuel'),
    },
    {
      id: 2,
      icon: 'gift' as const,
      title: 'Pack famille',
      discount: '-40%',
      description: 'Jusqu\'à 5 profils simultanés pour toute la famille',
      validUntil: '15 Juin 2026',
      backgroundColor: 'bg-gradient-to-br from-[#16BDA0] to-[#0d9488]',
      accentColor: 'text-pink-400',
      ctaText: 'Profiter',
      ctaAction: () => console.log('Pack famille'),
    },
    {
      id: 3,
      icon: 'zap' as const,
      title: 'Week-end sportif',
      discount: '-25%',
      description: 'Tous les événements sportifs du week-end à prix réduit',
      validUntil: '20 Mai 2026',
      backgroundColor: 'bg-gradient-to-br from-[#dc2626] to-[#991b1b]',
      accentColor: 'text-orange-400',
      ctaText: 'Réserver',
      ctaAction: () => console.log('Week-end sportif'),
    },
    {
      id: 4,
      icon: 'star' as const,
      title: 'Premium annuel',
      discount: '-50%',
      description: 'Un an d\'accès total + contenus exclusifs et avant-premières',
      validUntil: '30 Juin 2026',
      backgroundColor: 'bg-gradient-to-br from-[#7c3aed] to-[#6d28d9]',
      accentColor: 'text-yellow-300',
      ctaText: 'Découvrir',
      ctaAction: () => console.log('Premium annuel'),
    },
    {
      id: 5,
      icon: 'gift' as const,
      title: 'Étudiant',
      discount: '-35%',
      description: 'Tarif spécial pour les étudiants avec justificatif',
      validUntil: '31 Août 2026',
      backgroundColor: 'bg-gradient-to-br from-[#0891b2] to-[#0e7490]',
      accentColor: 'text-green-400',
      ctaText: 'Vérifier',
      ctaAction: () => console.log('Offre étudiant'),
    },
  ];

  return (
    <div className="space-y-16">
      {/* Slider principal avec bannières */}
      <section>
        <BannerSlider banners={mainBanners} />
      </section>

      {/* Slider de promotions */}
      <section>
        <PromoSlider promos={promoOffers} />
      </section>

      {/* Section informative */}
      <section className="bg-gradient-to-r from-[#03033b] to-[#16bda0]/20 rounded-3xl p-12 text-center">
        <h2 className="text-white text-4xl font-bold mb-4">
          Des contenus variés pour tous les goûts
        </h2>
        <p className="text-white/80 text-xl max-w-3xl mx-auto">
          Découvrez nos événements en direct, replays exclusifs et offres promotionnelles.
          Chaque slider affiche du contenu différent pour une expérience unique.
        </p>
      </section>
    </div>
  );
}

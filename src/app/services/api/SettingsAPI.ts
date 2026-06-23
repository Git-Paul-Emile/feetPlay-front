import { fetchWithApiFallback } from '../../utils/serviceConfig';

export interface PromoOffer {
  id: number;
  icon: 'star' | 'gift' | 'zap';
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  backgroundColor: string;
  accentColor: string;
  ctaText: string;
  ctaLink: string;
}

interface PublicSettings {
  PROMO_OFFERS?: PromoOffer[];
  HERO_BANNERS?: unknown[];
  REPLAY_SLIDES?: unknown[];
}

const SettingsAPI = {
  async getPublicSettings(): Promise<PublicSettings> {
    const response = await fetchWithApiFallback('/settings/public');
    if (!response.ok) throw new Error('Erreur chargement paramètres');
    const result = await response.json();
    return (result.data as PublicSettings) ?? {};
  },
};

export default SettingsAPI;

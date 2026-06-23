import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Star, MapPin, Users, Play, Mic, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { CreatorContentCard } from '../components/CreatorContentCard';
import CreatorAPI from '../services/api/CreatorAPI';

type ContentTab = 'videos' | 'podcasts' | 'autres';

export function CreatorDetail() {
  const { id } = useParams();
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // On suppose que l'id dans l'URL (ex: /creator/ethan-caldwell) correspond au slug
    CreatorAPI.getBySlug(id)
      .then((data) => {
        setCreator(data);
        setError(null);
      })
      .catch((err) => setError(err.message || "Erreur lors du chargement du créateur"))
      .finally(() => setLoading(false));
  }, [id]);

  const getActiveContent = () => {
    if (!creator) return [];
    // Filtrage basique en fonction de la catégorie si le backend renvoie toutes les vidéos dans creator.videos
    switch (activeTab) {
      case 'videos':
        return creator.videos?.filter((v: any) => v.category === 'video' || !v.category) || [];
      case 'podcasts':
        return creator.videos?.filter((v: any) => v.category === 'podcast') || [];
      case 'autres':
        return creator.videos?.filter((v: any) => v.category !== 'video' && v.category !== 'podcast' && v.category) || [];
      default:
        return [];
    }
  };

  const tabs = [
    { id: 'videos' as ContentTab, label: 'Vidéos', icon: Play, count: creator?.videos?.filter((v: any) => v.category === 'video' || !v.category).length || 0 },
    { id: 'podcasts' as ContentTab, label: 'Podcasts', icon: Mic, count: creator?.videos?.filter((v: any) => v.category === 'podcast').length || 0 },
    { id: 'autres' as ContentTab, label: 'Autres', icon: FileText, count: creator?.videos?.filter((v: any) => v.category !== 'video' && v.category !== 'podcast' && v.category).length || 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-20 flex justify-center items-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-20 flex justify-center items-center">
        <div className="text-white">{error || 'Créateur introuvable'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link to="/createurs">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Inter',sans-serif] text-sm">Retour aux créateurs</span>
          </motion.button>
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Creator Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Creator Image */}
            <div className="relative w-full md:w-64 aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={creator.avatar || creator.coverImage || 'https://via.placeholder.com/400'}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Creator Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-['Inter',sans-serif] text-white text-4xl md:text-5xl font-bold mb-2">
                    {creator.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-[#CDFF71]/10 border border-[#CDFF71]/30 rounded-full font-['Inter',sans-serif] text-[#CDFF71] text-sm font-medium">
                      {creator.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#CDFF71] fill-[#CDFF71]" />
                      <span className="font-['Inter',sans-serif] text-white font-semibold">
                        4.8
                      </span>
                      <span className="font-['Inter',sans-serif] text-white/50 text-sm">
                        (142 avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="font-['Inter',sans-serif] text-white/70 text-base leading-relaxed mb-6">
                {creator.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#CDFF71]" />
                  <span className="font-['Inter',sans-serif] text-white font-semibold">
                    {creator.subscriberCount?.toLocaleString() || 0}
                  </span>
                  <span className="font-['Inter',sans-serif] text-white/50 text-sm">
                    abonnés
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-white/70" />
                  <span className="font-['Inter',sans-serif] text-white/70 text-sm">
                    {creator.location || 'Localisation non renseignée'}
                  </span>
                </div>
              </div>

              {/* Subscribe Button */}
              <button className="mt-6 px-8 py-3 bg-gradient-to-r from-[#CDFF71] to-[#B8E65C] text-black font-['Inter',sans-serif] font-semibold rounded-full hover:shadow-[0_0_30px_rgba(205,255,113,0.6)] transition-all duration-300">
                S'abonner
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 font-['Inter',sans-serif] font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'text-[#CDFF71]'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? 'bg-[#CDFF71]/20 text-[#CDFF71]'
                        : 'bg-white/10 text-white/50'
                    }`}>
                      {tab.count}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CDFF71]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getActiveContent().map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/video/${content.id}`}>
                <CreatorContentCard {...content} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

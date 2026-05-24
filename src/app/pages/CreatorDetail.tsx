import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Star, MapPin, Users, Play, Mic, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { CreatorContentCard } from '../components/CreatorContentCard';

type ContentTab = 'videos' | 'podcasts' | 'autres';

export function CreatorDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<ContentTab>('videos');

  // Mock data - in real app, fetch from API based on id
  const creator = {
    id: id,
    name: 'Ethan Caldwell',
    category: 'Football',
    followers: 15420,
    rating: 4.8,
    reviews: 142,
    location: 'Congo, Brazzaville',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
    bio: 'Créateur de contenu passionné par le football avec plus de 20 ans d\'expérience dans le commentaire et l\'analyse sportive. Spécialisé dans la couverture des championnats africains et européens.',
  };

  // Mock content data
  const videos = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
      title: 'Analyse Tactique: TP Mazembe vs AS Vita Club',
      date: '15 Mai 2026',
      duration: '45:30',
      views: '12.5K',
      type: 'video' as const
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop',
      title: 'Les meilleurs buts de la semaine en Ligue 1',
      date: '14 Mai 2026',
      duration: '15:20',
      views: '25.3K',
      type: 'video' as const
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
      title: 'Interview exclusive: Samuel Eto\'o',
      date: '12 Mai 2026',
      duration: '1:05:45',
      views: '45.8K',
      type: 'video' as const
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop',
      title: 'Coulisses: Entraînement des Léopards',
      date: '10 Mai 2026',
      duration: '22:15',
      views: '18.2K',
      type: 'video' as const
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
      title: 'Top 10 des jeunes talents africains à suivre',
      date: '8 Mai 2026',
      duration: '32:40',
      views: '33.7K',
      type: 'video' as const
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=600&h=400&fit=crop',
      title: 'Histoire du football congolais',
      date: '5 Mai 2026',
      duration: '58:12',
      views: '28.9K',
      type: 'video' as const
    }
  ];

  const podcasts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop',
      title: 'Le Mercato Africain: Épisode 15',
      date: '16 Mai 2026',
      duration: '52:30',
      views: '8.5K',
      type: 'podcast' as const
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop',
      title: 'Débat: Meilleur joueur africain 2026?',
      date: '13 Mai 2026',
      duration: '1:15:20',
      views: '15.3K',
      type: 'podcast' as const
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop',
      title: 'Invité: Didier Drogba',
      date: '9 Mai 2026',
      duration: '1:25:45',
      views: '42.8K',
      type: 'podcast' as const
    }
  ];

  const autres = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
      title: 'Guide: Comment analyser un match comme un pro',
      date: '11 Mai 2026',
      duration: '10 min',
      views: '6.2K',
      type: 'other' as const
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&h=400&fit=crop',
      title: 'Infographie: Statistiques CAN 2023',
      date: '7 Mai 2026',
      duration: '5 min',
      views: '9.8K',
      type: 'other' as const
    }
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 'videos':
        return videos;
      case 'podcasts':
        return podcasts;
      case 'autres':
        return autres;
    }
  };

  const tabs = [
    { id: 'videos' as ContentTab, label: 'Vidéos', icon: Play, count: videos.length },
    { id: 'podcasts' as ContentTab, label: 'Podcasts', icon: Mic, count: podcasts.length },
    { id: 'autres' as ContentTab, label: 'Autres', icon: FileText, count: autres.length }
  ];

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
                src={creator.image}
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
                        {creator.rating.toFixed(1)}
                      </span>
                      <span className="font-['Inter',sans-serif] text-white/50 text-sm">
                        ({creator.reviews} avis)
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
                    {creator.followers.toLocaleString()}
                  </span>
                  <span className="font-['Inter',sans-serif] text-white/50 text-sm">
                    abonnés
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-white/70" />
                  <span className="font-['Inter',sans-serif] text-white/70 text-sm">
                    {creator.location}
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
              <CreatorContentCard {...content} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

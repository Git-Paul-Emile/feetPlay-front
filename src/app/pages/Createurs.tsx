import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronLeft, ChevronRight, Check, Users, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Slider from 'react-slick';
import { CreatorCard } from '../components/CreatorCard';
import { useSubscription } from '../contexts/SubscriptionContext';
import CreatorAPI from '../services/api/CreatorAPI';

// Custom Arrow Components
function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 w-12 h-12 bg-[#CDFF71] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_25px_rgba(205,255,113,0.6)] hover:scale-110 transition-all duration-300"
    >
      <ChevronRight className="w-6 h-6 text-black" strokeWidth={2.5} />
    </button>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-6 -translate-y-1/2 z-10 w-12 h-12 bg-[#CDFF71] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_25px_rgba(205,255,113,0.6)] hover:scale-110 transition-all duration-300"
    >
      <ChevronLeft className="w-6 h-6 text-black" strokeWidth={2.5} />
    </button>
  );
}

export function Createurs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { creators: subscriptionCreators, getCreatorSubscription } = useSubscription();

  const [creatorsData, setCreatorsData] = useState<Array<{ id: string; name: string; category: string; followers: number; rating: number; image: string }>>([]);
  useEffect(() => {
    CreatorAPI.getAll().then(list => setCreatorsData(list.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      followers: c.subscriberCount,
      rating: 4.8,
      image: c.avatar || '/images/default-avatar.png',
    })))).catch(() => {});
  }, []);

  const filteredCreators = creatorsData.filter((creator) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscriptionCreators = subscriptionCreators.filter((creator) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ],
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/30 hover:bg-[#CDFF71] transition-all duration-300" />
    ),
    dotsClass: "slick-dots !bottom-[-40px] flex items-center justify-center gap-2"
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-['Inter',sans-serif] text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Nos <span className="text-[#CDFF71]">Créateurs</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Découvrez les talents qui rendent notre plateforme unique
          </p>
        </motion.div>

        {/* Floating Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div
            className={`relative bg-white/10 backdrop-blur-xl rounded-full border transition-all duration-300 ${
              searchFocused ? 'border-[#CDFF71] shadow-[0_0_30px_rgba(205,255,113,0.3)]' : 'border-white/20'
            }`}
          >
            <Search
              className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                searchFocused ? 'text-[#CDFF71]' : 'text-white/50'
              }`}
            />
            <input
              type="text"
              placeholder="Rechercher un créateur par nom ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-14 pr-6 py-4 bg-transparent text-white placeholder:text-white/50 font-['Inter',sans-serif] text-base focus:outline-none"
            />
          </div>

          {/* Search Results Count */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-3 text-center"
              >
                <p className="font-['Inter',sans-serif] text-white/70 text-sm">
                  {filteredCreators.length} résultat{filteredCreators.length !== 1 ? 's' : ''} trouvé{filteredCreators.length !== 1 ? 's' : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subscription Creators Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-white text-3xl font-bold mb-8">Créateurs avec abonnements exclusifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptionCreators.map((creator) => {
              const subscription = getCreatorSubscription(creator.id);

              return (
                <motion.div
                  key={creator.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/creator-profile/${creator.id}`)}
                  className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={creator.coverImage}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {creator.isVerified && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[#16BDA0] rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                      />
                      <div className="flex-1">
                        <h3 className="text-white text-xl font-bold mb-1">{creator.name}</h3>
                        <p className="text-white/60 text-sm">{creator.username}</p>
                      </div>
                    </div>

                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {creator.bio}
                    </p>

                    <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {creator.subscriberCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {creator.contentCount}
                      </div>
                    </div>

                    {subscription?.status === 'active' ? (
                      <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold text-sm">Abonné</span>
                      </div>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white py-2.5 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all">
                        S'abonner
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Creators Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative px-12"
        >
          <h2 className="text-white text-3xl font-bold mb-8">Tous les créateurs</h2>
          {filteredCreators.length > 0 ? (
            <Slider {...sliderSettings}>
              {filteredCreators.map((creator) => (
                <div key={creator.id} className="px-3">
                  <CreatorCard {...creator} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-20">
              <p className="font-['Inter',sans-serif] text-white/50 text-lg">
                Aucun créateur trouvé pour "{searchQuery}"
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

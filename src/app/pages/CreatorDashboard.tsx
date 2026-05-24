import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
  Users, DollarSign, TrendingUp, TrendingDown, Upload, Plus, Eye, Clock, Edit, Trash2
} from 'lucide-react';
import { Line } from 'recharts';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ExclusiveContent, SubscriptionTier } from '../types/subscription';

export function CreatorDashboard() {
  const { getCreatorStats, publishContent, exclusiveContents } = useSubscription();
  const creatorId = 'creator-1';
  const stats = getCreatorStats(creatorId);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ExclusiveContent>>({
    title: '',
    description: '',
    type: 'video',
    thumbnailUrl: '',
    contentUrl: '',
    requiredTier: 'basic',
    isPublished: true,
  });

  const creatorContent = exclusiveContents.filter(c => c.creatorId === creatorId);

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-white text-xl">Chargement des statistiques...</p>
      </div>
    );
  }

  const handlePublishContent = () => {
    if (newContent.title && newContent.description && newContent.thumbnailUrl) {
      publishContent(creatorId, {
        ...newContent as Omit<ExclusiveContent, 'id' | 'viewCount' | 'publishedAt'>,
        creatorId,
      });
      setShowPublishModal(false);
      setNewContent({
        title: '',
        description: '',
        type: 'video',
        thumbnailUrl: '',
        contentUrl: '',
        requiredTier: 'basic',
        isPublished: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-white text-4xl font-bold mb-4">Tableau de bord créateur</h1>
          <p className="text-white/60 text-lg">
            Gérez vos abonnés et votre contenu exclusif
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white/60 text-sm mb-1">Abonnés actifs</h3>
            <p className="text-white text-3xl font-bold">{stats.activeSubscribers.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-2">
              +5.2% ce mois
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white/60 text-sm mb-1">Revenus mensuels</h3>
            <p className="text-white text-3xl font-bold">
              {(stats.monthlyRevenue / 1000000).toFixed(1)}M FCFA
            </p>
            <p className="text-green-400 text-sm mt-2">
              +12.3% ce mois
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white/60 text-sm mb-1">Revenus totaux</h3>
            <p className="text-white text-3xl font-bold">
              {(stats.totalRevenue / 1000000).toFixed(1)}M FCFA
            </p>
            <p className="text-green-400 text-sm mt-2">
              Depuis le début
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-white/60 text-sm mb-1">Taux de désabonnement</h3>
            <p className="text-white text-3xl font-bold">{stats.churnRate}%</p>
            <p className="text-red-400 text-sm mt-2">
              -0.8% ce mois
            </p>
          </motion.div>
        </div>

        {/* Subscriber Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Plan Basic</h3>
            <p className="text-white text-4xl font-bold mb-2">
              {stats.subscribersByTier.basic.toLocaleString()}
            </p>
            <p className="text-white/60">abonnés</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Plan Premium</h3>
            <p className="text-white text-4xl font-bold mb-2">
              {stats.subscribersByTier.premium.toLocaleString()}
            </p>
            <p className="text-white/60">abonnés</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Plan VIP</h3>
            <p className="text-white text-4xl font-bold mb-2">
              {stats.subscribersByTier.vip.toLocaleString()}
            </p>
            <p className="text-white/60">abonnés</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="text-white text-2xl font-bold mb-6">Évolution des revenus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16BDA0"
                strokeWidth={3}
                dot={{ fill: '#16BDA0', r: 6 }}
                name="Revenus (FCFA)"
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="#DE0035"
                strokeWidth={3}
                dot={{ fill: '#DE0035', r: 6 }}
                name="Abonnés"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Management */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Contenu exclusif</h2>
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
            >
              <Plus className="w-5 h-5" />
              Publier du contenu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorContent.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-video">
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
                      {content.requiredTier.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {content.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">
                    {content.description}
                  </p>

                  <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {content.viewCount.toLocaleString()} vues
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(content.publishedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition-colors border border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Publish Content Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Publier du contenu exclusif</h2>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 text-white rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Titre</label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    placeholder="Titre du contenu"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">Description</label>
                  <textarea
                    value={newContent.description}
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                    placeholder="Description du contenu"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Type</label>
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#16BDA0]"
                    >
                      <option value="video">Vidéo</option>
                      <option value="podcast">Podcast</option>
                      <option value="post">Post</option>
                      <option value="live_stream">Live Stream</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Niveau requis</label>
                    <select
                      value={newContent.requiredTier}
                      onChange={(e) => setNewContent({ ...newContent, requiredTier: e.target.value as SubscriptionTier })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#16BDA0]"
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">URL de la miniature</label>
                  <input
                    type="url"
                    value={newContent.thumbnailUrl}
                    onChange={(e) => setNewContent({ ...newContent, thumbnailUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">URL du contenu</label>
                  <input
                    type="url"
                    value={newContent.contentUrl}
                    onChange={(e) => setNewContent({ ...newContent, contentUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                  />
                </div>

                <button
                  onClick={handlePublishContent}
                  className="w-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white py-3.5 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Publier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

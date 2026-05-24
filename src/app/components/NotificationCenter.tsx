import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router';
import { Bell, Check, X, AlertCircle, Gift, DollarSign, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationCenter() {
  const { notifications, markNotificationAsRead } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'subscription_confirmed':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'renewal_reminder':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'payment_failed':
        return <X className="w-5 h-5 text-red-400" />;
      case 'new_content':
        return <Video className="w-5 h-5 text-[#16BDA0]" />;
      case 'price_change':
        return <DollarSign className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-white" />;
    }
  };

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markNotificationAsRead(notificationId);
    if (actionUrl) {
      navigate(actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-white/60 text-sm">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 cursor-pointer transition-colors ${
                          notification.read ? 'bg-transparent' : 'bg-white/5'
                        } hover:bg-white/10`}
                        onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'subscription_confirmed' ? 'bg-green-500/20' :
                            notification.type === 'payment_failed' ? 'bg-red-500/20' :
                            notification.type === 'new_content' ? 'bg-[#16BDA0]/20' :
                            notification.type === 'renewal_reminder' ? 'bg-yellow-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-white font-semibold text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#16BDA0] rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-white/70 text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-white/40 text-xs">
                              {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsOpen(false);
                    }}
                    className="w-full text-[#16BDA0] hover:text-[#0d9488] text-sm font-semibold py-2 transition-colors"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronUp, Ticket, CreditCard, Video, Shield, Wifi, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ElementType;
}

const faqs: FAQItem[] = [
  { id: '1', category: 'Streaming & Accès', question: 'Comment regarder un événement en direct sur Fééti Play ?', answer: '1. Connectez-vous à votre compte Fééti Play\n2. Parcourez les événements disponibles depuis la page "Live"\n3. Si l\'événement est gratuit, cliquez directement sur "Regarder"\n4. Si l\'événement est payant, achetez un ticket et retournez sur la page de l\'événement\n5. Le stream démarre automatiquement à l\'heure prévue', icon: Video },
  { id: '2', category: 'Streaming & Accès', question: 'Puis-je regarder les rediffusions après l\'événement ?', answer: 'Oui ! Les replays sont disponibles pour les événements qui l\'autorisent :\n• Accédez à la section "Replay" depuis le menu\n• Les replays sont disponibles sous 24h après l\'événement live\n• Un ticket valide pour le live vous donne accès au replay\n• Certains replays nécessitent un ticket séparé', icon: Video },
  { id: '3', category: 'Streaming & Accès', question: 'Quelle qualité de connexion est nécessaire ?', answer: 'Pour une expérience optimale :\n• SD (480p) : 2 Mbps minimum\n• HD (720p) : 5 Mbps recommandés\n• Full HD (1080p) : 10 Mbps recommandés\n\nFééti Play s\'adapte automatiquement à votre débit pour éviter les coupures.', icon: Wifi },
  { id: '4', category: 'Tickets & Paiement', question: 'Comment acheter un ticket pour un événement payant ?', answer: '1. Ouvrez la page de l\'événement souhaité\n2. Cliquez sur "Acheter un ticket"\n3. Choisissez le type de ticket si plusieurs options existent\n4. Procédez au paiement (carte bancaire ou mobile money)\n5. Recevez votre QR code par email et dans "Mes Tickets"', icon: Ticket },
  { id: '5', category: 'Tickets & Paiement', question: 'Quels modes de paiement sont acceptés ?', answer: 'Fééti Play accepte :\n• Cartes bancaires (Visa, Mastercard) via Stripe\n• Mobile Money (Airtel Money, MTN Mobile Money) via Paystack\n• Cartes prépayées\n\nTous les paiements sont sécurisés et chiffrés (SSL/TLS).', icon: CreditCard },
  { id: '6', category: 'Tickets & Paiement', question: 'Où trouver mes tickets achetés ?', answer: 'Vos tickets sont accessibles depuis :\n1. La rubrique "Mes Tickets" dans votre profil\n2. L\'email de confirmation reçu après l\'achat\n\nChaque ticket contient un QR code unique à présenter à l\'entrée des événements physiques.', icon: Ticket },
  { id: '7', category: 'Compte Utilisateur', question: 'Comment créer un compte Fééti Play ?', answer: '1. Cliquez sur "S\'inscrire" en haut de la page\n2. Renseignez votre nom, email et mot de passe\n3. Validez votre email via le lien de confirmation\n4. Votre compte est prêt !\n\nVous pouvez aussi vous connecter avec Google ou Facebook.', icon: Shield },
  { id: '8', category: 'Compte Utilisateur', question: 'J\'ai oublié mon mot de passe, que faire ?', answer: '1. Cliquez sur "Mot de passe oublié ?" sur la page de connexion\n2. Entrez votre adresse email\n3. Recevez un lien de réinitialisation par email\n4. Créez un nouveau mot de passe sécurisé\n\nSi vous ne recevez pas l\'email, vérifiez vos spams ou contactez support@feetiplay.com', icon: Shield },
  { id: '9', category: 'QR Code & Événements', question: 'Comment utiliser mon QR code à l\'entrée ?', answer: 'À l\'entrée de l\'événement physique :\n1. Ouvrez votre ticket depuis "Mes Tickets" ou l\'email de confirmation\n2. Présentez le QR code à l\'agent de sécurité\n3. Le QR code sera scanné une seule fois\n\n⚠️ Ne partagez jamais votre QR code avant l\'événement — il ne peut être utilisé qu\'une seule fois.', icon: Smartphone },
  { id: '10', category: 'QR Code & Événements', question: 'Que faire si mon QR code ne fonctionne pas ?', answer: 'Solutions possibles :\n• Augmentez la luminosité de votre écran au maximum\n• Téléchargez à nouveau le ticket depuis "Mes Tickets"\n• Imprimez le billet PDF reçu par email\n• Contactez l\'équipe sur place avec votre email de confirmation et numéro de commande', icon: HelpCircle },
  { id: '11', category: 'Sécurité', question: 'Mes données de paiement sont-elles sécurisées ?', answer: 'Oui, absolument :\n• Chiffrement SSL/TLS pour toutes les transactions\n• Paiements traités par Stripe et Paystack (certifiés PCI-DSS)\n• Fééti Play ne stocke jamais vos coordonnées bancaires complètes\n• Authentification à deux facteurs disponible', icon: Shield },
  { id: '12', category: 'Support Technique', question: 'Le stream se coupe ou est de mauvaise qualité, que faire ?', answer: 'Solutions de dépannage :\n1. Vérifiez votre connexion Internet (testez votre débit)\n2. Actualisez la page (F5)\n3. Videz le cache de votre navigateur\n4. Essayez en navigation privée\n5. Réduisez la qualité vidéo manuellement\n\nSi le problème vient de notre côté, nous en serons informés automatiquement.', icon: HelpCircle },
  { id: '13', category: 'Support Technique', question: 'Je ne reçois pas les emails de Fééti Play', answer: 'Vérifications :\n1. Dossier spam/courrier indésirable\n2. Adresse email dans votre compte est correcte\n3. Ajoutez noreply@feetiplay.com à vos contacts\n\nSi le problème persiste, contactez support@feetiplay.com avec votre numéro de commande.', icon: HelpCircle },
];

export function FAQ() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const categories = ['Tous', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Foire Aux Questions (FAQ)</h1>
              <p className="text-gray-400 text-sm mt-0.5">Trouvez rapidement des réponses à vos questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Search */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aucune question trouvée</p>
              <p className="text-gray-600 mt-2 text-sm">Essayez une autre recherche ou catégorie</p>
            </div>
          ) : (
            filteredFAQs.map(faq => {
              const Icon = faq.icon;
              const isOpen = openItems.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`bg-white/5 border rounded-xl transition-all duration-200 cursor-pointer ${
                    isOpen ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => toggleItem(faq.id)}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-0.5 rounded mb-2 inline-block">{faq.category}</span>
                            <h3 className="text-white font-semibold leading-snug">{faq.question}</h3>
                          </div>
                          <div className="flex-shrink-0 mt-0.5">
                            {isOpen
                              ? <ChevronUp className="w-5 h-5 text-blue-400" />
                              : <ChevronDown className="w-5 h-5 text-gray-500" />
                            }
                          </div>
                        </div>
                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center mt-10">
          <HelpCircle className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm">Notre équipe support est disponible pour vous aider.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:support@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors">
              support@feetiplay.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

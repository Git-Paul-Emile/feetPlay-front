import { ArrowLeft, Cookie, Settings, BarChart2, Shield, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Politique de Cookies</h1>
              <p className="text-gray-400 text-sm mt-0.5">Version 1.0 | Entrée en vigueur : 08 mars 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Intro */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-8">
          <p className="text-gray-300 leading-relaxed">
            Fééti Play utilise des cookies et technologies similaires pour améliorer votre expérience de streaming.
            La gestion de votre consentement est assurée par notre partenaire{' '}
            <strong className="text-amber-400">CookieYes</strong>, qui vous permet de contrôler facilement vos préférences.
          </p>
        </div>

        <Section title={<><Cookie className="w-5 h-5 text-amber-400" /> 1. Qu'est-ce qu'un cookie ?</>}>
          <p>Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site web. Les cookies permettent à Fééti Play de vous reconnaître, de mémoriser vos préférences et de vous offrir une expérience personnalisée.</p>
        </Section>

        <Section title={<><Settings className="w-5 h-5 text-amber-400" /> 2. Cookies strictement nécessaires</>}>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-medium mb-2">Toujours actifs — ne peuvent pas être désactivés</p>
            <p>Ces cookies sont indispensables au fonctionnement de la plateforme :</p>
          </div>
          <ul className="space-y-2 ml-4 mt-3">
            {[
              ['Session d\'authentification', 'Maintient votre connexion active', '1 heure'],
              ['Token de rafraîchissement', 'Renouvelle automatiquement votre session', '30 jours'],
              ['Panier et tickets', 'Conserve vos sélections en cours d\'achat', 'Session'],
              ['Préférences de langue', 'Mémorise la langue d\'interface choisie', '1 an'],
            ].map(([name, desc, duration]) => (
              <li key={name} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{desc}</div>
                  </div>
                  <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded">{duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={<><BarChart2 className="w-5 h-5 text-amber-400" /> 3. Cookies analytiques</>}>
          <p className="text-gray-400 text-sm italic mb-3">Soumis à votre consentement via CookieYes</p>
          <p>Ces cookies nous aident à comprendre comment vous utilisez Fééti Play, afin d'améliorer nos services :</p>
          <ul className="space-y-2 ml-4 mt-3">
            {[
              ['Statistiques de visionnage', 'Nombre de vues, durée d\'écoute, taux d\'abandon'],
              ['Navigation', 'Pages visitées, clics, parcours utilisateur'],
              ['Performance', 'Temps de chargement, erreurs techniques'],
            ].map(([name, desc]) => (
              <li key={name} className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span><strong className="text-white">{name} :</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={<><Shield className="w-5 h-5 text-amber-400" /> 4. Cookies de personnalisation</>}>
          <p className="text-gray-400 text-sm italic mb-3">Soumis à votre consentement via CookieYes</p>
          <p>Ces cookies permettent de personnaliser votre expérience :</p>
          <ul className="space-y-1 ml-4">
            {[
              'Recommandations de streams basées sur votre historique',
              'Mémorisation de vos chaînes favorites',
              'Qualité vidéo préférée',
              'Position de lecture pour reprendre où vous en étiez',
            ].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-amber-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><X className="w-5 h-5 text-red-400" /> 5. Gérer vos préférences</>}>
          <p>Vous pouvez gérer vos préférences de cookies à tout moment :</p>
          <div className="bg-white/5 rounded-lg p-4 mt-2 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Bannière CookieYes</div>
                <div className="text-gray-400 text-sm">Lors de votre première visite, une bannière vous invite à accepter ou refuser chaque catégorie de cookies. Vous pouvez modifier ce choix à tout moment via le lien en bas de page.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Paramètres navigateur</div>
                <div className="text-gray-400 text-sm">Vous pouvez bloquer ou supprimer les cookies via les paramètres de votre navigateur. Note : certaines fonctionnalités de Fééti Play pourraient ne plus fonctionner correctement.</div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="6. Durée de conservation">
          <p>La durée de vie des cookies varie selon leur type :</p>
          <ul className="space-y-1 ml-4">
            {['Cookies de session : supprimés à la fermeture du navigateur', 'Cookies persistants : durée indiquée dans chaque catégorie ci-dessus', 'Consentement CookieYes : mémorisé pendant 12 mois'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-amber-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-center mt-8">
          <Cookie className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Vous Contrôlez Vos Cookies</h3>
          <p className="text-amber-100 mb-6 max-w-xl mx-auto text-sm">Gérez vos préférences à tout moment pour une expérience de streaming adaptée à vos choix.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-amber-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:privacy@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Nous Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

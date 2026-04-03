import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, Globe, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function PrivacyPolicy() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Politique de Confidentialité</h1>
              <p className="text-gray-400 text-sm mt-0.5">Version 1.0 | Entrée en vigueur : 08 mars 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Intro */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-8">
          <p className="text-gray-300 leading-relaxed">
            FeetiPlay accorde une importance primordiale à la protection de vos données personnelles. Cette politique explique
            quelles données nous collectons, comment nous les utilisons et vos droits. Pour toute question :{' '}
            <a href="mailto:privacy@feetiplay.com" className="text-purple-400 hover:underline">privacy@feetiplay.com</a>.
          </p>
        </div>

        <Section title={<><Database className="w-5 h-5 text-purple-400" /> 1. Données collectées</>}>
          <div>
            <h3 className="font-semibold text-white mb-2">1.1 Données que vous nous fournissez</h3>
            <ul className="space-y-1 ml-4">
              {['Nom, prénom et adresse e-mail (inscription)', 'Mot de passe (chiffré, jamais stocké en clair)', 'Photo de profil (optionnelle)', 'Informations de paiement (traitées par nos prestataires sécurisés)'].map(item => (
                <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">1.2 Données collectées automatiquement</h3>
            <ul className="space-y-1 ml-4">
              {['Adresse IP et type de navigateur', 'Pages consultées et durée de visionnage', 'Historique de streaming et préférences', 'Données de géolocalisation approximative'].map(item => (
                <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title={<><Eye className="w-5 h-5 text-purple-400" /> 2. Utilisation des données</>}>
          <p>Vos données sont utilisées pour :</p>
          <ul className="space-y-1 ml-4">
            {[
              'Gérer votre compte et vous authentifier',
              'Vous fournir un accès aux streams et contenus achetés',
              'Personnaliser vos recommandations de contenu',
              'Envoyer des confirmations de paiement et billets électroniques',
              'Améliorer nos services et l\'expérience utilisateur',
              'Prévenir la fraude et assurer la sécurité de la plateforme',
            ].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><Lock className="w-5 h-5 text-purple-400" /> 3. Sécurité des données</>}>
          <p>FeetiPlay met en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
          <ul className="space-y-1 ml-4">
            {['Chiffrement SSL/TLS pour toutes les transmissions', 'Mots de passe hachés avec bcrypt', 'Accès aux données limité au personnel autorisé', 'Audits de sécurité réguliers'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><Globe className="w-5 h-5 text-purple-400" /> 4. Partage des données</>}>
          <p>Nous ne vendons jamais vos données personnelles. Elles peuvent être partagées uniquement avec :</p>
          <ul className="space-y-1 ml-4">
            {[
              'Prestataires de paiement (Stripe, Paystack) pour traiter les transactions',
              'Organisateurs d\'événements (nom + email uniquement pour validation)',
              'Autorités légales sur réquisition judiciaire',
            ].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><UserCheck className="w-5 h-5 text-purple-400" /> 5. Vos droits</>}>
          <p>Conformément à la législation applicable, vous disposez des droits suivants :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {[
              ['Droit d\'accès', 'Consulter toutes les données que nous détenons sur vous'],
              ['Droit de rectification', 'Corriger des données inexactes ou incomplètes'],
              ['Droit à l\'effacement', 'Demander la suppression de votre compte et de vos données'],
              ['Droit à la portabilité', 'Recevoir vos données dans un format exportable'],
            ].map(([right, desc]) => (
              <div key={right} className="bg-white/5 rounded-lg p-3">
                <div className="font-semibold text-purple-400 text-sm">{right}</div>
                <div className="text-gray-400 text-sm mt-1">{desc}</div>
              </div>
            ))}
          </div>
          <p className="mt-3">Pour exercer vos droits : <a href="mailto:privacy@feetiplay.com" className="text-purple-400 hover:underline">privacy@feetiplay.com</a></p>
        </Section>

        <Section title="6. Conservation des données">
          <p>Vos données sont conservées aussi longtemps que votre compte est actif. Après suppression du compte :</p>
          <ul className="space-y-1 ml-4">
            {['Données de profil supprimées sous 30 jours', 'Données de transaction conservées 5 ans (obligation légale)', 'Historique de streaming supprimé immédiatement'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center mt-8">
          <Shield className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Vos Données, Notre Responsabilité</h3>
          <p className="text-purple-100 mb-6 max-w-xl mx-auto text-sm">Nous nous engageons à protéger votre vie privée avec les plus hauts standards de sécurité.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-purple-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:privacy@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Nous Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

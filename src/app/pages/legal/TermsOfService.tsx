import { ArrowLeft, FileText, UserCheck, Video, Scale, Ban, XCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function TermsOfService() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Conditions Générales d'Utilisation</h1>
              <p className="text-gray-400 text-sm mt-0.5">Version 1.0 | Entrée en vigueur : 08 mars 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Intro */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <p className="text-gray-300 leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles encadrant votre utilisation de la plateforme{' '}
            <strong className="text-blue-400">Fééti Play</strong>. En vous inscrivant ou en utilisant nos services, vous acceptez ces conditions.
            Pour toute question : <a href="mailto:support@feetiplay.com" className="text-blue-400 hover:underline">support@feetiplay.com</a>.
          </p>
        </div>

        <Section title={<><FileText className="w-5 h-5 text-blue-400" /> 1. Présentation de Fééti Play</>}>
          <p>Fééti Play est une plateforme numérique de streaming d'événements live dédiée au bassin du Congo et à l'Afrique. Elle vous permet de :</p>
          <ul className="space-y-1 ml-4">
            {['Regarder des événements en direct (concerts, sport, cinéma, conférences) depuis chez vous', 'Accéder à des replays et contenus exclusifs', 'Acheter des tickets numériques pour les événements payants', 'Suivre des chaînes de créateurs de contenu'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><UserCheck className="w-5 h-5 text-blue-400" /> 2. Inscription et compte utilisateur</>}>
          <div>
            <h3 className="font-semibold text-white mb-2">2.1 Création de compte</h3>
            <p>Pour accéder à la plupart de nos services, vous devez créer un compte en fournissant des informations exactes. Vous êtes responsable de la confidentialité de vos identifiants.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">2.2 Conditions d'inscription</h3>
            <ul className="space-y-1 ml-4">
              {['Être âgé d\'au moins 16 ans', 'Fournir une adresse e-mail valide', 'Ne pas usurper l\'identité d\'une autre personne', 'Ne pas créer plusieurs comptes pour contourner des restrictions'].map(item => (
                <li key={item} className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="3. Ce qui est interdit">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="font-medium text-red-400 mb-3">Les comportements suivants entraînent la suspension immédiate du compte :</p>
            <ul className="space-y-2">
              {['Partage non autorisé de liens de streaming payants', 'Enregistrement ou redistribution des streams', 'Revente non autorisée de tickets numériques', 'Utilisation de bots ou scripts automatisés', 'Toute tentative de fraude ou de contournement du paiement'].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title={<><Video className="w-5 h-5 text-blue-400" /> 4. Accès aux streams et tickets numériques</>}>
          <p>En achetant un ticket ou un accès à un stream sur Fééti Play :</p>
          <ul className="space-y-1 ml-4">
            {['Vous bénéficiez d\'un accès personnel et non transférable au contenu', 'Il est strictement interdit d\'enregistrer, copier ou redistribuer ce contenu', 'L\'accès peut être révoqué sans remboursement en cas de violation', 'Un QR code unique est généré par ticket — ne le partagez pas avant l\'événement'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><Scale className="w-5 h-5 text-blue-400" /> 5. Propriété intellectuelle</>}>
          <p>Tout le contenu de Fééti Play (logo, design, textes, code, vidéos) est la propriété exclusive de Fééti Play ou de ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite.</p>
        </Section>

        <Section title={<><XCircle className="w-5 h-5 text-red-400" /> 6. Suspension et résiliation</>}>
          <p className="font-medium text-white">Fééti Play peut suspendre ou résilier votre compte en cas de :</p>
          <ul className="space-y-1 ml-4">
            {['Violation de ces CGU', 'Comportement frauduleux avéré', 'Non-paiement de sommes dues', 'Inactivité prolongée (plus de 24 mois)'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
        </Section>

        <Section title={<><Scale className="w-5 h-5 text-blue-400" /> 7. Droit applicable</>}>
          <p>Les présentes CGU sont régies par le droit de la République du Congo et les Actes Uniformes de l'OHADA. En cas de litige, contactez-nous à <a href="mailto:support@feetiplay.com" className="text-blue-400 hover:underline">support@feetiplay.com</a>.</p>
        </Section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center mt-8">
          <FileText className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Conditions Claires et Équitables</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm">Ces conditions garantissent une expérience de streaming sûre et agréable pour tous.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:support@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Nous Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

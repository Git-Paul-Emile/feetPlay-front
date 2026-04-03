import { ArrowLeft, DollarSign, CheckCircle, XCircle, AlertTriangle, Clock, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function RefundPolicy() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Politique de Remboursement</h1>
              <p className="text-gray-400 text-sm mt-0.5">Version 1.0 | Entrée en vigueur : 08 mars 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Intro */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-8">
          <p className="text-gray-300 leading-relaxed">
            Nous comprenons que les imprévus arrivent. Cette politique définit les conditions dans lesquelles vous pouvez
            obtenir un remboursement pour vos achats sur <strong className="text-green-400">FeetiPlay</strong>, de manière équitable et transparente.
          </p>
        </div>

        <Section title={<><FileText className="w-5 h-5 text-green-400" /> 1. Principe général</>}>
          <p>Les tickets et accès achetés sur FeetiPlay sont en principe <strong className="text-white">non remboursables</strong> une fois la transaction finalisée, sauf dans les cas expressément prévus ci-dessous.</p>
        </Section>

        <Section title={<><CheckCircle className="w-5 h-5 text-green-400" /> 2. Cas donnant droit à un remboursement intégral</>}>
          <div>
            <h3 className="font-semibold text-white mb-2">2.1 Annulation de l'événement par l'organisateur</h3>
            <p>Si un événement est annulé définitivement, vous serez <strong className="text-white">automatiquement remboursé</strong> dans un délai de 7 à 14 jours ouvrables.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">2.2 Report ou modification majeure</h3>
            <p>Si l'événement est reporté à plus de 30 jours ou si des éléments essentiels changent, vous avez <strong className="text-white">72 heures</strong> à compter de la notification pour demander un remboursement.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">2.3 Problème technique imputable à FeetiPlay</h3>
            <p>Si une panne technique de notre plateforme vous empêche d'accéder à un live stream acheté, un remboursement ou un avoir vous sera proposé après vérification.</p>
          </div>
        </Section>

        <Section title="3. Remboursement à la demande de l'acheteur">
          <div>
            <h3 className="font-semibold text-white mb-2">3.1 Délai de rétractation</h3>
            <p>Vous disposez d'un délai de <strong className="text-white">24 heures</strong> après l'achat pour annuler votre commande, à condition que l'événement ait lieu dans plus de 7 jours.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">3.2 Cas non éligibles</h3>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <ul className="space-y-2">
                {[
                  'Ticket non utilisé par choix personnel',
                  'Erreur lors de l\'achat non signalée dans les 24h',
                  'Refus d\'entrée dû au non-respect des conditions de l\'événement',
                  'Accès impossible en raison d\'un problème de connexion côté utilisateur',
                  'QR code partagé et utilisé par une autre personne',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title={<><MessageSquare className="w-5 h-5 text-green-400" /> 4. Procédure de demande</>}>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Accédez à la rubrique "Mes Tickets" de votre compte FeetiPlay</li>
            <li>Sélectionnez le ticket concerné et cliquez sur "Demander un remboursement"</li>
            <li>Décrivez le motif de votre demande</li>
            <li>Notre équipe vous répond dans un délai de <strong className="text-white">3 jours ouvrables</strong></li>
          </ol>
          <p>Ou par email : <a href="mailto:remboursement@feetiplay.com" className="text-green-400 hover:underline">remboursement@feetiplay.com</a></p>
        </Section>

        <Section title={<><Clock className="w-5 h-5 text-green-400" /> 5. Modalités de remboursement</>}>
          <ul className="space-y-2 ml-4">
            {[
              'Le remboursement est effectué via le même moyen de paiement utilisé lors de l\'achat',
              'Mobile money : remboursement sous 3 à 7 jours ouvrables',
              'Carte bancaire : remboursement sous 5 à 10 jours ouvrables',
              'FeetiPlay peut proposer un avoir d\'une valeur équivalente comme alternative',
            ].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>{item}</span></li>
            ))}
          </ul>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-2">
            <p className="text-blue-300 text-sm">ℹ️ Les frais de service ne sont pas remboursables, sauf en cas d'annulation totale de l'événement par l'organisateur.</p>
          </div>
        </Section>

        <Section title={<><AlertTriangle className="w-5 h-5 text-amber-400" /> 6. Litiges</>}>
          <p>En cas de désaccord sur une décision de remboursement, vous pouvez escalader votre réclamation à : <a href="mailto:reclamations@feetiplay.com" className="text-green-400 hover:underline">reclamations@feetiplay.com</a></p>
        </Section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center mt-8">
          <CheckCircle className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Politique Équitable et Transparente</h3>
          <p className="text-green-100 mb-6 max-w-xl mx-auto text-sm">Notre objectif est de traiter chaque demande de remboursement de manière juste et rapide.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-green-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:remboursement@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Demander un Remboursement
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

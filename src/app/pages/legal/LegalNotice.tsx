import { ArrowLeft, Building2, Server, Copyright, Link as LinkIcon, AlertTriangle, Scale, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="bg-white/5 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(([label, value]) => (
        <div key={label}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
          <div className="text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}

export function LegalNotice() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Mentions Légales</h1>
              <p className="text-gray-400 text-sm mt-0.5">Version 1.0 | Entrée en vigueur : 08 mars 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Section title={<><Building2 className="w-5 h-5 text-gray-400" /> 1. Éditeur de la plateforme</>}>
          <p>La plateforme Fééti Play est éditée par :</p>
          <InfoGrid items={[
            ['Raison sociale', 'Fééti Play SAS'],
            ['Forme juridique', 'Société par Actions Simplifiée'],
            ['Capital social', '[Montant] FCFA'],
            ['Siège social', '[Adresse complète], [Ville], [Pays]'],
            ['N° RCCM', '[Numéro]'],
            ['N° Identification Fiscale (NIF)', '[Numéro]'],
            ['Directeur de la publication', '[Nom du Directeur Général]'],
          ]} />
          <p>Email : <a href="mailto:contact@feetiplay.com" className="text-blue-400 hover:underline">contact@feetiplay.com</a></p>
        </Section>

        <Section title={<><Server className="w-5 h-5 text-gray-400" /> 2. Hébergement</>}>
          <p>La plateforme Fééti Play est hébergée par :</p>
          <div className="bg-white/5 rounded-lg p-5 space-y-3">
            {[['Prestataire', '[Nom de l\'hébergeur]'], ['Adresse', '[Adresse de l\'hébergeur]'], ['Contact', '[contact hébergeur]']].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-white">{value}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={<><Copyright className="w-5 h-5 text-gray-400" /> 3. Propriété intellectuelle</>}>
          <p>L'ensemble des éléments composant la plateforme Fééti Play (marque, logo, chartes graphiques, textes, images, vidéos, flux de streaming, bases de données, logiciels) sont la propriété exclusive de Fééti Play SAS ou de ses partenaires, et sont protégés par les droits de la propriété intellectuelle applicables en zone OHADA.</p>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-2">
            <p className="font-medium text-red-400 mb-1">Avertissement</p>
            <p className="text-red-300 text-sm">Toute reproduction, représentation, modification, publication ou redistribution de ces éléments — y compris les flux vidéo — sans autorisation écrite préalable est illicite et constitue une contrefaçon susceptible de poursuites judiciaires.</p>
          </div>
        </Section>

        <Section title={<><LinkIcon className="w-5 h-5 text-gray-400" /> 4. Liens hypertextes</>}>
          <p>La plateforme Fééti Play peut contenir des liens vers des sites externes fournis à titre informatif. Fééti Play ne saurait être responsable du contenu ou des pratiques de ces sites tiers.</p>
          <p>Toute demande d'autorisation pour créer un lien pointant vers Fééti Play doit être adressée à : <a href="mailto:contact@feetiplay.com" className="text-blue-400 hover:underline">contact@feetiplay.com</a></p>
        </Section>

        <Section title={<><AlertTriangle className="w-5 h-5 text-amber-400" /> 5. Limitation de responsabilité</>}>
          <p>Fééti Play s'engage à faire ses meilleurs efforts pour assurer la disponibilité et la qualité du service de streaming. Cependant, Fééti Play décline toute responsabilité en cas de :</p>
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <ul className="space-y-2">
              {[
                'Interruption temporaire pour maintenance ou mise à jour',
                'Problème de qualité réseau indépendant de Fééti Play',
                'Annulation d\'événement décidée par l\'organisateur',
                'Événement de force majeure (coupure nationale, catastrophe naturelle)',
                'Utilisation frauduleuse par un tiers',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title={<><Scale className="w-5 h-5 text-gray-400" /> 6. Droit applicable</>}>
          <p>La plateforme Fééti Play et ses mentions légales sont régies par le droit de la République du Congo et les Actes Uniformes de l'OHADA. Tout litige relatif à l'utilisation de la plateforme sera soumis à la juridiction compétente du ressort du siège social de Fééti Play.</p>
        </Section>

        <Section title={<><Mail className="w-5 h-5 text-gray-400" /> 7. Contact</>}>
          <div className="bg-white/5 rounded-lg p-5 space-y-3">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</div>
              <a href="mailto:contact@feetiplay.com" className="text-blue-400 hover:underline">contact@feetiplay.com</a>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Adresse postale</div>
              <div className="text-white">[Adresse complète de Fééti Play]</div>
            </div>
          </div>
        </Section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl p-8 text-center mt-8 border border-white/10">
          <Building2 className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Informations Légales Complètes</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">Ces mentions légales garantissent la transparence et la conformité de Fééti Play avec la législation en vigueur.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate(-1)} className="bg-white text-slate-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">Retour</button>
            <a href="mailto:contact@feetiplay.com" className="border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Nous Contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router';

export function CGU() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#CDFF71] hover:text-[#b8e65a] transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-['Inter',sans-serif]">Retour à l'accueil</span>
        </Link>

        {/* Content */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 md:p-10 lg:p-12 border border-white/10">
          <h1 className="font-['Montserrat',sans-serif] font-bold text-white text-3xl md:text-4xl lg:text-5xl mb-4">
            CONDITIONS GÉNÉRALES D'UTILISATION
          </h1>

          <div className="text-[#999999] mb-8">
            <p className="font-['Inter',sans-serif] text-lg mb-2">Plateforme de streaming et de divertissement Feeti Play</p>
            <p className="font-['Inter',sans-serif] text-sm">Version 1.0 — En vigueur à compter du 3 avril 2025</p>
            <p className="font-['Inter',sans-serif] text-sm">Eroiste SARL — Brazzaville, République du Congo</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 font-['Inter',sans-serif] text-[#dfe1e4] text-base leading-relaxed">

              {/* PRÉAMBULE */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  PRÉAMBULE
                </h2>
                <p>
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme de streaming sportif
                  Feeti Play, exploitée par la société Eroiste SARL, société à responsabilité limitée de droit congolais, dont le siège social est
                  établi à Brazzaville, République du Congo, immatriculée au Registre du Commerce et du Crédit Mobilier (RCCM) de Brazzaville.
                  Feeti et Feeti Play sont des marques commerciales appartenant à Eroiste SARL.
                </p>
                <p className="mt-4">
                  En accédant à la Plateforme ou en vous inscrivant, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces
                  conditions, vous devez cesser immédiatement d'utiliser la Plateforme.
                </p>
              </section>

              {/* ARTICLE 1 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 1 — DÉFINITIONS
                </h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong className="text-white">« Plateforme »</strong> : le service de streaming sportif accessible via le site feeti.com et les applications mobiles Feeti Play (iOS et Android).</li>
                  <li><strong className="text-white">« Utilisateur »</strong> ou <strong className="text-white">« Abonné »</strong> : toute personne physique majeure ou personne morale qui accède à la Plateforme.</li>
                  <li><strong className="text-white">« Contenu »</strong> : l'ensemble des éléments audiovisuels diffusés sur la Plateforme (direct, replay, documentaires, magazines).</li>
                  <li><strong className="text-white">« Abonnement »</strong> : le contrat permettant l'accès aux Contenus en contrepartie d'un prix défini dans le Plan tarifaire choisi.</li>
                  <li><strong className="text-white">« Compte »</strong> : l'espace personnel de l'Utilisateur, protégé par identifiant et mot de passe.</li>
                  <li><strong className="text-white">« Données Personnelles »</strong> : toute information permettant d'identifier une personne physique, telle que définie par le RGPD.</li>
                  <li><strong className="text-white">« Plan tarifaire »</strong> : l'offre commerciale souscrite par l'Utilisateur telle que décrite sur la Plateforme.</li>
                </ul>
              </section>

              {/* ARTICLE 2 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 2 — OBJET ET CHAMP D'APPLICATION
                </h2>
                <p>
                  Les présentes CGU ont pour objet de définir les conditions d'accès à la Plateforme Feeti Play et les droits et obligations
                  respectifs des parties. Elles s'appliquent à tous les Utilisateurs, quelle que soit leur localisation.
                </p>
                <p className="mt-4">
                  Eroiste SARL se réserve le droit de modifier les CGU à tout moment, avec notification aux Utilisateurs quinze (15) jours avant
                  entrée en vigueur. La poursuite de l'utilisation vaut acceptation.
                </p>
              </section>

              {/* ARTICLE 3 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 3 — ACCÈS ET CRÉATION DE COMPTE
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.1 Conditions d'accès</h3>
                <p>
                  L'accès est réservé aux personnes physiques majeures (18 ans ou plus) ou aux personnes morales dûment représentées.
                  Les mineurs ne peuvent accéder qu'avec l'accord et sous la supervision d'un parent ou tuteur.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.2 Création de compte</h3>
                <p>Lors de la création du Compte, l'Utilisateur s'engage à :</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Fournir des informations exactes, complètes et à jour</li>
                  <li>Ne créer qu'un seul Compte par personne</li>
                  <li>Maintenir la confidentialité de ses identifiants</li>
                  <li>Notifier immédiatement Eroiste SARL de toute utilisation non autorisée</li>
                </ul>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.3 Matériel requis</h3>
                <p>
                  L'accès nécessite une connexion internet et un équipement compatible. Les frais de connexion sont à la charge de l'Utilisateur.
                </p>
              </section>

              {/* ARTICLE 4 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 4 — DESCRIPTION DES SERVICES
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">4.1 Offres de service</h3>
                <p>Feeti Play propose différentes formules :</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Accès gratuit avec contenus limités</li>
                  <li><strong className="text-white">Feeti Essentiel</strong> : accès aux retransmissions sportives de base</li>
                  <li><strong className="text-white">Feeti Premium</strong> : accès à l'intégralité des Contenus (football, basketball, boxe, compétitions locales et internationales)</li>
                </ul>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">4.2 Streaming en direct et replay</h3>
                <p>
                  Feeti Play permet la diffusion en direct (live) et en replay. La disponibilité des replays est limitée dans le temps selon les
                  droits de diffusion. Tout Contenu dont les droits expirent peut être retiré sans préavis.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">4.3 Qualité de diffusion</h3>
                <p>
                  La qualité dépend de la connexion internet et de l'équipement de l'Utilisateur. Eroiste SARL ne garantit pas une qualité
                  spécifique et décline toute responsabilité pour les interruptions liées aux réseaux.
                </p>
              </section>

              {/* ARTICLE 5 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 5 — CONDITIONS FINANCIÈRES ET ABONNEMENT
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">5.1 Prix et paiement</h3>
                <p>
                  Les tarifs sont exprimés en Franc CFA (XAF), toutes taxes comprises. Eroiste SARL peut modifier ses tarifs avec un préavis
                  de trente (30) jours pour les Abonnés existants. Les paiements sont effectués via Mobile Money, carte bancaire ou tout autre
                  moyen accepté sur la Plateforme.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">5.2 Renouvellement et résiliation</h3>
                <p>
                  Les Abonnements se renouvellent automatiquement sauf résiliation quarante-huit (48) heures avant la date de renouvellement.
                  La résiliation prend effet à l'expiration de la période en cours. Aucun remboursement partiel ne sera effectué, sauf disposition
                  légale contraire.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">5.3 Essai gratuit</h3>
                <p>
                  L'essai gratuit est limité à une (1) fois par Utilisateur. Eroiste SARL peut le modifier ou le supprimer à tout moment.
                </p>
              </section>

              {/* ARTICLE 6 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 6 — OBLIGATIONS DE L'UTILISATEUR
                </h2>
                <p>Il est notamment interdit de :</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Utiliser la Plateforme à des fins illicites ou frauduleuses</li>
                  <li>Reproduire, retransmettre ou distribuer les Contenus sans autorisation écrite</li>
                  <li>Partager ses identifiants ou permettre l'accès de tiers à son Compte</li>
                  <li>Contourner les mesures de protection technique des Contenus (DRM)</li>
                  <li>Utiliser des robots, scripts ou scrapers pour accéder à la Plateforme</li>
                  <li>Introduire des logiciels malveillants</li>
                  <li>Collecter les données personnelles d'autres Utilisateurs</li>
                  <li>Utiliser la Plateforme dans un cadre commercial sans accord préalable écrit</li>
                </ul>
              </section>

              {/* ARTICLE 7 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 7 — PROPRIÉTÉ INTELLECTUELLE
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">7.1 Droits d'Eroiste SARL</h3>
                <p>
                  La Plateforme et ses éléments (interface, design, logo, code, bases de données) sont protégés par les droits de propriété
                  intellectuelle, notamment la Convention de Bangui révisée (1999). Les marques FEETI et FEETI PLAY appartiennent à Eroiste SARL.
                  Toute reproduction non autorisée est interdite.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">7.2 Droits des diffuseurs</h3>
                <p>
                  Les Contenus sportifs sont protégés par les droits des organisateurs, fédérations sportives et titulaires de droits audiovisuels.
                  L'Utilisateur s'interdit toute exploitation non autorisée.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">7.3 Licence accordée à l'Utilisateur</h3>
                <p>
                  Eroiste SARL accorde une licence personnelle, non exclusive, non transférable et révocable, limitée à la visualisation des
                  Contenus dans un cadre strictement privé et non commercial.
                </p>
              </section>

              {/* Contact */}
              <section className="mt-12 pt-8 border-t border-white/20">
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl mb-4">
                  ARTICLE 14 — CONTACT
                </h2>
                <ul className="space-y-2">
                  <li><strong className="text-white">Email :</strong> legal@feeti.com</li>
                  <li><strong className="text-white">Courrier :</strong> Eroiste SARL — Service Juridique, Brazzaville, République du Congo</li>
                  <li><strong className="text-white">Formulaire de contact</strong> sur la Plateforme</li>
                </ul>
                <p className="mt-6 text-sm text-[#999999]">Dernière mise à jour : 3 avril 2025</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

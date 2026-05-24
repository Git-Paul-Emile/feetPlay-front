import { useEffect } from 'react';
import { Link } from 'react-router';

export function Privacy() {
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
            POLITIQUE DE CONFIDENTIALITÉ
          </h1>

          <div className="text-[#999999] mb-8">
            <p className="font-['Inter',sans-serif] text-lg mb-2">Protection des Données Personnelles — Feeti Play</p>
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
                  Eroiste SARL, société à responsabilité limitée de droit congolais dont le siège social est établi à Brazzaville, République du Congo,
                  exploitant la plateforme de streaming et de divertissement Feeti Play sous la marque commerciale Feeti, s'engage à protéger la vie privée de ses
                  Utilisateurs.
                </p>
                <p className="mt-4">
                  La présente Politique de Confidentialité décrit les données collectées, les finalités et bases légales de traitement, les destinataires,
                  les durées de conservation et les droits des Utilisateurs. Elle est rédigée conformément au RGPD (Règlement UE 2016/679) et aux principes
                  généraux internationaux de protection des données.
                </p>
              </section>

              {/* ARTICLE 1 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 1 — IDENTITÉ DU RESPONSABLE DU TRAITEMENT
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-white/20 rounded-lg">
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3 font-semibold text-white">Dénomination</td>
                        <td className="px-4 py-3">Eroiste SARL</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3 font-semibold text-white">Siège social</td>
                        <td className="px-4 py-3">Brazzaville, République du Congo</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3 font-semibold text-white">Email de contact</td>
                        <td className="px-4 py-3">privacy@feeti.com</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Délégué à la Protection des Données (DPO)</td>
                        <td className="px-4 py-3">dpo@feeti.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ARTICLE 2 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 2 — DONNÉES PERSONNELLES COLLECTÉES
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">2.1 Lors de la création du compte</h3>
                <p>Nom et prénom, adresse email, date de naissance, mot de passe (chiffré), pays de résidence.</p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">2.2 Lors de l'utilisation de la Plateforme</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Historique de navigation et de visionnage</li>
                  <li>Préférences sportives et favoris</li>
                  <li>Données de connexion (adresse IP, type d'appareil, système d'exploitation, navigateur)</li>
                  <li>Localisation approximative (pays, ville, déduites de l'IP)</li>
                  <li>Données de session et durée d'utilisation</li>
                </ul>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">2.3 Lors des paiements</h3>
                <p>
                  Informations de transaction (montant, date, référence). Les données bancaires et Mobile Money sont traitées directement par nos
                  prestataires certifiés et ne sont pas stockées par Eroiste SARL.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">2.4 Via le service client</h3>
                <p>Contenu des messages, données de satisfaction (notes, avis).</p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">2.5 Via les cookies</h3>
                <p>Voir notre Politique de Cookies pour le détail.</p>
              </section>

              {/* ARTICLE 3 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 3 — FINALITÉS ET BASES LÉGALES
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">3.1 Exécution du contrat (Art. 6(1)(b) RGPD)</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Création et gestion du Compte</li>
                  <li>Fourniture des services de streaming</li>
                  <li>Traitement des paiements et gestion de l'Abonnement</li>
                  <li>Communications relatives à l'Abonnement</li>
                </ul>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.2 Intérêt légitime d'Eroiste SARL (Art. 6(1)(f) RGPD)</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Personnalisation des recommandations</li>
                  <li>Analyse statistique d'utilisation</li>
                  <li>Prévention de la fraude et sécurisation</li>
                  <li>Gestion des litiges</li>
                </ul>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.3 Consentement (Art. 6(1)(a) RGPD)</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Envoi de communications marketing</li>
                  <li>Dépôt de cookies non essentiels</li>
                  <li>Partage de données avec des partenaires publicitaires</li>
                </ul>
                <p className="mt-3 italic text-sm text-[#CDFF71]">
                  Vous pouvez retirer votre consentement à tout moment sans affecter les traitements antérieurs.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">3.4 Obligation légale (Art. 6(1)(c) RGPD)</h3>
                <p>Obligations fiscales et comptables ; réponse aux injonctions judiciaires.</p>
              </section>

              {/* ARTICLE 4 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 4 — DESTINATAIRES DES DONNÉES
                </h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Équipes internes d'Eroiste SARL habilitées (technique, commercial, service client, juridique)</li>
                  <li>Prestataires techniques (hébergement, CDN, infrastructure cloud) soumis à confidentialité</li>
                  <li>Prestataires de paiement pour le traitement des transactions</li>
                  <li>Partenaires d'analyse d'audience (sous réserve de consentement)</li>
                  <li>Autorités judiciaires, administratives ou régulatrices sur réquisition légale</li>
                </ul>
                <p className="mt-4 p-4 bg-[#DE0035]/10 border-l-4 border-[#DE0035] rounded">
                  <strong className="text-[#DE0035]">Eroiste SARL ne vend pas vos données personnelles à des tiers.</strong>
                </p>
              </section>

              {/* ARTICLE 6 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 6 — DURÉES DE CONSERVATION
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-white/20 rounded-lg">
                    <thead>
                      <tr className="border-b border-white/20 bg-white/5">
                        <th className="px-4 py-3 text-left font-semibold text-white">Catégorie de données</th>
                        <th className="px-4 py-3 text-left font-semibold text-white">Durée de conservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3">Données de Compte</td>
                        <td className="px-4 py-3">Durée de l'abonnement actif + 3 ans après clôture</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3">Données de transaction et paiement</td>
                        <td className="px-4 py-3">10 ans (obligations comptables)</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3">Historique de navigation/visionnage</td>
                        <td className="px-4 py-3">13 mois maximum</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3">Données de connexion (logs)</td>
                        <td className="px-4 py-3">12 mois</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3">Communications service client</td>
                        <td className="px-4 py-3">5 ans</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Cookies</td>
                        <td className="px-4 py-3">Voir Politique de Cookies</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ARTICLE 7 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 7 — VOS DROITS
                </h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.1 Droit d'accès (Art. 15 RGPD)</h4>
                    <p>Obtenir confirmation que des données vous concernant sont traitées et en recevoir une copie.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.2 Droit de rectification (Art. 16 RGPD)</h4>
                    <p>Corriger vos données inexactes ou incomplètes.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.3 Droit à l'effacement (Art. 17 RGPD)</h4>
                    <p>Obtenir la suppression dans les cas prévus par le RGPD, sauf obligation légale de conservation.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.4 Droit à la limitation (Art. 18 RGPD)</h4>
                    <p>Suspendre temporairement le traitement de vos données dans certaines circonstances.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.5 Droit à la portabilité (Art. 20 RGPD)</h4>
                    <p>Recevoir vos données dans un format structuré, lisible par machine.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">7.6 Droit d'opposition (Art. 21 RGPD)</h4>
                    <p>S'opposer au traitement fondé sur l'intérêt légitime, notamment à des fins de prospection.</p>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-2">7.7 Exercice de vos droits</h4>
                    <p>Adressez votre demande (avec copie de pièce d'identité) à :</p>
                    <ul className="space-y-1 mt-2">
                      <li><strong className="text-white">Email :</strong> privacy@feeti.com</li>
                      <li><strong className="text-white">Courrier :</strong> Eroiste SARL — DPO, Brazzaville, République du Congo</li>
                    </ul>
                    <p className="mt-2 text-sm">Réponse sous 30 jours, prolongeable de 2 mois pour les demandes complexes.</p>
                  </div>
                </div>
              </section>

              {/* ARTICLE 8 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 8 — SÉCURITÉ DES DONNÉES
                </h2>
                <p>Eroiste SARL met en œuvre des mesures techniques et organisationnelles appropriées :</p>
                <ul className="space-y-2 list-disc list-inside mt-3">
                  <li>Chiffrement des données en transit (TLS/SSL) et au repos</li>
                  <li>Authentification sécurisée et gestion des accès</li>
                  <li>Surveillance et journalisation des accès</li>
                  <li>Formation des équipes aux bonnes pratiques</li>
                  <li>Procédure de gestion des incidents de sécurité</li>
                </ul>
                <p className="mt-4">
                  En cas de violation susceptible d'engendrer un risque élevé, Eroiste SARL vous en informera sans délai.
                </p>
              </section>

              {/* Contact */}
              <section className="mt-12 pt-8 border-t border-white/20">
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl mb-4">
                  ARTICLE 12 — CONTACT
                </h2>
                <ul className="space-y-2">
                  <li><strong className="text-white">Email :</strong> dpo@feeti.com</li>
                  <li><strong className="text-white">Courrier :</strong> Eroiste SARL — DPO, Brazzaville, République du Congo</li>
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

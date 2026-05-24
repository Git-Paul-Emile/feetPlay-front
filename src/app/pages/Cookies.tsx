import { useEffect } from 'react';
import { Link } from 'react-router';

export function Cookies() {
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
            POLITIQUE DE COOKIES
          </h1>

          <div className="text-[#999999] mb-6">
            <p className="font-['Inter',sans-serif] text-lg mb-2">Gestion des cookies et technologies de traçage — Feeti Play</p>
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
                  La présente Politique de Cookies décrit l'utilisation des cookies et technologies similaires (pixels, web beacons, local storage) sur la
                  plateforme Feeti Play, exploitée par Eroiste SARL, société à responsabilité limitée dont le siège social est à Brazzaville, République du Congo.
                </p>
                <p className="mt-4">
                  Elle est rédigée conformément au RGPD (Règlement UE 2016/679), à la Directive ePrivacy (2002/58/CE) et aux lignes directrices des autorités
                  de protection des données.
                </p>
              </section>

              {/* ARTICLE 1 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 1 — QU'EST-CE QU'UN COOKIE ?
                </h2>
                <p>
                  Un cookie est un petit fichier texte déposé sur votre terminal lors de votre visite sur un site internet ou lors de l'utilisation d'une
                  application mobile. Il permet de reconnaître votre appareil lors de vos visites ultérieures et de stocker des informations relatives à votre
                  navigation.
                </p>
                <p className="mt-4">Feeti Play peut également utiliser :</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li><strong className="text-white">Les pixels traceurs :</strong> images invisibles mesurant l'ouverture d'emails ou de pages</li>
                  <li><strong className="text-white">Le stockage local :</strong> (localStorage/sessionStorage) pour conserver des préférences dans votre navigateur</li>
                  <li><strong className="text-white">Les identifiants publicitaires mobiles :</strong> (IDFA sur iOS, GAID sur Android)</li>
                </ul>
              </section>

              {/* ARTICLE 2 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 2 — CATÉGORIES DE COOKIES UTILISÉS
                </h2>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">2.1 Cookies strictement nécessaires</h3>
                <p>Indispensables au fonctionnement technique de la Plateforme. <strong className="text-[#DE0035]">Ne peuvent pas être désactivés.</strong></p>
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full border border-white/20 rounded-lg">
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3 font-semibold text-white">Finalités</td>
                        <td className="px-4 py-3">Authentification et session, préférences de langue, sécurité des formulaires (CSRF)</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="px-4 py-3 font-semibold text-white">Base légale</td>
                        <td className="px-4 py-3">Intérêt légitime — aucun consentement requis</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Durée</td>
                        <td className="px-4 py-3">Durée de la session ou jusqu'à 12 mois</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-6">2.2 Cookies de performance et d'analyse</h3>
                <p>Permettent de mesurer l'audience et d'analyser les comportements pour améliorer la Plateforme.</p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-6">2.3 Cookies de personnalisation</h3>
                <p>Permettent de personnaliser votre expérience selon vos préférences et votre historique.</p>
              </section>

              {/* ARTICLE 4 */}
              <section>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl md:text-3xl mb-4">
                  ARTICLE 4 — VOTRE CONSENTEMENT ET VOS CHOIX
                </h2>
                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3">4.1 Recueil du consentement</h3>
                <p>
                  Lors de votre première visite, un bandeau vous informe de l'utilisation des cookies. Votre consentement doit être libre, éclairé,
                  spécifique et non ambigu (clic positif). Le refus des cookies non essentiels ne réduit pas l'accès aux fonctionnalités principales.
                </p>

                <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl mb-3 mt-4">4.2 Gestion de vos préférences</h3>
                <p>Vous pouvez modifier vos préférences via :</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Le panneau "Gérer mes cookies" en pied de page</li>
                  <li>Les paramètres de votre navigateur</li>
                  <li>Les paramètres de l'application mobile Feeti Play</li>
                </ul>
              </section>

              {/* Contact */}
              <section className="mt-12 pt-8 border-t border-white/20">
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-white text-2xl mb-4">
                  CONTACT
                </h2>
                <ul className="space-y-2">
                  <li><strong className="text-white">Email :</strong> privacy@feeti.com</li>
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

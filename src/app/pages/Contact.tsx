import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { BookOpen, Mail, Users, MessageCircle, MapPin, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { fetchWithApiFallback, getPreferredFeeti2BaseUrl } from '../utils/serviceConfig';

type Reason = 'ticketing' | 'partnership' | 'advertising' | 'press' | 'support' | 'other';

const VERTICALS = [
  'Concerts & festivals',
  'Créateur de contenu',
  'Média / chaîne TV',
  'Conférences & salons',
  'Sport',
  'Culture & arts',
  'Événements religieux',
  'Autre',
];

const COUNTRIES = ['Congo', 'RD Congo', 'Gabon', 'Cameroun', "Côte d'Ivoire", 'Sénégal', 'France', 'Autre'];

const REASONS: { value: Reason; label: string }[] = [
  { value: 'ticketing', label: 'Diffuser un événement en live' },
  { value: 'partnership', label: 'Devenir partenaire' },
  { value: 'advertising', label: 'Annonceur / publicité' },
  { value: 'press', label: 'Presse & médias' },
  { value: 'support', label: "Besoin d'aide" },
  { value: 'other', label: 'Autre' },
];

const FAQ = [
  {
    q: 'Comment regarder un live payant ?',
    a: "Ouvrez la page de l'événement, achetez votre accès, puis cliquez sur « Regarder ». Votre billet reste disponible dans « Mes billets ».",
  },
  {
    q: 'La vidéo coupe ou ne démarre pas, que faire ?',
    a: "Vérifiez votre connexion, rechargez la page et fermez les autres onglets vidéo. Si le problème continue pendant un live, écrivez-nous sur WhatsApp.",
  },
  {
    q: 'Un replay est-il disponible après le live ?',
    a: "Oui lorsque l'organisateur ou le créateur l'a activé : le replay apparaît alors dans la rubrique « Replay ».",
  },
  {
    q: 'Comment devenir créateur sur Fééti Play ?',
    a: "Créez votre compte créateur, choisissez le nom de votre chaîne et récupérez votre clé de stream pour diffuser depuis OBS ou Streamlabs.",
  },
  {
    q: 'Comment gérer mes abonnements aux créateurs ?',
    a: "Rendez-vous dans « Mes abonnements » depuis votre profil pour consulter ou résilier vos abonnements.",
  },
];

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', company: '', vertical: '', country: '',
  ticketsPerYear: '', averagePrice: '', reason: '' as Reason | '', message: '', website: '',
};

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-[#111111] px-3.5 py-2.5 font-['Inter',sans-serif] text-[15px] text-white placeholder:text-white/40 focus:border-[#CDFF71] focus:outline-none focus:ring-2 focus:ring-[#CDFF71]/20";

export function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const feetiUrl = getPreferredFeeti2BaseUrl();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const response = await fetchWithApiFallback('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Impossible d'envoyer votre demande");
      }
      setSent(true);
      setForm(EMPTY);
    } catch (err: any) {
      setError(err?.message || "Impossible d'envoyer votre demande, réessayez.");
    } finally {
      setSending(false);
    }
  };

  const selectClass = (value: string) => `${fieldClass} appearance-none ${value ? '' : 'text-white/40'}`;

  return (
    <div className="min-h-screen bg-[#080808] pb-20">
      {/* Bandeau */}
      <section className="relative overflow-hidden pb-40 pt-32 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-[75%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#CDFF71]/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full bg-[#CDFF71] px-3 py-1 font-['Inter',sans-serif] text-xs font-semibold text-black">Support</span>
          <h1 className="mt-5 font-['Montserrat',sans-serif] text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Comment pouvons-nous <span className="text-[#CDFF71]">vous aider ?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-['Inter',sans-serif] text-lg text-white/70">
            Un souci de lecture, un live à diffuser ou un partenariat à proposer ? L'équipe Fééti Play vous répond.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-28 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-10">
          {/* Cartes d'orientation */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-[#1a1a1a] p-6">
              <BookOpen className="h-6 w-6 text-[#CDFF71]" />
              <h2 className="mt-4 font-['Montserrat',sans-serif] text-lg font-semibold text-white">Centre d'aide</h2>
              <p className="mt-2 font-['Inter',sans-serif] text-sm leading-relaxed text-white/60">
                Compte, abonnements, paiements, lecture vidéo : toutes les réponses aux questions fréquentes.
              </p>
              <Link to="/help" className="mt-4 inline-block font-['Inter',sans-serif] text-sm font-semibold text-white underline underline-offset-4 hover:text-[#CDFF71]">
                Voir l'aide
              </Link>
            </div>
            <div className="rounded-2xl bg-[#1a1a1a] p-6">
              <Mail className="h-6 w-6 text-[#CDFF71]" />
              <h2 className="mt-4 font-['Montserrat',sans-serif] text-lg font-semibold text-white">Nous écrire</h2>
              <p className="mt-2 font-['Inter',sans-serif] text-sm leading-relaxed text-white/60">
                Organisateur, créateur ou annonceur : décrivez votre projet, nous revenons vers vous rapidement.
              </p>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 font-['Inter',sans-serif] text-sm font-semibold text-white underline underline-offset-4 hover:text-[#CDFF71]"
              >
                Remplir le formulaire
              </button>
            </div>
            <div className="rounded-2xl bg-[#CDFF71] p-6 text-black">
              <Users className="h-6 w-6" />
              <h2 className="mt-4 font-['Montserrat',sans-serif] text-lg font-semibold">Communauté Fééti</h2>
              <p className="mt-2 font-['Inter',sans-serif] text-sm leading-relaxed text-black/70">
                Actualités, coulisses des lives et bons plans partagés par la communauté des Feeteurs.
              </p>
              <a href={`${feetiUrl}/blog`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-['Inter',sans-serif] text-sm font-semibold underline underline-offset-4">
                Rejoindre la communauté
              </a>
            </div>
          </div>

          {/* Contacts directs */}
          <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <a href="mailto:support@feeti.com" className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5">
              <Mail className="h-5 w-5 shrink-0 text-white/40" />
              <span className="font-['Inter',sans-serif] text-sm"><span className="block font-medium text-white">Support</span><span className="text-white/60">support@feeti.com</span></span>
            </a>
            <a href="https://wa.me/242981231925" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5">
              <MessageCircle className="h-5 w-5 shrink-0 text-white/40" />
              <span className="font-['Inter',sans-serif] text-sm"><span className="block font-medium text-white">WhatsApp (lives)</span><span className="text-white/60">+242 981-23-19-25</span></span>
            </a>
            <div className="flex items-center gap-3 rounded-xl p-3">
              <MapPin className="h-5 w-5 shrink-0 text-white/40" />
              <span className="font-['Inter',sans-serif] text-sm"><span className="block font-medium text-white">Siège</span><span className="text-white/60">Plateau, Brazzaville — Congo</span></span>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="font-['Montserrat',sans-serif] text-3xl font-bold text-white">Questions fréquentes</h2>
              <p className="mt-3 font-['Inter',sans-serif] text-white/60">
                Les réponses aux demandes les plus courantes.{' '}
                <Link to="/help" className="font-medium text-white underline underline-offset-4">Toute l'aide</Link>.
              </p>
            </div>
            <div className="space-y-2">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl bg-[#1a1a1a]">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-['Inter',sans-serif] text-[15px] font-medium text-white"
                    aria-expanded={openFaq === i}
                  >
                    {item.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#CDFF71] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <p className="px-4 pb-4 font-['Inter',sans-serif] text-sm leading-relaxed text-white/60">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <section id="contact-form" className="mt-10 scroll-mt-24 lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div className="py-6 lg:py-16">
            <p className="font-['Inter',sans-serif] text-sm font-semibold text-white">Vous diffusez des événements à grande échelle ?</p>
            <h2 className="mt-2 font-['Montserrat',sans-serif] text-4xl font-bold text-white">Parlons de votre projet</h2>
            <p className="mt-4 font-['Inter',sans-serif] text-white/70">
              Lives payants à fort volume, programmes multi-événements ou partenariat média : notre <strong className="text-white">équipe commerciale</strong> vous propose une offre et un accompagnement sur mesure.
            </p>
            <p className="mt-6 font-['Inter',sans-serif] text-sm italic text-white/50">
              Une question sur un accès ou votre compte ? Consultez le{' '}
              <Link to="/help" className="font-semibold not-italic text-white underline underline-offset-4">centre d'aide</Link>.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-[#CDFF71]" />
                <h3 className="mt-4 font-['Montserrat',sans-serif] text-xl font-semibold text-white">Merci, votre demande est envoyée</h3>
                <p className="mt-2 max-w-sm font-['Inter',sans-serif] text-sm text-white/60">Notre équipe vous recontacte par email ou par téléphone dans les meilleurs délais.</p>
                <button onClick={() => setSent(false)} className="mt-6 font-['Inter',sans-serif] text-sm font-semibold text-white underline underline-offset-4">
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Prénom*" value={form.firstName} onChange={set('firstName')} className={fieldClass} autoComplete="given-name" />
                  <input required placeholder="Nom*" value={form.lastName} onChange={set('lastName')} className={fieldClass} autoComplete="family-name" />
                  <input required type="email" placeholder="Email professionnel*" value={form.email} onChange={set('email')} className={fieldClass} autoComplete="email" />
                  <input required type="tel" placeholder="Téléphone*" value={form.phone} onChange={set('phone')} className={fieldClass} autoComplete="tel" />
                </div>
                <input required placeholder="Nom de la société ou de la chaîne*" value={form.company} onChange={set('company')} className={fieldClass} autoComplete="organization" />
                <select required value={form.vertical} onChange={set('vertical')} className={selectClass(form.vertical)}>
                  <option value="" disabled>Secteur d'activité*</option>
                  {VERTICALS.map((v) => <option key={v} value={v} className="text-white">{v}</option>)}
                </select>
                <select required value={form.country} onChange={set('country')} className={selectClass(form.country)}>
                  <option value="" disabled>Pays*</option>
                  {COUNTRIES.map((c) => <option key={c} value={c} className="text-white">{c}</option>)}
                </select>
                <input inputMode="numeric" placeholder="Combien d'accès payants prévoyez-vous de vendre sur un an ? (ex. 2 000)" value={form.ticketsPerYear} onChange={set('ticketsPerYear')} className={fieldClass} />
                <input placeholder="Prix moyen d'un accès à vos lives ? (ex. 5 000 FCFA)" value={form.averagePrice} onChange={set('averagePrice')} className={fieldClass} />
                <select required value={form.reason} onChange={set('reason')} className={selectClass(form.reason)}>
                  <option value="" disabled>Motif de votre demande*</option>
                  {REASONS.map((r) => <option key={r.value} value={r.value} className="text-white">{r.label}</option>)}
                </select>
                <textarea rows={3} placeholder="Votre message (facultatif)" value={form.message} onChange={set('message')} className={fieldClass} />
                {/* Champ piège anti-robot, invisible pour les humains */}
                <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} className="hidden" />
                {error && <p className="font-['Inter',sans-serif] text-sm text-red-400">{error}</p>}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-full bg-[#CDFF71] px-6 py-2.5 font-['Inter',sans-serif] text-sm font-semibold text-black transition-colors hover:bg-[#b8e65a] disabled:opacity-60"
                  >
                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Contacter l'équipe
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;

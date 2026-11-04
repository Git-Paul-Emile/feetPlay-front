import { Fragment, useEffect } from 'react';
import { Link } from 'react-router';
import {
  LEGAL_DOCUMENTS, LEGAL_ORDER, LEGAL_VERSION, LEGAL_EFFECTIVE_DATE,
  type LegalBlock, type LegalSlug,
} from '../../data/legalPack';

// Rend les adresses e-mail cliquables dans le texte juridique
function withMailLinks(text: string) {
  const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.]+)/g);
  return parts.map((part, i) =>
    /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)
      ? <a key={i} href={`mailto:${part}`} className="text-[#CDFF71] underline underline-offset-4">{part}</a>
      : <Fragment key={i}>{part}</Fragment>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-10 mb-3 font-['Montserrat',sans-serif] text-xl font-bold text-white first:mt-0">{block.text}</h2>;
    case 'h3':
      return <h3 className="mt-6 mb-2 font-['Montserrat',sans-serif] text-base font-semibold text-white">{block.text}</h3>;
    case 'p':
      return <p className="mb-3 text-white/70">{withMailLinks(block.text)}</p>;
    case 'note':
      return <p className="my-4 rounded-r-lg border-l-4 border-[#CDFF71] bg-[#CDFF71]/10 px-4 py-3 text-[15px] text-white/80">{withMailLinks(block.text)}</p>;
    case 'list':
      return (
        <ul className="mb-4 list-disc space-y-1.5 pl-6 text-white/70 marker:text-[#CDFF71]">
          {block.items.map((item, i) => <li key={i}>{withMailLinks(item)}</li>)}
        </ul>
      );
  }
}

export function LegalDocumentPage({ slug }: { slug: LegalSlug }) {
  const doc = LEGAL_DOCUMENTS[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${doc.title} — Fééti Play`;
  }, [slug, doc.title]);

  return (
    <div className="min-h-screen bg-[#080808] pb-20 pt-24">
      <header className="mx-auto max-w-4xl px-4 py-10 text-center">
        <span className="inline-block rounded-full bg-[#CDFF71] px-3 py-1 font-['Inter',sans-serif] text-xs font-semibold text-black">
          Pack juridique &amp; conformité
        </span>
        <h1 className="mt-5 font-['Montserrat',sans-serif] text-3xl font-bold text-white md:text-5xl">{doc.title}</h1>
        <p className="mt-3 font-['Inter',sans-serif] text-white/60">
          {LEGAL_VERSION} · Entrée en vigueur : {LEGAL_EFFECTIVE_DATE}
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <nav aria-label="Documents légaux" className="flex flex-col gap-0.5 self-start rounded-2xl border border-white/10 bg-[#121212] p-4 lg:sticky lg:top-24">
          <p className="mx-2 mb-2 mt-1 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-wider text-white/40">Documents</p>
          {LEGAL_ORDER.map((s) => {
            const active = s === slug;
            return (
              <Link
                key={s}
                to={`/legal/${s}`}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-['Inter',sans-serif] text-sm transition-colors ${active ? 'bg-[#CDFF71] text-black' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                <span className={`inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md text-xs font-bold ${active ? 'bg-black/15' : 'bg-white/10 text-white/50'}`}>
                  {LEGAL_DOCUMENTS[s].letter}
                </span>
                {LEGAL_DOCUMENTS[s].shortTitle}
              </Link>
            );
          })}
          <Link to="/contact" className="mt-2 border-t border-white/10 px-2.5 pt-3 font-['Inter',sans-serif] text-sm font-semibold text-[#CDFF71]">
            Une question ? Nous contacter
          </Link>
        </nav>

        <article className="rounded-2xl border border-white/10 bg-[#121212] p-6 font-['Inter',sans-serif] text-base leading-relaxed sm:p-10">
          {doc.intro && (
            <p className="mb-8 border-b border-white/10 pb-6 text-lg text-white/90">{withMailLinks(doc.intro)}</p>
          )}
          {doc.blocks.map((block, i) => <Block key={i} block={block} />)}
        </article>
      </div>
    </div>
  );
}

export default LegalDocumentPage;

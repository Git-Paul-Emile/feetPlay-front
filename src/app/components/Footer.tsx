import { Link } from 'react-router';
import { getPreferredFeeti2BaseUrl } from '../utils/serviceConfig';

type FooterLink = { label: string; href: string; external?: boolean };

export function Footer() {
  const currentYear = new Date().getFullYear();
  const feetiUrl = getPreferredFeeti2BaseUrl();

  const footerLinks: FooterLink[] = [
    { label: 'For Business', href: '/contact' },
    { label: 'Brand & Presse', href: '/press' },
    { label: 'Fééti Access', href: `${feetiUrl}/organizer`, external: true },
    { label: 'Communauté', href: `${feetiUrl}/blog`, external: true },
    { label: 'Nous contacter', href: '/contact' },
    { label: "Besoin d'aide ?", href: '/help' },
    { label: 'CGU', href: '/cgu' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'Mentions légales', href: '/legal/notice' },
    { label: 'Remboursement', href: '/legal/refund' },
  ];

  const linkClass = "font-['Inter',sans-serif] text-[#999999] text-sm hover:text-white transition-colors";

  return (
    <footer className="bg-[#1a1a1a] border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {footerLinks.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          )}
        </div>
        <div className="mt-6 text-center">
          <p className="font-['Inter',sans-serif] text-[#666666] text-xs">
            © {currentYear} Fééti.io, propulsé par Eroiste, Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

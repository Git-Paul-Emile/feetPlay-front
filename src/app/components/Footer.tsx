import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { getPreferredFeeti2BaseUrl } from '../utils/serviceConfig';

type FooterLink = { label: string; href: string; external?: boolean };

const socialLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Facebook', href: 'https://facebook.com/feeti', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com/feeti', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com/feeti', icon: Twitter },
  { label: 'YouTube', href: 'https://youtube.com/feeti', icon: Youtube },
];

function SocialLink({ label, href, icon: Icon }: (typeof socialLinks)[number]) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Suivre Feeti sur ${label}`}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-all hover:scale-110 hover:border-[#16bda0]/50 hover:bg-[#16bda0] hover:text-white"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}

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
        <nav aria-label="Réseaux sociaux" className="mt-6 flex justify-center gap-3">
          {socialLinks.map((social) => (
            <SocialLink key={social.label} {...social} />
          ))}
        </nav>
        <div className="mt-6 text-center">
          <p className="font-['Inter',sans-serif] text-[#666666] text-xs">
            © {currentYear} Fééti.io, propulsé par Eroiste, Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'CGU', href: '/cgu' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'Conditions générales', href: '/terms' },
    { label: "Besoin d'aide ?", href: '/help' },
    { label: 'Press', href: '/press' },
  ];

  return (
    <footer className="bg-[#1a1a1a] border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="font-['Inter',sans-serif] text-[#999999] text-sm hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
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

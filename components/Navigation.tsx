'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

const links = [
  { href: '/', label: 'Home' },
  { href: '/path', label: 'Percorso' },
  { href: '/learn', label: 'Teoria' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/scenarios', label: 'Scenari' },
  { href: '/calculator', label: 'Calcolatore' },
  { href: '/preflop', label: 'Preflop' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold shrink-0">
            ♠️ Poker Trainer
          </Link>

          <div className="hidden lg:flex gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-2 rounded-lg transition-colors text-sm
                  ${pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <MobileNav />
        </div>
      </div>
    </nav>
  );
}

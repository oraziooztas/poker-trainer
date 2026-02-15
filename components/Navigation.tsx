'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

const links = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Impara', icon: '📚' },
  { href: '/calculator', label: 'Calcolatore', icon: '🔢' },
  { href: '/quiz', label: 'Quiz', icon: '❓' },
  { href: '/preflop', label: 'Preflop', icon: '📋' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            ♠️ Poker Math Trainer
          </Link>

          <div className="hidden md:flex gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'}
                `}
              >
                <span className="mr-2">{link.icon}</span>
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  {
    title: 'STUDIA',
    links: [
      { href: '/path', label: 'Percorso', icon: '🗺️' },
      { href: '/learn', label: 'Teoria', icon: '📚' },
    ],
  },
  {
    title: 'PRATICA',
    links: [
      { href: '/quiz', label: 'Quiz', icon: '❓' },
      { href: '/scenarios', label: 'Scenari', icon: '🎯' },
      { href: '/calculator', label: 'Calcolatore', icon: '🔢' },
      { href: '/preflop', label: 'Chart Preflop', icon: '📋' },
    ],
  },
  {
    title: 'TRACCIA',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    ],
  },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-white"
        aria-label="Apri menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 bg-gray-900 z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4">
          <span className="text-white font-bold">♠️ Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white p-2"
            aria-label="Chiudi menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Home Link */}
        <div className="px-4 mb-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`
              block px-4 py-3 rounded-lg transition-colors
              ${pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'}
            `}
          >
            <span className="mr-3">🏠</span>
            Home
          </Link>
        </div>

        {/* Sectioned Links */}
        <nav className="px-4 space-y-4">
          {sections.map(section => (
            <div key={section.title}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-1">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg transition-colors
                      ${pathname === link.href
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'}
                    `}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

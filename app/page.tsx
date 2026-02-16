import Link from 'next/link';

const features = [
  {
    title: 'Percorso Guidato',
    description: 'Impara passo dopo passo, dalle basi alla strategia avanzata',
    href: '/path',
    icon: '🗺️',
    color: 'bg-blue-500',
  },
  {
    title: 'Scenari Interattivi',
    description: 'Cosa faresti tu? Situazioni reali con feedback immediato',
    href: '/scenarios',
    icon: '🎯',
    color: 'bg-orange-500',
  },
  {
    title: 'Quiz Matematici',
    description: 'Outs, pot odds, equity e decisioni call/fold',
    href: '/quiz',
    icon: '❓',
    color: 'bg-purple-500',
  },
  {
    title: 'Teoria',
    description: 'Ranking mani, regole e concetti fondamentali',
    href: '/learn',
    icon: '📚',
    color: 'bg-teal-500',
  },
  {
    title: 'Calcolatore Odds',
    description: 'Calcola equity, outs e pot odds in tempo reale',
    href: '/calculator',
    icon: '🔢',
    color: 'bg-green-500',
  },
  {
    title: 'Chart Preflop',
    description: 'Quali mani giocare da ogni posizione',
    href: '/preflop',
    icon: '📋',
    color: 'bg-yellow-500',
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ♠️ Poker Trainer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Impara il Texas Hold&apos;em da zero. Percorso guidato, scenari pratici
          e matematica del poker per vincere con gli amici.
        </p>
        <Link
          href="/path"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Inizia il Percorso
        </Link>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
          <Link
            key={feature.href}
            href={feature.href}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h2>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </Link>
        ))}
      </section>

      {/* Quick Formulas */}
      <section className="bg-gray-900 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Formule Chiave</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-mono text-blue-400 mb-2">Outs x 2</div>
            <p className="text-gray-400">% al Turn</p>
          </div>
          <div>
            <div className="text-3xl font-mono text-green-400 mb-2">Outs x 4</div>
            <p className="text-gray-400">% al River (dal Flop)</p>
          </div>
          <div>
            <div className="text-3xl font-mono text-purple-400 mb-2">Bet / (Pot + Bet)</div>
            <p className="text-gray-400">Pot Odds</p>
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="text-center">
        <Link
          href="/dashboard"
          className="inline-block border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          Vedi i tuoi progressi →
        </Link>
      </section>
    </div>
  );
}

import Link from 'next/link';

const features = [
  {
    title: 'Impara le Basi',
    description: 'Ranking delle mani, regole e concetti fondamentali',
    href: '/learn',
    icon: '📚',
    color: 'bg-blue-500'
  },
  {
    title: 'Calcolatore Odds',
    description: 'Calcola le probabilità in tempo reale',
    href: '/calculator',
    icon: '🔢',
    color: 'bg-green-500'
  },
  {
    title: 'Quiz Interattivi',
    description: 'Metti alla prova le tue conoscenze',
    href: '/quiz',
    icon: '❓',
    color: 'bg-purple-500'
  }
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ♠️ Poker Math Trainer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Impara la matematica del Texas Hold&apos;em con esercizi interattivi,
          calcolatori e quiz per migliorare il tuo gioco.
        </p>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
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

      {/* Quick Stats */}
      <section className="bg-gray-900 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Formule Chiave</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-mono text-blue-400 mb-2">Outs × 2</div>
            <p className="text-gray-400">% al Turn</p>
          </div>
          <div>
            <div className="text-3xl font-mono text-green-400 mb-2">Outs × 4</div>
            <p className="text-gray-400">% al River (dal Flop)</p>
          </div>
          <div>
            <div className="text-3xl font-mono text-purple-400 mb-2">Bet / (Pot + Bet)</div>
            <p className="text-gray-400">Pot Odds</p>
          </div>
        </div>
      </section>
    </div>
  );
}

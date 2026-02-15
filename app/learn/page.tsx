import { HAND_RANKINGS } from '@/lib/hands';

export default function LearnPage() {
  const handRankings = Object.entries(HAND_RANKINGS).map(([key, value]) => ({
    key,
    ...value
  }));

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold text-gray-900">📚 Impara il Poker</h1>

      {/* Regole Base */}
      <section className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Regole Texas Hold&apos;em</h2>
        <div className="prose max-w-none text-gray-700">
          <ul className="space-y-2">
            <li>Ogni giocatore riceve <strong>2 carte personali</strong> (hole cards)</li>
            <li>Sul tavolo vengono messe <strong>5 carte comuni</strong> (community cards)</li>
            <li>Fasi di gioco: <strong>Preflop → Flop (3) → Turn (1) → River (1)</strong></li>
            <li>Vince chi forma la <strong>migliore combinazione di 5 carte</strong></li>
          </ul>
        </div>
      </section>

      {/* Ranking Mani */}
      <section className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ranking delle Mani</h2>
        <p className="text-gray-600 mb-6">Dalla più forte alla più debole:</p>

        <div className="space-y-3">
          {handRankings.map((hand, index) => (
            <div
              key={hand.key}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl font-bold text-gray-400 w-8">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{hand.name}</h3>
                <p className="text-sm text-gray-600">{hand.description}</p>
              </div>
              <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                Valore: {hand.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Concetti Probabilità */}
      <section className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Concetti di Probabilità</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Outs</h3>
            <p className="text-blue-800">
              Carte rimanenti nel mazzo che migliorano la tua mano.
              Es: con un flush draw hai 9 outs.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">💰 Pot Odds</h3>
            <p className="text-green-800">
              Rapporto tra la puntata da chiamare e il piatto totale.
              Formula: Bet / (Pot + Bet)
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">📊 Equity</h3>
            <p className="text-purple-800">
              La tua percentuale di vittoria contro le mani avversarie.
              Calcolata con simulazioni Monte Carlo.
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">📈 Expected Value (EV)</h3>
            <p className="text-orange-800">
              Valore atteso di una decisione.
              EV = (P.win × Win) - (P.lose × Lose)
            </p>
          </div>
        </div>
      </section>

      {/* Regola del 2 e 4 */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">⚡ Regola del 2 e 4</h2>
        <p className="mb-4 opacity-90">
          Formula rapida per calcolare le probabilità:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-3xl font-mono mb-2">Outs × 2</div>
            <p className="opacity-80">Probabilità dal Turn al River</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-3xl font-mono mb-2">Outs × 4</div>
            <p className="opacity-80">Probabilità dal Flop al River</p>
          </div>
        </div>
        <p className="mt-4 text-sm opacity-80">
          Esempio: con 9 outs (flush draw), hai ~18% al turn e ~36% al river.
        </p>
      </section>
    </div>
  );
}

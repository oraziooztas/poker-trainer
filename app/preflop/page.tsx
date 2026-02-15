import PreflopChart from '@/components/PreflopChart';

export default function PreflopPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Preflop Hand Chart</h1>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Forza delle Mani Preflop</h2>
        <p className="text-gray-600 mb-6">
          Questa tabella mostra la forza relativa di tutte le combinazioni di mani iniziali nel Texas Hold&apos;em.
          I colori indicano quanto è forte la mano in media.
        </p>
        <PreflopChart />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Come Leggere il Chart</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold">Posizione nel Grid</h3>
            <ul className="list-disc list-inside ml-2 text-sm">
              <li><strong>Diagonale:</strong> Coppie (AA, KK, QQ, ...)</li>
              <li><strong>Sopra la diagonale:</strong> Mani suited (stesso seme)</li>
              <li><strong>Sotto la diagonale:</strong> Mani offsuit (semi diversi)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Tier di Forza</h3>
            <ul className="list-disc list-inside ml-2 text-sm">
              <li><strong>Premium (rosso):</strong> Gioca sempre aggressivamente</li>
              <li><strong>Forte (arancione):</strong> Raise in quasi tutte le posizioni</li>
              <li><strong>Giocabile (giallo):</strong> Gioca in posizione media/tardiva</li>
              <li><strong>Speculativo (verde):</strong> Gioca in late position o con implied odds</li>
              <li><strong>Marginale (blu):</strong> Solo in situazioni favorevoli</li>
              <li><strong>Fold (grigio):</strong> Generalmente da foldare preflop</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

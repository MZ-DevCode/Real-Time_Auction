import React, { useState } from 'react';

const initialLots = [
  {
    id: 1,
    title: "Vintage Rolex Submariner (1984)",
    description: "Original condition, serviced last year. Box and papers included.",
    current_price: 12500,
    status: "active",
    bids_count: 14,
  },
  {
    id: 2,
    title: "Apple Macintosh 128K (Working)",
    description: "Rare collector's item, includes original mouse and keyboard.",
    current_price: 4200,
    status: "active",
    bids_count: 8,
  },
  {
    id: 3,
    title: "Cyberdeck Custom Build Mk. IV",
    description: "Mechanical keyboard, built-in SDR radio, rugged Pelican case.",
    current_price: 1850,
    status: "upcoming",
    bids_count: 0,
  },
];

export default function App() {
  const [lots, setLots] = useState(initialLots);
  const [bidAmounts, setBidAmounts] = useState({});

  const handleBidChange = (lotId, value) => {
    setBidAmounts({ ...bidAmounts, [lotId]: value });
  };

  const placeBid = (lotId) => {
    const amount = parseFloat(bidAmounts[lotId]);
    const lot = lots.find(l => l.id === lotId);

    if (!amount || amount <= lot.current_price) {
      alert("Ставка должна быть выше текущей цены!");
      return;
    }

    setLots(lots.map(l => l.id === lotId ? { ...l, current_price: amount, bids_count: l.bids_count + 1 } : l));
    setBidAmounts({ ...bidAmounts, [lotId]: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="font-bold tracking-wider text-lg uppercase bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              NexusAuction
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400">Баланс: <strong className="text-amber-400">$24,500</strong></span>
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition">
              Войти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Активные лоты</h1>
          <p className="text-slate-400 mt-1">Делайте ставки в реальном времени. Побеждает последняя наивысшая ставка.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${
                    lot.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {lot.status === 'active' ? 'Идет аукцион' : 'Скоро начнется'}
                  </span>
                  <span className="text-xs text-slate-500">{lot.bids_count} ставок</span>
                </div>

                <h3 className="text-xl font-bold mb-2">{lot.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{lot.description}</p>
              </div>

              <div>
                <div className="bg-slate-950/50 rounded-xl p-4 mb-4 border border-slate-800/60 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 block">Текущая цена</span>
                    <span className="text-2xl font-black text-amber-400">${lot.current_price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={`Мин. > ${lot.current_price}`}
                    value={bidAmounts[lot.id] || ''}
                    onChange={(e) => handleBidChange(lot.id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:border-amber-500 transition"
                  />
                  <button
                    onClick={() => placeBid(lot.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
                  >
                    Ставка
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

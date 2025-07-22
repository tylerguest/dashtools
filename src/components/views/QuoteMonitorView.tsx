import React from 'react';

const mockQuotes = [
  { ticker: 'AAPL', last: 212.65, chg: 0.70, volume: '51.4M', latency: '2s' },
  { ticker: 'ABEO', last: 6.95, chg: 5.46, volume: '739.2K', latency: '2s' },
  { ticker: 'AMD', last: 156.84, chg: -0.10, volume: '39.0M', latency: '1s' },
  { ticker: 'AMGN', last: 295.77, chg: -0.34, volume: '2.1M', latency: '3s' },
  { ticker: 'AMZN', last: 229.35, chg: 1.43, volume: '40.3M', latency: '3s' },
  { ticker: 'BAC', last: 47.55, chg: 0.50, volume: '21.0M', latency: '2s' },
  { ticker: 'BIBL', last: 41.90, chg: -0.21, volume: '27.6K', latency: '2s' },
  { ticker: 'BRK.B', last: 475.00, chg: 0.25, volume: '3.8M', latency: '2s' },
  { ticker: 'CATX', last: 4.21, chg: 0.00, volume: '2.6K', latency: '2s' },
  { ticker: 'CMG', last: 52.54, chg: -2.58, volume: '14.1M', latency: '1s' },
  { ticker: 'F', last: 11.33, chg: 1.52, volume: '65.5M', latency: '2s' },
  { ticker: 'GOOG', last: 191.35, chg: 0.00, volume: '296ms', latency: '296ms' },
  { ticker: 'GOOGL', last: 190.33, chg: 2.85, volume: '45.8M', latency: '4s' },
  { ticker: 'IBM', last: 285.30, chg: -0.20, volume: '3.0M', latency: '3s' },
  { ticker: 'JNJ', last: 164.49, chg: -0.09, volume: '8.3M', latency: '3s' },
  { ticker: 'JPM', last: 291.05, chg: -0.08, volume: '7.9M', latency: '2s' },
  { ticker: 'MA', last: 555.90, chg: 0.48, volume: '2.2M', latency: '832ms' },
  { ticker: 'MCD', last: 295.94, chg: 0.48, volume: '2.2M', latency: '3s' },
  { ticker: 'META', last: 713.22, chg: 1.27, volume: '9.4M', latency: '2s' },
  { ticker: 'MIST', last: 1.50, chg: -5.06, volume: '1.7M', latency: '2s' },
  { ticker: 'MRK', last: 79.43, chg: -0.16, volume: '1.4M', latency: '2s' },
  { ticker: 'MSFT', last: 509.71, chg: 0.00, volume: '40.0M', latency: '2s' },
  { ticker: 'MU', last: 113.70, chg: -1.13, volume: '22.9M', latency: '2s' },
  { ticker: 'NVDA', last: 129.93, chg: 0.00, volume: '99.2M', latency: '2s' },
  { ticker: 'PFE', last: 24.36, chg: -0.45, volume: '33.7M', latency: '2s' },
];

function getChgColor(chg: number) {
  if (chg > 0) return 'text-green-400';
  if (chg < 0) return 'text-red-400';
  return 'text-zinc-200';
}

export default function QuoteMonitorView() {
  return (
    <div className="w-full h-full bg-zinc-900 text-zinc-200 font-mono text-xs p-2 overflow-auto">
      <div className="mb-2 flex items-center gap-2">
        <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs ml-2">Main</span>
        <span className="text-zinc-400 text-xs">Ticker ^</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-0.5">
          <thead>
            <tr className="text-zinc-400 bg-zinc-800">
              <th className="px-2 py-1 text-left">Ticker</th>
              <th className="px-2 py-1 text-right">Last</th>
              <th className="px-2 py-1 text-right">Chg %</th>
              <th className="px-2 py-1 text-right">Volume</th>
              <th className="px-2 py-1 text-right">Latency</th>
            </tr>
          </thead>
          <tbody>
            {mockQuotes.map((q) => (
              <tr key={q.ticker} className="odd:bg-zinc-900 even:bg-zinc-800">
                <td className="px-2 py-1 font-bold text-zinc-100">{q.ticker}</td>
                <td className="px-2 py-1 text-right">{q.last}</td>
                <td className={`px-2 py-1 text-right font-bold ${getChgColor(q.chg)}`}>{q.chg > 0 ? '+' : ''}{q.chg.toFixed(2)}%</td>
                <td className="px-2 py-1 text-right">{q.volume}</td>
                <td className="px-2 py-1 text-right text-green-300">{q.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

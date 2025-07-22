import React, { useEffect, useRef, useState } from 'react';

const TICKERS = [
  'AAPL', 'ABEO', 'AMD', 'AMGN', 'AMZN', 'BAC', 'BIBL', 'BRK.B', 'CATX', 'CMG',
  'F', 'GOOG', 'GOOGL', 'IBM', 'JNJ', 'JPM', 'MA', 'MCD', 'META', 'MIST',
  'MRK', 'MSFT', 'MU', 'NVDA', 'PFE'
];

function getChgColor(chg: number) {
  if (chg > 0) return 'text-green-400';
  if (chg < 0) return 'text-red-400';
  return 'text-zinc-200';
}

interface Quote {
  ticker: string;
  last: number;
  chg: number;
  volume: string;
  latency: string;
  prev?: number;
}

export default function QuoteMonitorView() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>(() =>
    Object.fromEntries(TICKERS.map(ticker => [ticker, {
      ticker,
      last: 0,
      chg: 0,
      volume: '',
      latency: '',
      prev: 0
    }]))
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not set in NEXT_PUBLIC_FINNHUB_API_KEY');
      return;
    }
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;
    ws.onopen = () => {
      TICKERS.forEach(ticker => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: ticker }));
      });
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'trade' && Array.isArray(msg.data)) {
        setQuotes(prevQuotes => {
          const updated = { ...prevQuotes };
          msg.data.forEach((trade: any) => {
            const ticker = trade.s;
            const last = trade.p;
            const prev = updated[ticker]?.last || 0;
            const chg = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
            updated[ticker] = {
              ...updated[ticker],
              last,
              chg,
              volume: trade.v ? trade.v.toLocaleString() : updated[ticker].volume,
              latency: `${Math.max(0, Math.round((Date.now() - trade.t) / 1000))}s`,
              prev
            };
          });
          return updated;
        });
      }
    };
    ws.onerror = (err) => {
      console.error('Finnhub WebSocket error:', err);
    };
    return () => {
      TICKERS.forEach(ticker => {
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }));
      });
      ws.close();
    };
  }, []);

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
            {TICKERS.map(ticker => {
              const q = quotes[ticker];
              return (
                <tr key={ticker} className="odd:bg-zinc-900 even:bg-zinc-800">
                  <td className="px-2 py-1 font-bold text-zinc-100">{ticker}</td>
                  <td className="px-2 py-1 text-right">{q.last !== 0 ? q.last : '-'}</td>
                  <td className={`px-2 py-1 text-right font-bold ${getChgColor(q.chg)}`}>{q.chg > 0 ? '+' : ''}{q.chg !== 0 ? q.chg.toFixed(2) : '-'}%</td>
                  <td className="px-2 py-1 text-right">{q.volume || '-'}</td>
                  <td className="px-2 py-1 text-right text-green-300">{q.latency || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

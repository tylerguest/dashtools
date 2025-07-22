import React, { useEffect, useRef, useState } from 'react';

async function fetchQuote(ticker: string, apiKey: string) {
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`);
  if (!res.ok) return null;
  return res.json();
}

const DEFAULT_TICKERS = ['AAPL', 'AMZN', 'MSFT', 'GOOG', 'NVDA'];

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

type SortKey = 'ticker' | 'last' | 'chg' | 'volume' | 'latency';
export default function QuoteMonitorView() {
  const [tickers, setTickers] = useState<string[]>(DEFAULT_TICKERS);
  const [sortKey, setSortKey] = useState<SortKey>('ticker');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [inputTicker, setInputTicker] = useState('');
  const [quotes, setQuotes] = useState<Record<string, Quote>>(() =>
    Object.fromEntries(DEFAULT_TICKERS.map(ticker => [ticker, {
      ticker,
      last: 0,
      chg: 0,
      volume: '',
      latency: '',
      prev: 0
    }]))
  );
  const [flashCells, setFlashCells] = useState<Record<string, { last: boolean; chg: boolean; volume: boolean }>>(() =>
    Object.fromEntries(DEFAULT_TICKERS.map(ticker => [ticker, { last: false, chg: false, volume: false }]))
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('Finnhub API key not set in NEXT_PUBLIC_FINNHUB_API_KEY');
      return;
    }

    (async () => {
      const results = await Promise.all(tickers.map(ticker => fetchQuote(ticker, apiKey)));
      setQuotes(prevQuotes => {
        const updated = { ...prevQuotes };
        tickers.forEach((ticker, i) => {
          const data = results[i];
          if (data && typeof data.c === 'number' && typeof data.pc === 'number') {
            updated[ticker] = {
              ...updated[ticker],
              last: data.c,
              chg: data.pc !== 0 ? ((data.c - data.pc) / data.pc) * 100 : 0,
              volume: data.v ? data.v.toLocaleString() : '',
              prev: data.pc,
              latency: '-',
            };
          }
        });
        return updated;
      });
    })();

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;
    ws.onopen = () => {
      tickers.forEach(ticker => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: ticker }));
      });
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'trade' && Array.isArray(msg.data)) {
        setQuotes(prevQuotes => {
          const updated = { ...prevQuotes };
          const newFlashCells: Record<string, { last: boolean; chg: boolean; volume: boolean }> = {};
          msg.data.forEach((trade: any) => {
            const ticker = trade.s;
            const last = trade.p;
            const prev = updated[ticker]?.last || 0;
            const chg = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
            const volume = trade.v ? trade.v.toLocaleString() : updated[ticker]?.volume || '';
            const lastChanged = last !== updated[ticker]?.last;
            const chgChanged = chg !== updated[ticker]?.chg;
            const volumeChanged = volume !== updated[ticker]?.volume;
            newFlashCells[ticker] = {
              last: lastChanged,
              chg: chgChanged,
              volume: volumeChanged
            };
            updated[ticker] = {
              ...updated[ticker],
              last,
              chg,
              volume,
              latency: `${Math.max(0, Math.round((Date.now() - trade.t) / 1000))}s`,
              prev
            };
          });
          setFlashCells(prev => {
            const merged = { ...prev };
            Object.entries(newFlashCells).forEach(([ticker, fields]) => {
              merged[ticker] = {
                last: fields.last ? true : prev[ticker]?.last || false,
                chg: fields.chg ? true : prev[ticker]?.chg || false,
                volume: fields.volume ? true : prev[ticker]?.volume || false,
              };
            });
            return merged;
          });
          Object.keys(newFlashCells).forEach(ticker => {
            if (newFlashCells[ticker].last || newFlashCells[ticker].chg || newFlashCells[ticker].volume) {
              clearTimeout((window as any)[`__flashTimeout_${ticker}`]);
              (window as any)[`__flashTimeout_${ticker}`] = setTimeout(() => {
                setFlashCells(prev => ({
                  ...prev,
                  [ticker]: { last: false, chg: false, volume: false }
                }));
              }, 200);
            }
          });
          return updated;
        });
      }
    };
    ws.onerror = (err) => {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('Finnhub WebSocket error:', errorMsg, 'readyState:', ws.readyState, 'url:', ws.url);
    };
    return () => {
      tickers.forEach(ticker => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }));
        }
      });
      if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        ws.close();
      }
    };
  }, [tickers]);

  const displayedTickers = React.useMemo(() => {
    return [...tickers].sort((a, b) => {
      const qa = quotes[a] || {};
      const qb = quotes[b] || {};
      let cmp = 0;
      switch (sortKey) {
        case 'ticker':
          cmp = a.localeCompare(b);
          break;
        case 'last':
          cmp = (qa.last || 0) - (qb.last || 0);
          break;
        case 'chg':
          cmp = (qa.chg || 0) - (qb.chg || 0);
          break;
        case 'volume':
          cmp = (parseInt((qa.volume || '0').replace(/,/g, '')) || 0) - (parseInt((qb.volume || '0').replace(/,/g, '')) || 0);
          break;
        case 'latency':
          cmp = parseInt((qa.latency || '0').replace(/[^0-9]/g, '')) - parseInt((qb.latency || '0').replace(/[^0-9]/g, ''));
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [tickers, sortKey, sortAsc, quotes]);

  return (
    <div className="w-full h-full bg-zinc-900 text-zinc-200 font-mono text-xs p-2 overflow-auto">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs ml-2">Main</span>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const t = inputTicker.trim().toUpperCase();
            if (t && !tickers.includes(t)) {
              setTickers(prev => [...prev, t]);
              setQuotes(prev => ({ ...prev, [t]: { ticker: t, last: 0, chg: 0, volume: '', latency: '', prev: 0 } }));
              setFlashCells(prev => ({ ...prev, [t]: { last: false, chg: false, volume: false } }));
            }
            setInputTicker('');
          }}
          className="flex items-center gap-1"
          style={{ minWidth: 0 }}
        >
          <input
            type="text"
            value={inputTicker}
            onChange={e => setInputTicker(e.target.value)}
            placeholder="Add ticker..."
            className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-xs border border-zinc-700 focus:outline-none w-24"
            maxLength={8}
            style={{ minWidth: 0 }}
          />
          <button type="submit" className="bg-green-700 text-xs px-2 py-0.5 rounded text-green-100 hover:bg-green-600">Add</button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-0.5">
          <thead>
            <tr className="text-zinc-400 bg-zinc-800">
              <th className="px-2 py-1 text-left cursor-pointer select-none"
                  onClick={() => { setSortKey('ticker'); setSortAsc(k => sortKey === 'ticker' ? !k : true); }}>
                Ticker
                {sortKey === 'ticker' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className="px-2 py-1 text-right cursor-pointer select-none"
                  onClick={() => { setSortKey('last'); setSortAsc(k => sortKey === 'last' ? !k : true); }}>
                Last
                {sortKey === 'last' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className="px-2 py-1 text-right cursor-pointer select-none"
                  onClick={() => { setSortKey('chg'); setSortAsc(k => sortKey === 'chg' ? !k : true); }}>
                Chg %
                {sortKey === 'chg' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className="px-2 py-1 text-right cursor-pointer select-none"
                  onClick={() => { setSortKey('volume'); setSortAsc(k => sortKey === 'volume' ? !k : true); }}>
                Volume
                {sortKey === 'volume' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className="px-2 py-1 text-right cursor-pointer select-none"
                  onClick={() => { setSortKey('latency'); setSortAsc(k => sortKey === 'latency' ? !k : true); }}>
                Latency
                {sortKey === 'latency' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className="px-2 py-1 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {displayedTickers.map(ticker => {
              const q = quotes[ticker] || { ticker, last: 0, chg: 0, volume: '', latency: '', prev: 0 };
              const flash = flashCells[ticker] || { last: false, chg: false, volume: false };
              return (
                <tr key={ticker} className="odd:bg-zinc-900 even:bg-zinc-800">
                  <td className="px-2 py-1 font-bold text-zinc-100">{ticker}</td>
                  <td className={`px-2 py-1 text-right transition-colors duration-150 ${flash.last ? 'bg-yellow-400/30' : ''}`}>{q.last !== 0 ? q.last : '-'}</td>
                  <td className={`px-2 py-1 text-right font-bold transition-colors duration-150 ${getChgColor(q.chg)} ${flash.chg ? 'bg-yellow-400/30' : ''}`}>
                    {typeof q.chg === 'number' && !isNaN(q.chg)
                      ? (q.chg > 0 ? '+' : '') + q.chg.toFixed(2)
                      : ''}
                  </td>
                  <td className={`px-2 py-1 text-right transition-colors duration-150 ${flash.volume ? 'bg-yellow-400/30' : ''}`}>{q.volume || '-'}</td>
                  <td className="px-2 py-1 text-right text-green-300">{q.latency || '-'}</td>
                  <td className="px-2 py-1 text-right">
                    {tickers.length > 1 && (
                      <button
                        className="text-red-400 hover:text-red-600 text-xs px-1"
                        title="Remove"
                        onClick={() => {
                          setTickers(prev => prev.filter(t => t !== ticker));
                        }}
                      >✕</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

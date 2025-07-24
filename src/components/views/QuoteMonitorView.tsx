import React, { useEffect, useRef } from 'react';
import { quoteMonitorViewClassNames, buttonClassNames } from '../../styles/classNames';
import TickerSelectorWindow from './TickerSelectorWindow';
import { useQuoteMonitorStore } from '../../stores/quoteMonitorStore';

async function fetchQuote(ticker: string, apiKey: string) {
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`);
  if (!res.ok) return null;
  return res.json();
}

function getChgColor(chg: number) {
  if (chg > 0) return 'text-green-400';
  if (chg < 0) return 'text-red-400';
  return 'text-zinc-200';
}

interface Quote { ticker: string; last: number; chg: number; volume: string; latency: string; prev?: number; }

export default function QuoteMonitorView() {
  const tickers = useQuoteMonitorStore(state => state.tickers);
  const setTickers = useQuoteMonitorStore(state => state.setTickers);
  const sortKey = useQuoteMonitorStore(state => state.sortKey);
  const setSortKey = useQuoteMonitorStore(state => state.setSortKey);
  const sortAsc = useQuoteMonitorStore(state => state.sortAsc);
  const setSortAsc = useQuoteMonitorStore(state => state.setSortAsc);
  const inputTicker = useQuoteMonitorStore(state => state.inputTicker);
  const setInputTicker = useQuoteMonitorStore(state => state.setInputTicker);
  const showTickerSelector = useQuoteMonitorStore(state => state.showTickerSelector);
  const setShowTickerSelector = useQuoteMonitorStore(state => state.setShowTickerSelector);
  const quotes = useQuoteMonitorStore(state => state.quotes);
  const setQuotes = useQuoteMonitorStore(state => state.setQuotes);
  const updateQuotes = useQuoteMonitorStore(state => state.updateQuotes);
  const flashCells = useQuoteMonitorStore(state => state.flashCells);
  const setFlashCells = useQuoteMonitorStore(state => state.setFlashCells);
  const updateFlashCells = useQuoteMonitorStore(state => state.updateFlashCells);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectorRef = React.useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) { return; }
    (async () => {
      const results = await Promise.all(tickers.map(ticker => fetchQuote(ticker, apiKey)));
      const updated = { ...quotes };
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
      updateQuotes(updated);
    })();

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;
    ws.onopen = () => {
      tickers.forEach(ticker => { ws.send(JSON.stringify({ type: 'subscribe', symbol: ticker })); });
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'trade' && Array.isArray(msg.data)) {
        const updated = { ...quotes };
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
          newFlashCells[ticker] = { last: lastChanged, chg: chgChanged, volume: volumeChanged };
          updated[ticker] = {
            ...updated[ticker],
            last,
            chg,
            volume,
            latency: `${Math.max(0, Math.round((Date.now() - trade.t) / 1000))}s`,
            prev
          };
        });
        const merged: Record<string, { last: boolean; chg: boolean; volume: boolean }> = { ...flashCells };
        Object.entries(newFlashCells).forEach(([ticker, fields]) => {
          merged[ticker] = {
            last: fields.last ? true : flashCells[ticker]?.last || false,
            chg: fields.chg ? true : flashCells[ticker]?.chg || false,
            volume: fields.volume ? true : flashCells[ticker]?.volume || false,
          };
        });
        updateFlashCells(merged);
        Object.keys(newFlashCells).forEach(ticker => {
          if (newFlashCells[ticker].last || newFlashCells[ticker].chg || newFlashCells[ticker].volume) {
            clearTimeout((window as any)[`__flashTimeout_${ticker}`]);
            (window as any)[`__flashTimeout_${ticker}`] = setTimeout(() => {
              updateFlashCells({ [ticker]: { last: false, chg: false, volume: false } });
            }, 200);
          }
        });
        updateQuotes(updated);
      }
    };
    ws.onerror = () => {};
    ws.onclose = () => {};
    return () => {
      tickers.forEach(ticker => {
        if (ws && ws.readyState === WebSocket.OPEN) { ws.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker })); }
      });
      if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) { ws.close(); }
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

  React.useEffect(() => {
    if (!showTickerSelector) return;
    function handleMouseDown(e: MouseEvent) {
      const input = inputRef.current;
      const selector = selectorRef.current;
      if (
        (input && input.contains(e.target as Node)) ||
        (selector && selector.contains(e.target as Node))
      ) { return; }
      setShowTickerSelector(false);
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [showTickerSelector]);

  return (
    <div className={quoteMonitorViewClassNames.container}>
      <div className={quoteMonitorViewClassNames.headerRow}>
        <div className="flex items-center gap-2">
          <span className={quoteMonitorViewClassNames.mainLabel}>Main</span>
        </div>
        <div className={quoteMonitorViewClassNames.tickerInputRow} style={{ minWidth: 0 }}>
          <input
            ref={inputRef}
            type="text"
            value={inputTicker}
            onChange={e => setInputTicker(e.target.value)}
            onFocus={() => setShowTickerSelector(true)}
            onClick={() => setShowTickerSelector(true)}
            className={quoteMonitorViewClassNames.tickerInput}
            maxLength={8}
            style={{ minWidth: 0 }}
            autoComplete="off"
          />
          <button
            type="submit"
            className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.sm}`}
          >
            Add
          </button>
          {showTickerSelector && (
            <div className={quoteMonitorViewClassNames.tickerSelector} ref={selectorRef}>
              <TickerSelectorWindow
                onSelect={ticker => {
                  setInputTicker(ticker);
                  setShowTickerSelector(false);
                  setTimeout(() => { inputRef.current?.focus(); }, 0);
                }}
                onClose={() => setShowTickerSelector(false)}
              />
            </div>
          )}
        </div>
      </div>
      <div className={quoteMonitorViewClassNames.tableWrapper}>
        <table className={quoteMonitorViewClassNames.table}>
          <thead>
            <tr className={quoteMonitorViewClassNames.theadRow}>
              <th className={quoteMonitorViewClassNames.thTicker}
                  onClick={() => { setSortKey('ticker'); setSortAsc(sortKey === 'ticker' ? !sortAsc : true); }}>
                Ticker
                {sortKey === 'ticker' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className={quoteMonitorViewClassNames.thBase}
                  onClick={() => { setSortKey('last'); setSortAsc(sortKey === 'last' ? !sortAsc : true); }}>
                Last
                {sortKey === 'last' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className={quoteMonitorViewClassNames.thBase}
                  onClick={() => { setSortKey('chg'); setSortAsc(sortKey === 'chg' ? !sortAsc : true); }}>
                Chg %
                {sortKey === 'chg' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className={quoteMonitorViewClassNames.thBase}
                  onClick={() => { setSortKey('volume'); setSortAsc(sortKey === 'volume' ? !sortAsc : true); }}>
                Volume
                {sortKey === 'volume' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className={quoteMonitorViewClassNames.thBase}
                  onClick={() => { setSortKey('latency'); setSortAsc(sortKey === 'latency' ? !sortAsc : true); }}>
                Latency
                {sortKey === 'latency' && (sortAsc ? <span className="ml-1">▲</span> : <span className="ml-1">▼</span>)}
              </th>
              <th className={quoteMonitorViewClassNames.thBase}></th>
            </tr>
          </thead>
          <tbody>
            {displayedTickers.map(ticker => {
              const q = quotes[ticker] || { ticker, last: 0, chg: 0, volume: '', latency: '', prev: 0 };
              const flash = flashCells[ticker] || { last: false, chg: false, volume: false };
              return (
                <tr key={ticker} className={"odd:bg-zinc-900 even:bg-zinc-800"}>
                  <td className={quoteMonitorViewClassNames.tdTicker}>{ticker}</td>
                  <td className={
                    quoteMonitorViewClassNames.tdBase + (flash.last ? ' bg-yellow-400/30' : '')
                  }>{q.last !== 0 ? q.last : '-'}</td>
                  <td className={
                    quoteMonitorViewClassNames.tdChg + ' ' + getChgColor(q.chg) + (flash.chg ? ' bg-yellow-400/30' : '')
                  }>
                    {typeof q.chg === 'number' && !isNaN(q.chg) ? (q.chg > 0 ? '+' : '') + q.chg.toFixed(2) : ''}
                  </td>
                  <td className={
                    quoteMonitorViewClassNames.tdBase + (flash.volume ? ' bg-yellow-400/30' : '')
                  }>{q.volume || '-'}</td>
                  <td className={quoteMonitorViewClassNames.tdLatency}>{q.latency || '-'}</td>
                  <td className={quoteMonitorViewClassNames.tdBase}>
                    {tickers.length > 1 && (
                      <button
                        className={quoteMonitorViewClassNames.removeButton}
                        title="Remove"
                        onClick={() => { setTickers(tickers.filter(t => t !== ticker)); }}
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

import { useEffect, useRef } from 'react';
import { useQuoteMonitorStore } from '../stores/quoteMonitorStore';

export function useQuoteMonitorData() {
  const tickers = useQuoteMonitorStore(state => state.tickers);
  const quotes = useQuoteMonitorStore(state => state.quotes);
  const updateQuotes = useQuoteMonitorStore(state => state.updateQuotes);
  const flashCells = useQuoteMonitorStore(state => state.flashCells);
  const updateFlashCells = useQuoteMonitorStore(state => state.updateFlashCells);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) return;

    async function fetchQuote(ticker: string) {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`);
      if (!res.ok) return null;
      return res.json();
    }

    (async () => {
      const results = await Promise.all(tickers.map(ticker => fetchQuote(ticker)));
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
}
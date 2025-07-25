import { create } from 'zustand';

export interface Quote { ticker: string; last: number; chg: number; volume: string; latency: string; prev?: number; }
export type SortKey = 'ticker' | 'last' | 'chg' | 'volume' | 'latency';

export interface QuoteMonitorStore {
  tickers: string[];
  setTickers: (tickers: string[]) => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortAsc: boolean;
  setSortAsc: (asc: boolean) => void;
  inputTicker: string;
  setInputTicker: (ticker: string) => void;
  showTickerSelector: boolean;
  setShowTickerSelector: (show: boolean) => void;
  quotes: Record<string, Quote>;
  setQuotes: (quotes: Record<string, Quote>) => void;
  flashCells: Record<string, { last: boolean; chg: boolean; volume: boolean }>;
  setFlashCells: (flash: Record<string, { last: boolean; chg: boolean; volume: boolean }>) => void;
}


const DEFAULT_TICKERS = ['AAPL', 'AMZN', 'MSFT', 'GOOG', 'NVDA'];
const getDefaultQuote = (ticker: string): Quote => ({ ticker, last: 0, chg: 0, volume: '', latency: '', prev: 0 });
const getDefaultFlash = (): { last: boolean; chg: boolean; volume: boolean } => ({ last: false, chg: false, volume: false });
const defaultQuotes: Record<string, Quote> = Object.fromEntries(
  DEFAULT_TICKERS.map(ticker => [ticker, getDefaultQuote(ticker)])
);
const defaultFlashCells: Record<string, { last: boolean; chg: boolean; volume: boolean }> = Object.fromEntries(
  DEFAULT_TICKERS.map(ticker => [ticker, getDefaultFlash()])
);

export const useQuoteMonitorStore = create<QuoteMonitorStore & {
  updateQuotes: (partial: Record<string, Quote>) => void;
  updateFlashCells: (partial: Record<string, { last: boolean; chg: boolean; volume: boolean }>) => void;
  syncTickersState: () => void;
}>((set, get) => {
  const syncTickersState = () => {
    const { tickers, quotes, flashCells } = get();
    let changed = false;
    const newQuotes = { ...quotes };
    const newFlashCells = { ...flashCells };
    tickers.forEach(ticker => {
      if (!newQuotes[ticker]) { newQuotes[ticker] = getDefaultQuote(ticker); changed = true; }
      if (!newFlashCells[ticker]) { newFlashCells[ticker] = getDefaultFlash(); changed = true; }
    });
    Object.keys(newQuotes).forEach(ticker => { if (!tickers.includes(ticker)) { delete newQuotes[ticker]; changed = true; } });
    Object.keys(newFlashCells).forEach(ticker => { if (!tickers.includes(ticker)) { delete newFlashCells[ticker]; changed = true; } });
    if (changed) set({ quotes: newQuotes, flashCells: newFlashCells });
  };
  return {
    tickers: DEFAULT_TICKERS,
    setTickers: (tickers: string[]) => {
      set({ tickers });
      setTimeout(() => get().syncTickersState(), 0);
    },
    sortKey: 'ticker',
    setSortKey: (key: SortKey) => set({ sortKey: key }),
    sortAsc: true,
    setSortAsc: (asc: boolean) => set({ sortAsc: asc }),
    inputTicker: '',
    setInputTicker: (ticker: string) => set({ inputTicker: ticker }),
    showTickerSelector: false,
    setShowTickerSelector: (show: boolean) => set({ showTickerSelector: show }),
    quotes: defaultQuotes,
    setQuotes: (quotes: Record<string, Quote>) => { set({ quotes }); setTimeout(() => get().syncTickersState(), 0); },
    updateQuotes: (partial: Record<string, Quote>) => { set(state => ({ quotes: { ...state.quotes, ...partial } })); setTimeout(() => get().syncTickersState(), 0); },
    flashCells: defaultFlashCells,
    setFlashCells: (flash: Record<string, { last: boolean; chg: boolean; volume: boolean }>) => { set({ flashCells: flash }); setTimeout(() => get().syncTickersState(), 0); },
    updateFlashCells: (partial: Record<string, { last: boolean; chg: boolean; volume: boolean }>) => { set(state => ({ flashCells: { ...state.flashCells, ...partial } })); setTimeout(() => get().syncTickersState(), 0); },
    syncTickersState,
  };
});

import { useMemo } from 'react';
import { useQuoteMonitorStore } from '../stores/quoteMonitorStore';

export function useSortedTickers() {
  const tickers = useQuoteMonitorStore(state => state.tickers);
  const sortKey = useQuoteMonitorStore(state => state.sortKey);
  const sortAsc = useQuoteMonitorStore(state => state.sortAsc);
  const quotes = useQuoteMonitorStore(state => state.quotes);

  return useMemo(() => {
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
}
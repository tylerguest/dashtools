import React from 'react';
import { quoteMonitorViewClassNames } from '../../../styles/classNames';
import { Quote, SortKey } from '../../../stores/quoteMonitorStore';

interface QuoteTableProps {
  displayedTickers: string[];
  quotes: Record<string, Quote>;
  flashCells: Record<string, { last: boolean; chg: boolean; volume: boolean }>;
  tickers: string[];
  setTickers: (tickers: string[]) => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortAsc: boolean;
  setSortAsc: (asc: boolean) => void;
}

function getChgColor(chg: number): string {
  if (chg > 0) return 'text-green-400';
  if (chg < 0) return 'text-red-400';
  return 'text-zinc-200';
}

export function QuoteTable({
  displayedTickers,
  quotes,
  flashCells,
  tickers,
  setTickers,
  sortKey,
  setSortKey,
  sortAsc,
  setSortAsc,
}: QuoteTableProps) {
  return (
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
          {displayedTickers.map((ticker: string) => {
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
                      onClick={() => { setTickers(tickers.filter((t: string) => t !== ticker)); }}
                    >✕</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
import React, { useRef, useEffect } from 'react';
import { quoteMonitorViewClassNames } from '../../../styles/classNames';
import { useQuoteMonitorStore } from '../../../stores/quoteMonitorStore';
import { useQuoteMonitorData } from '../../../hooks/useQuoteMonitorData';
import { useSortedTickers } from '../../../hooks/useSortedTickers';
import { TickerInputBar } from './TickerInputBar';
import { QuoteTable } from './QuoteTable';

export default function QuoteMonitorView() {
  useQuoteMonitorData();

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
  const flashCells = useQuoteMonitorStore(state => state.flashCells);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [showTickerSelector, setShowTickerSelector]);

  const displayedTickers = useSortedTickers();

  return (
    <div className={quoteMonitorViewClassNames.container}>
      <div className={quoteMonitorViewClassNames.headerRow}>
        <div className="flex-1" />
        <TickerInputBar
          inputTicker={inputTicker}
          setInputTicker={setInputTicker}
          showTickerSelector={showTickerSelector}
          setShowTickerSelector={setShowTickerSelector}
          inputRef={inputRef}
          selectorRef={selectorRef}
          onSelectTicker={setInputTicker}
        />
      </div>
      <QuoteTable
        displayedTickers={displayedTickers}
        quotes={quotes}
        flashCells={flashCells}
        tickers={tickers}
        setTickers={setTickers}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />
    </div>
  );
}
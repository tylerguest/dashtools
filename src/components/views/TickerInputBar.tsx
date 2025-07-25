import React, { RefObject } from 'react';
import { quoteMonitorViewClassNames, buttonClassNames } from '../../styles/classNames';
import TickerSelectorWindow from './TickerSelectorWindow';

interface TickerInputBarProps {
  inputTicker: string;
  setInputTicker: (ticker: string) => void;
  showTickerSelector: boolean;
  setShowTickerSelector: (show: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  selectorRef: RefObject<HTMLDivElement | null>;
  onSelectTicker: (ticker: string) => void;
}

export function TickerInputBar({
  inputTicker,
  setInputTicker,
  showTickerSelector,
  setShowTickerSelector,
  inputRef,
  selectorRef,
  onSelectTicker,
}: TickerInputBarProps) {
  return (
    <div className={quoteMonitorViewClassNames.tickerInputRow} style={{ minWidth: 0 }}>
      <input
        ref={inputRef}
        type="text"
        value={inputTicker}
        onChange={e => setInputTicker(e.target.value)}
        onFocus={() => setShowTickerSelector(true)}
        onClick={() => setShowTickerSelector(true)}
        className={quoteMonitorViewClassNames.tickerInput + ' h-8 rounded-none mr-1'}
        maxLength={8}
        style={{ minWidth: 0, height: 32 }}
        autoComplete="off"
      />
      <button
        type="submit"
        className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.sm}`}
      >
        +
      </button>
      {showTickerSelector && (
        <div className={quoteMonitorViewClassNames.tickerSelector} ref={selectorRef}>
          <TickerSelectorWindow
            onSelect={(ticker: string) => {
              onSelectTicker(ticker);
              setShowTickerSelector(false);
              setTimeout(() => { inputRef.current?.focus(); }, 0);
            }}
            onClose={() => setShowTickerSelector(false)}
          />
        </div>
      )}
    </div>
  );
}
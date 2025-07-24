import React from 'react';

const POPULAR_TICKERS = [
  'AAPL', 'AMZN', 'MSFT', 'GOOG', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC',
  'BABA', 'DIS', 'V', 'JPM', 'BAC', 'WMT', 'T', 'KO', 'PEP', 'CSCO', 'ORCL',
  'CRM', 'PYPL', 'ADBE', 'QCOM', 'AVGO', 'COST', 'MCD', 'SBUX', 'ABNB', 'UBER',
  'SHOP', 'PLTR', 'SNAP', 'SQ', 'ZM', 'ROKU', 'SPOT', 'LYFT', 'PINS', 'TWLO',
  'DOCU', 'DDOG', 'F', 'GM', 'GE', 'HON', 'MMM', 'BA', 'CAT', 'GS', 'MS',
];

interface TickerSelectorWindowProps { onSelect: (ticker: string) => void; onClose: () => void; }

const TickerSelectorWindow: React.FC<TickerSelectorWindowProps> = ({ onSelect, onClose }) => {
  return (
    <div
      className="min-w-[140px] max-w-[180px] max-h-64 bg-zinc-900 border border-zinc-700 flex flex-col text-xs select-none"
      style={{ boxShadow: 'none', borderRadius: 0 }}
    >
      <div className="overflow-y-auto" style={{ maxHeight: '180px' }}>
        {POPULAR_TICKERS.map(ticker => (
          <button
            key={ticker}
            className="block w-full text-left px-3 py-1 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-xs"
            style={{ borderRadius: 0 }}
            onClick={() => onSelect(ticker)}
          >
            {ticker}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TickerSelectorWindow;

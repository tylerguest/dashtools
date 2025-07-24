import React from 'react';
import { tickerSelectorWindowClassNames } from '../../styles/classNames';

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
      className={tickerSelectorWindowClassNames.container}
      style={{ boxShadow: 'none', borderRadius: 0 }}
    >
      <div className={tickerSelectorWindowClassNames.list} style={{ maxHeight: '180px' }}>
        {POPULAR_TICKERS.map(ticker => (
          <button
            key={ticker}
            className={tickerSelectorWindowClassNames.button}
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

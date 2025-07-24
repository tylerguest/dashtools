import React from 'react';
import { stockChartViewClassNames } from '../../styles/classNames';

export default function StockChartView() {

  return (
    <div className={stockChartViewClassNames.container}>
      <iframe
        title="TradingView Chart"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_12345&amp;symbol=NASDAQ:AAPL&amp;interval=15&amp;hidesidetoolbar=1&amp;symboledit=1&amp;saveimage=1&amp;toolbarbg=18181b&amp;studies=[]&amp;theme=dark&amp;style=1&amp;timezone=Etc/UTC&amp;withdateranges=1&amp;hideideas=1&amp;hidevolume=1"
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '0.375rem', background: '#18181b', display: 'block' }}
        className={stockChartViewClassNames.iframe}
        allowFullScreen
      />
    </div>
  );
}

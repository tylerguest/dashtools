import React, { useEffect, useRef, useState } from 'react';
import { stockChartViewClassNames } from '../../styles/classNames';


export default function StockChartView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '<div id="tradingview_12345" style="width:100%;height:100%"></div>';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => setLoading(false);
    containerRef.current.appendChild(script);

    script.onload = () => {
      setLoading(false);
      // @ts-ignore
      if (window.TradingView) {
        // @ts-ignore
        new window.TradingView.widget({
          container_id: 'tradingview_12345',
          symbol: 'NASDAQ:AAPL',
          interval: '15',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#18181b',
          hide_side_toolbar: true,
          allow_symbol_change: true,
          save_image: true,
          studies: [],
          withdateranges: true,
          hideideas: true,
          hidevolume: true,
          fullscreen: false,
          autosize: true,
        });
      }
    };

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className={stockChartViewClassNames.container} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18181b', zIndex: 1 }}>
          <span style={{ color: '#fff' }}>Loading chart...</span>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

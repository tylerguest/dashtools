import { useEffect, useRef } from "react";

export default function FPSMonitor() {
  const spanRef = useRef<HTMLSpanElement>(null);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fps = useRef(0);

  useEffect(() => {
    let running = true;
    function loop() {
      if (!running) return;
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        fps.current = frameCount.current;
        if (spanRef.current) {
          spanRef.current.textContent = fps.current + ' FPS';
        }
        frameCount.current = 0;
        lastTime.current = now;
      }
      requestAnimationFrame(loop);
    }
    loop();
    return () => { running = false; };
  }, []);

  return (
    <span
      ref={spanRef}
      style={{
        marginRight: 8,
        padding: '1px 6px',
        borderRadius: 6,
        background: 'rgba(30,30,30,0.7)',
        color: '#fff',
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: 0.5,
        userSelect: 'none',
      }}
      title="Frames per second (FPS)"
    >
      0 FPS
    </span>
  );
}

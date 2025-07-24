import type { WindowData } from '@/types/window';

/**
 * Returns a default window layout for the dashboard.
 * @param browserWidth - The width of the browser window.
 * @param browserHeight - The height of the browser window.
 * @param windowCount - Number of windows to display (default: 4)
 * @returns Array of WindowData objects
 */

export function getWindowLayout(
  browserWidth: number = 320 * 4 + 24 * (4 + 1),
  browserHeight: number = 900 + 40,
  windowCount: number = 4
): WindowData[] {
  const gap = 24;
  const defaultWindowWidth = 320;
  const defaultWindowHeight = 900;
  const minWindowHeight = 400;
  const contents: WindowData["content"][] = ['stockchart', 'quotemonitor', 'chatbot', 'notes'];
  const totalGap = gap * (windowCount + 1);
  const windowWidth = Math.max(320, Math.floor((browserWidth - totalGap) / windowCount));
  const totalWindowsWidth = windowWidth * windowCount + totalGap;
  const leftOffset = Math.max(0, Math.floor((browserWidth - totalWindowsWidth) / 2));
  const availableHeight = Math.max(minWindowHeight, Math.floor(browserHeight - 120));
  return Array.from({ length: windowCount }, (_, i) => ({
    id: i + 1,
    x: leftOffset + gap * (i + 1) + windowWidth * i,
    y: 30,
    width: windowWidth,
    height: availableHeight,
    title: '',
    content: contents[i] ?? 'quotemonitor',
    notes: ''
  }));
}
export function snapTo(value: number, target: number, threshold: number): number {
  return Math.abs(value - target) < threshold ? target : value;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

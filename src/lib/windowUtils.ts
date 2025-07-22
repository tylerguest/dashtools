export function snapTo(value: number, target: number, threshold: number): number {
  return Math.abs(value - target) < threshold ? target : value;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

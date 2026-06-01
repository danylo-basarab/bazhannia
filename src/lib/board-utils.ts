export const POSITION_GAP = 1000

export function getNewPosition(before: number | null, after: number | null): number {
  if (before == null && after == null) return POSITION_GAP
  if (before == null) return (after as number) - POSITION_GAP
  if (after == null) return before + POSITION_GAP
  const mid = (before + after) / 2
  return mid
}

export function needsNormalize(positions: number[]): boolean {
  for (let i = 1; i < positions.length; i++) {
    if (Math.abs(positions[i] - positions[i - 1]) < 1) return true
  }
  return false
}

export function normalizePositions(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i + 1) * POSITION_GAP)
}

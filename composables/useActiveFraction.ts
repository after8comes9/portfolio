// Shared scroll-to-opacity math used by both SceneContent and CaseSection
export function computeOpacity(activeFraction: number, index: number): number {
  const diff = activeFraction - index
  const absDiff = Math.abs(diff)

  if (absDiff < 0.1) return 1
  if (diff < 0) return absDiff < 0.8 ? 1 - (absDiff - 0.1) / 0.7 : 0
  return absDiff < 0.3 ? 1 - (absDiff - 0.1) / 0.2 : 0
}

export function getActiveFraction(scrollY: number): number {
  const vh = window.innerHeight
  return scrollY / vh - 2.0
}

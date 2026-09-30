export type AmbientMotion = 'playing' | 'paused' | 'reduced' | 'hidden' | 'offscreen'

export function getAmbientMotion({ paused, reduced, hidden, visible }: {
  paused: boolean; reduced: boolean; hidden: boolean; visible: boolean
}): AmbientMotion {
  if (reduced) return 'reduced'
  if (paused) return 'paused'
  if (hidden) return 'hidden'
  return visible ? 'playing' : 'offscreen'
}

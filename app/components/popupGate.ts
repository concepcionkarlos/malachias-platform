// Shared guard so a visitor sees at most ONE popup per session (booking modal or
// support toast — whichever fires first wins). Every storage access is wrapped:
// private windows and blocked site data make localStorage/sessionStorage throw.

const SESSION_KEY = 'malachias_popup_shown'

export function storageGet(store: 'local' | 'session', key: string): string | null {
  try {
    return (store === 'local' ? window.localStorage : window.sessionStorage).getItem(key)
  } catch {
    return null
  }
}

export function storageSet(store: 'local' | 'session', key: string, value: string): void {
  try {
    (store === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value)
  } catch {
    /* storage unavailable — nothing to persist */
  }
}

export function popupShownThisSession(): boolean {
  return storageGet('session', SESSION_KEY) === '1'
}

export function markPopupShown(): void {
  storageSet('session', SESSION_KEY, '1')
}

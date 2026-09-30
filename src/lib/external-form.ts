/** One destination for all lead-generation links. No on-page qualification. */
export function getExternalFormUrl(value: string | undefined = import.meta.env.VITE_FORM_URL): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}

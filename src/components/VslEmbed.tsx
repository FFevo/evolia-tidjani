import { useEffect, useRef } from 'react'

const vslId = '370ea4e2-5a0a-4b68-84dc-1b3f85342dd0'

export function VslEmbed() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = container.current
    if (!host) return

    // The provider inserts its player immediately after its own script.
    // Keep that DOM in a dedicated mount owned only by this effect.
    const mount = document.createElement('div')
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://ok-ko.io/vsl-embed.js'
    script.dataset.vslId = vslId
    script.addEventListener('load', () => {
      const iframe = mount.querySelector('iframe')
      if (iframe) iframe.title = 'Présentation de KAERON'
    }, { once: true })

    // StrictMode cancels its first setup before a script request is started.
    const frame = requestAnimationFrame(() => {
      host.appendChild(mount)
      mount.appendChild(script)
    })

    return () => {
      cancelAnimationFrame(frame)
      // Detach the whole mount so an in-flight script still has its parent.
      // Any late player initialization then stays outside the live page.
      mount.remove()
    }
  }, [])

  return <div className="hero-vsl" ref={container} role="region" aria-label="Présentation vidéo de KAERON" />
}

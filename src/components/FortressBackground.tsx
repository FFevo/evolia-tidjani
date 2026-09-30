import { useEffect, useId, useRef, useState } from 'react'
import { getAmbientMotion, type AmbientMotion } from '../lib/ambient-motion'

const wolf = 'M-43-48 L-20-26 H20 L43-48 L38-5 L21 13 L13 35 H-13 L-21 13 L-38-5 Z M-24-12 L-12-6 M24-12 L12-6 M-9 7 L0 15 L9 7 M0 15 V28'

/** Decorative stone relief. No canvas, pointer tracking or continuous JS loop. */
export function FortressBackground({ paused }: { paused: boolean }) {
  const id = `fortress-${useId().replace(/:/g, '')}`
  const host = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const sync = useRef<(() => void) | null>(null)
  const [motion, setMotion] = useState<AmbientMotion>('offscreen')
  pausedRef.current = paused
  useEffect(() => { sync.current?.() }, [paused])
  useEffect(() => {
    const element = host.current
    if (!element) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const bounds = element.getBoundingClientRect()
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight
    const update = () => setMotion(getAmbientMotion({ paused: pausedRef.current, reduced: preference.matches, hidden: document.hidden, visible }))
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      update()
    }, { threshold: 0 }) : null
    sync.current = update
    observer?.observe(element)
    preference.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      sync.current = null
      observer?.disconnect()
      preference.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return <div className="fortress-background" ref={host} data-motion={motion} aria-hidden="true">
    <svg className="fortress-relief fortress-desktop" viewBox="0 0 1440 860" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id={`${id}-stone`} x1="0" x2="1"><stop stopColor="#2a2520"/><stop offset=".7" stopColor="#211d19"/><stop offset="1" stopColor="#13110f"/></linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" x2="1"><stop stopColor="#776b59" stopOpacity=".08"/><stop offset=".48" stopColor="#d4a24c" stopOpacity=".27"/><stop offset="1" stopColor="#13110f" stopOpacity=".7"/></linearGradient>
        <linearGradient id={`${id}-arch`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#776b59" stopOpacity=".3"/><stop offset=".6" stopColor="#776b59" stopOpacity=".06"/><stop offset="1" stopColor="#776b59" stopOpacity="0"/></linearGradient>
        <radialGradient id={`${id}-glow`} cx=".68" cy=".1" r=".75"><stop stopColor="#70501b" stopOpacity=".35"/><stop offset="1" stopColor="#13110f" stopOpacity="0"/></radialGradient>
        <clipPath id={`${id}-wall`}><path d="M0 42 L240 4 L290 86 V860 H0Z"/></clipPath>
      </defs>
      <rect width="1440" height="860" fill={`url(#${id}-glow)`}/>
      <g className="fortress-vault" fill="none" stroke={`url(#${id}-arch)`}>
        <path d="M240 860V294C240 34 456-44 720-44S1200 34 1200 294V860" strokeWidth="60"/>
        <path d="M288 860V292C288 76 486 8 720 8S1152 76 1152 292V860" strokeWidth="1"/>
        <path d="M345 860V288C345 128 520 72 720 72S1095 128 1095 288V860" strokeWidth="1" opacity=".65"/>
        <path d="M440 33L480 87 M1000 33L960 87 M615 2L628 73 M825 2L812 73" opacity=".5"/>
      </g>
      <g className="fortress-walls">
        <g>
          <path d="M0 42L240 4L290 86V860H0Z" fill={`url(#${id}-stone)`}/>
          <path d="M240 4L290 86V860L246 860Z" fill={`url(#${id}-edge)`}/>
          <path d="M290 86L326 136V860H290Z" fill="#13110f"/>
          <path d="M240 5L290 86V860" fill="none" stroke="#d4a24c" strokeOpacity=".26"/>
          <g clipPath={`url(#${id}-wall)`} fill="none" stroke="#776b59" strokeOpacity=".18">
            <path d="M0 206L290 181 M0 387L290 376 M0 579H290 M0 773L290 788"/>
            <path d="M110 196V383 M184 380V580 M87 580V779" strokeOpacity=".11"/>
          </g>
          <path d="M172 123L189 121V240L172 243Z" fill="#13110f"/>
          <path d="M189 121V240L172 243" fill="none" stroke="#d4a24c" strokeOpacity=".2"/>
          <g className="fortress-wolf" transform="translate(132 493) scale(1.15)">
            <path d={wolf} fill="#13110f" fillOpacity=".3" stroke="#776b59" strokeWidth="1.1"/>
          </g>
        </g>
        <g transform="translate(1440 0) scale(-1 1)">
          <path d="M0 42L240 4L290 86V860H0Z" fill={`url(#${id}-stone)`}/>
          <path d="M240 4L290 86V860L246 860Z" fill={`url(#${id}-edge)`}/>
          <path d="M290 86L326 136V860H290Z" fill="#13110f"/>
          <path d="M240 5L290 86V860" fill="none" stroke="#d4a24c" strokeOpacity=".26"/>
          <g clipPath={`url(#${id}-wall)`} fill="none" stroke="#776b59" strokeOpacity=".18"><path d="M0 206L290 181 M0 387L290 376 M0 579H290 M0 773L290 788"/><path d="M110 196V383 M184 380V580 M87 580V779" strokeOpacity=".11"/></g>
          <path d="M172 123L189 121V240L172 243Z" fill="#13110f"/>
          <path d="M189 121V240L172 243" fill="none" stroke="#d4a24c" strokeOpacity=".2"/>
        </g>
      </g>
      <g fill="none" stroke="#776b59" strokeOpacity=".1"><path d="M326 714H1114 M0 860L486 714 M1440 860L954 714 M302 860L606 714 M1138 860L834 714"/></g>
    </svg>
    <svg className="fortress-relief fortress-compact" viewBox="0 0 420 920" preserveAspectRatio="none" focusable="false">
      <path d="M0 0H38L53 920H0Z M420 0H382L367 920H420Z" fill="#2a2520"/>
      <path d="M38 0L57 76L73 920H53Z M382 0L363 76L347 920H367Z" fill="#211d19"/>
      <g fill="none" stroke="#776b59" strokeOpacity=".22"><path d="M38 0L57 76L73 920 M382 0L363 76L347 920"/><path d="M12 920V172C12 44 92-16 210-16S408 44 408 172V920" strokeWidth="30" strokeOpacity=".11"/><path d="M58 920V166C58 73 122 20 210 20S362 73 362 166V920"/><path d="M0 260H42 M0 512H47 M0 767H51 M420 260H378 M420 512H373 M420 767H369" strokeOpacity=".13"/></g>
      <path d="M18 162V258 M402 162V258" stroke="#13110f" strokeWidth="5"/>
    </svg>
    <div className="fortress-light"/>
    <div className="fortress-haze"/>
  </div>
}

import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePageMotion(paused: boolean) {
  const pausedRef = useRef(paused)
  const syncPlayback = useRef<(() => void) | null>(null)
  useEffect(() => {
    pausedRef.current = paused
    syncPlayback.current?.()
  }, [paused])

  // React mounts after the browser's initial fragment lookup. Restore deep links
  // once the section exists, independently of animation and reduced-motion settings.
  useLayoutEffect(() => {
    let id: string
    try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
    const target = id && document.getElementById(id)
    if (!target || id === 'top') return
    const initialHash = window.location.hash
    let cancelled = false
    let frame = 0
    const cancel = () => { cancelled = true }
    const align = () => {
      if (!cancelled && window.location.hash === initialHash) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    }
    // Browser history restoration can run after React's layout effects.
    // Let that finish before aligning the fragment, unless the user takes over.
    const settle = () => {
      if (cancelled) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(align) })
    }
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    events.forEach(event => window.addEventListener(event, cancel, { passive: true }))
    window.addEventListener('pageshow', settle)
    window.addEventListener('load', settle)
    align()
    settle()
    document.fonts.ready.then(settle)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      events.forEach(event => window.removeEventListener(event, cancel))
      window.removeEventListener('pageshow', settle)
      window.removeEventListener('load', settle)
    }
  }, [])

  useEffect(() => {
    type MotionScope = {
      animations: Set<gsap.core.Animation>
      triggers: Set<ScrollTrigger>
      resume: Set<gsap.core.Animation>
      suspended: boolean
    }
    const scopes = new Set<MotionScope>()
    let alive = true
    let refreshFrame = 0
    const canMove = () => alive && !pausedRef.current && !document.hidden
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = 0
      if (!canMove() || !scopes.size) return
      // Native scrolling and layout changes settle before measuring. Refresh only
      // this hook's triggers; other components own their animation lifecycles.
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0
        if (!canMove()) return
        scopes.forEach(scope => {
          if (scope.suspended) return
          scope.triggers.forEach(trigger => trigger.refresh())
          scope.triggers.forEach(trigger => trigger.update())
        })
      })
    }
    const sync = () => {
      if (!canMove()) {
        cancelAnimationFrame(refreshFrame)
        refreshFrame = 0
      }
      let resumed = false
      scopes.forEach(scope => {
        if (!canMove() && !scope.suspended) {
          scope.suspended = true
          scope.animations.forEach(animation => {
            // Remember only animations that were actually running. A reveal
            // waiting for its ScrollTrigger must remain waiting after resume.
            if (!animation.paused() && animation.totalProgress() < 1) scope.resume.add(animation)
            animation.pause()
          })
          scope.triggers.forEach(trigger => trigger.disable(false, false))
        } else if (canMove() && scope.suspended) {
          scope.suspended = false
          scope.triggers.forEach(trigger => trigger.enable(false, false))
          scope.resume.forEach(animation => animation.resume())
          scope.resume.clear()
          resumed = true
        }
      })
      if (resumed) refresh()
    }
    syncPlayback.current = sync
    document.addEventListener('visibilitychange', sync)
    const media = gsap.matchMedia()
    try {
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      compact: '(max-width: 800px)',
    }, context => {
      if (!context.conditions?.motion) return
      const compact = context.conditions.compact
      const scope: MotionScope = { animations: new Set(), triggers: new Set(), resume: new Set(), suspended: false }
      scopes.add(scope)
      const own = <T extends gsap.core.Animation>(animation: T): T => {
        scope.animations.add(animation)
        if (animation.scrollTrigger) scope.triggers.add(animation.scrollTrigger)
        return animation
      }

      // Content is always opaque: motion must never gate a section's visibility.
      // Keep completed triggers until cleanup. Removing them during a deep-link
      // initialization can invalidate ScrollTrigger's in-progress refresh traversal.
      own(gsap.fromTo('.hero-content > :not(.hero-facts)', { y: 14 }, { y: 0, duration: .65, stagger: .045, ease: 'power3.out', clearProps: 'transform' }))
      own(gsap.fromTo('.hero h1 em', { '--line-progress': 0 }, { '--line-progress': 1, duration: 1.1, ease: 'power2.out' }))
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        own(gsap.fromTo(element, { y: 14 }, {
          y: 0, duration: .6, ease: 'power3.out', clearProps: 'transform',
          scrollTrigger: { trigger: element, start: 'top bottom', toggleActions: 'play none none none', fastScrollEnd: true },
        }))
      })
      gsap.utils.toArray<HTMLElement>('.phase-card').forEach(card => {
        const timeline = own(gsap.timeline({ scrollTrigger: { trigger: card, start: 'top bottom', toggleActions: 'play none none none', fastScrollEnd: true }, defaults: { duration: .65, ease: 'power3.out' } }))
        timeline.fromTo(card, { y: 16 }, { y: 0, clearProps: 'transform' })
        const sheets = card.querySelectorAll('.sample-sheet,.prompt-bubble,.review-bubble')
        timeline.fromTo(sheets, { y: 12 }, { y: 0, stagger: .09, clearProps: 'transform' }, '-=.45')
        const bars = card.querySelectorAll('.brief-field i')
        if (bars.length) timeline.fromTo(bars, { scaleX: .3 }, { scaleX: 1, stagger: .09 }, '-=.4')
        const chips = card.querySelectorAll('.brief-inputs span,.review-line')
        if (chips.length) timeline.fromTo(chips, { y: 6 }, { y: 0, stagger: .08, clearProps: 'transform' }, '-=.4')
        const layers = card.querySelectorAll('.project-layer')
        if (layers.length) timeline.fromTo(layers, { x: 0, y: 8, rotate: 0 }, { x: (i: number) => i ? -14 : 18, y: (i: number) => i ? -6 : -12, rotate: (i: number) => i ? -5 : 6, stagger: .1 }, '-=.4')
      })

      // Independent CSS translation keeps scroll depth separate from entry transforms.
      const parallax = (target: Element | string, trigger: Element | string, from: number, to: number, property = '--depth-shift') => {
        own(gsap.fromTo(target, { [property]: `${from}px` }, {
          [property]: `${to}px`, ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: .45, invalidateOnRefresh: true },
        }))
      }
      own(gsap.fromTo('.hero-content', { '--depth-shift': '0px' }, {
        '--depth-shift': compact ? '-14px' : '-32px', ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .45 },
      }))
      gsap.utils.toArray<HTMLElement>('.phase-visual').forEach(visual => {
        parallax(visual, visual.closest('.phase-card')!, compact ? 5 : 10, compact ? -5 : -10)
      })
      parallax('.learning-cards', '.experience-panel', compact ? 6 : 16, compact ? -6 : -16)
      parallax('.experience-panel', '.experience-panel', compact ? 3 : 8, compact ? -3 : -8, '--sheen-shift')
      if (!compact) parallax('.conversation-card', '.closing', 18, -18)
      own(gsap.fromTo('.header', { '--page-progress': 0 }, {
        '--page-progress': 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 },
      }))
      sync()
      refresh()
      return () => {
        // matchMedia reverts its own inline styles and triggers when motion is
        // reduced (including a preference changed while the page is open).
        scopes.delete(scope)
        scope.resume.clear()
        if (!scopes.size) {
          cancelAnimationFrame(refreshFrame)
          refreshFrame = 0
        }
      }
    })
    } catch (error) {
      // Optional motion must not take down the landing page if setup fails.
      media.revert()
      alive = false
      cancelAnimationFrame(refreshFrame)
      document.removeEventListener('visibilitychange', sync)
      syncPlayback.current = null
      console.warn('Les effets de mouvement sont indisponibles ; le contenu reste accessible.', error)
      return
    }

    document.fonts.ready.then(() => { if (alive) refresh() })
    window.addEventListener('pageshow', refresh)
    window.addEventListener('hashchange', refresh)
    // FAQ expansion changes the positions of the closing section and page end.
    document.addEventListener('toggle', refresh, true)
    return () => {
      alive = false
      cancelAnimationFrame(refreshFrame)
      window.removeEventListener('pageshow', refresh)
      window.removeEventListener('hashchange', refresh)
      document.removeEventListener('toggle', refresh, true)
      document.removeEventListener('visibilitychange', sync)
      syncPlayback.current = null
      media.revert()
    }
  }, [])
}

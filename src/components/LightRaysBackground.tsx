import { useEffect, useRef, useState } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { getAmbientMotion, type AmbientMotion } from '../lib/ambient-motion'

// Adapted from React Bits Light Rays (MIT):
// https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/LightRays/LightRays.jsx
// Its small OGL renderer is kept; the lifecycle below adds pause/reduced-motion fallbacks.
const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 rayPos;
uniform vec2 rayDir;
uniform vec3 raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float fadeDistance;
uniform float noiseAmount;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float spreadFactor = pow(max(cosAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0
  );
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor;
}
void main() {
  vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, rayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, rayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
  vec4 color = rays1 * 0.5 + rays2 * 0.4;
  float n = noise(coord * 0.01 + iTime * 0.1);
  color.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  float brightness = 1.0 - (coord.y / iResolution.y);
  color.r *= 0.1 + brightness * 0.8;
  color.g *= 0.3 + brightness * 0.6;
  color.b *= 0.5 + brightness * 0.5;
  color.rgb *= raysColor * 1.7;
  color.a = clamp(color.a * 1.25, 0.0, 1.0);
  gl_FragColor = color;
}`

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

export function LightRaysBackground({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const sync = useRef<(() => void) | null>(null)
  const [motion, setMotion] = useState<AmbientMotion>('offscreen')
  const [mobile, setMobile] = useState(false)
  const [failed, setFailed] = useState(false)
  pausedRef.current = paused

  useEffect(() => { sync.current?.() }, [paused])
  useEffect(() => {
    const element = host.current
    if (!element) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia('(max-width: 800px)')
    const bounds = element.getBoundingClientRect()
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight
    const update = () => {
      setMobile(compact.matches)
      setMotion(getAmbientMotion({ paused: pausedRef.current, reduced: preference.matches, hidden: document.hidden, visible }))
    }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      update()
    }, { threshold: 0 }) : null
    sync.current = update
    observer?.observe(element)
    preference.addEventListener('change', update)
    compact.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      sync.current = null
      observer?.disconnect()
      preference.removeEventListener('change', update)
      compact.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useEffect(() => {
    const element = host.current
    if (!element || motion !== 'playing' || failed) return
    let renderer: Renderer | undefined
    let frame = 0
    let lastFrame = 0
    let resizeObserver: ResizeObserver | undefined
    let program: Program | undefined
    let geometry: Triangle | undefined
    let canvas: HTMLCanvasElement | undefined
    let onContextLoss: ((event: Event) => void) | undefined
    let stopped = false

    try {
      renderer = new Renderer({ alpha: true, depth: false, stencil: false, antialias: false, powerPreference: 'low-power', dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2) })
      canvas = renderer.gl.canvas
      canvas.setAttribute('aria-hidden', 'true')
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'
      element.appendChild(canvas)

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: [212 / 255, 162 / 255, 76 / 255] },
        raysSpeed: { value: 0.35 },
        lightSpread: { value: mobile ? 0.85 : 0.7 },
        rayLength: { value: mobile ? 4 : 2.5 },
        fadeDistance: { value: mobile ? 1.5 : 1.3 },
        noiseAmount: { value: 0.025 },
      }
      program = new Program(renderer.gl, { vertex: vertexShader, fragment: fragmentShader, uniforms, depthTest: false, depthWrite: false })
      geometry = new Triangle(renderer.gl)
      const scene = new Mesh(renderer.gl, { geometry, program })
      const resize = () => {
        if (!renderer) return
        const width = element.clientWidth
        const height = element.clientHeight
        if (!width || !height) return
        renderer.setSize(width, height)
        const actualWidth = renderer.gl.canvas.width
        const actualHeight = renderer.gl.canvas.height
        uniforms.iResolution.value = [actualWidth, actualHeight]
        uniforms.rayPos.value = [mobile ? actualWidth * 1.1 : actualWidth, -0.2 * actualHeight]
      }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(element)
      resize()
      onContextLoss = (event: Event) => {
        event.preventDefault()
        setFailed(true)
      }
      canvas.addEventListener('webglcontextlost', onContextLoss, { once: true })

      const loop = (time: number) => {
        if (stopped || !renderer) return
        frame = requestAnimationFrame(loop)
        if (time - lastFrame < 32) return
        lastFrame = time
        uniforms.iTime.value = time * 0.001
        try { renderer.render({ scene }) } catch { setFailed(true) }
      }
      frame = requestAnimationFrame(loop)
    } catch {
      setFailed(true)
    }
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      if (canvas && onContextLoss) canvas.removeEventListener('webglcontextlost', onContextLoss)
      program?.remove()
      geometry?.remove()
      renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas?.remove()
    }
  }, [motion, mobile, failed])

  return <div className="light-rays-background" ref={host} data-motion={motion} data-fallback={failed || motion === 'reduced' ? 'true' : undefined} aria-hidden="true" />
}

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

interface Pencil {
  x: number
  y: number
  speed: number
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Animation setup
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.4 })
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }, 0.6)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }, 0.75)
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.2)

    return () => { tl.kill() }
  }, [])

  // Canvas effect
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let elapsedTime = 0
    let lastTimestamp = 0

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const pencils: Pencil[] = []

    const isMobile = window.innerWidth < 768
    const gridSpacing = isMobile ? 21 : 14
    const pencilCount = isMobile ? 20 : 30

    const WAVE_AMPLITUDE = 8
    const WAVE_FREQUENCY = 0.05
    const ANIMATION_SPEED = 0.5
    const MOUSE_RADIUS = 150
    const MOUSE_STRENGTH = 0.3
    const MOUSE_LERP = 0.1
    const PENCIL_SPEED = 0.3
    const PENCIL_LENGTH = 40

    function waveFunction(x: number, y: number, time: number): number {
      return Math.sin(x * WAVE_FREQUENCY + time) * Math.cos(y * WAVE_FREQUENCY + time) * WAVE_AMPLITUDE
    }

    function mouseInfluence(mx: number, my: number, gx: number, gy: number, waveValue: number): number {
      const dx = gx - mx
      const dy = gy - my
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < MOUSE_RADIUS) {
        const influence = Math.pow(1 - distance / MOUSE_RADIUS, 2) * MOUSE_STRENGTH
        return waveValue + influence * 20
      }
      return waveValue
    }

    function initPencils() {
      pencils.length = 0
      const rect = container!.getBoundingClientRect()
      for (let i = 0; i < pencilCount; i++) {
        pencils.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          speed: PENCIL_SPEED + Math.random() * 0.2,
        })
      }
    }

    function resize() {
      const rect = container!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.scale(dpr, dpr)
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    function render(timestamp: number) {
      if (!ctx || !canvas) return

      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16
      lastTimestamp = timestamp
      elapsedTime += deltaTime * 0.001 * ANIMATION_SPEED

      // Smooth mouse
      mouse.x += (mouse.targetX - mouse.x) * MOUSE_LERP
      mouse.y += (mouse.targetY - mouse.y) * MOUSE_LERP

      const rect = container!.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Clear
      ctx.fillStyle = '#0B1F3A'
      ctx.fillRect(0, 0, width, height)

      const cols = Math.ceil(width / gridSpacing) + 1
      const rows = Math.ceil(height / gridSpacing) + 1

      // Render dots
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gridX = col * gridSpacing
          const gridY = row * gridSpacing

          let waveValue = waveFunction(gridX, gridY, elapsedTime)
          waveValue = mouseInfluence(mouse.x, mouse.y, gridX, gridY, waveValue)

          const normalizedWave = Math.max(-1, Math.min(1, waveValue / WAVE_AMPLITUDE))
          const screenX = gridX
          const screenY = gridY + waveValue
          const radius = 1.5 + (normalizedWave + 1) * 1.5
          const alpha = 0.15 + (normalizedWave + 1) * 0.25

          ctx.beginPath()
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fill()
        }
      }

      // Render pencils (golden lines)
      for (const pencil of pencils) {
        pencil.x += pencil.speed
        if (pencil.x > width + 50) {
          pencil.x = -50
          pencil.y = Math.random() * height
        }

        let waveY = waveFunction(pencil.x, pencil.y, elapsedTime)
        waveY = mouseInfluence(mouse.x, mouse.y, pencil.x, pencil.y, waveY)

        const normalizedWave = Math.max(-1, Math.min(1, waveY / WAVE_AMPLITUDE))
        const screenY = pencil.y + waveY
        const alpha = 0.2 + (normalizedWave + 1) * 0.3

        const startY = screenY - PENCIL_LENGTH / 2
        const endY = screenY + PENCIL_LENGTH / 2

        // Draw line segment
        ctx.beginPath()
        ctx.moveTo(pencil.x, startY)
        ctx.lineTo(pencil.x, endY)
        ctx.strokeStyle = `rgba(201, 162, 39, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw caps
        const capRadius = 1 + (normalizedWave + 1) * 1
        const capAlpha = 0.3 + (normalizedWave + 1) * 0.3

        ctx.beginPath()
        ctx.arc(pencil.x, startY, capRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${capAlpha})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(pencil.x, endY, capRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${capAlpha})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(render)
    }

    const ro = new ResizeObserver(() => {
      resize()
      initPencils()
    })
    ro.observe(container)

    canvas.addEventListener('mousemove', handleMouseMove)
    resize()
    initPencils()
    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleCTAClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.querySelector('#apply')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleLearnMoreClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.querySelector('#about')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-navy overflow-hidden"
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Animated mathematical wave visualization"
      />

      {/* Gradient Overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(11,31,58,0.88) 0%, rgba(11,31,58,0.55) 45%, transparent 75%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-16 max-w-3xl">
        <div
          ref={labelRef}
          className="opacity-0 translate-y-5 mb-4 sm:mb-6"
        >
          <span className="font-body text-xs sm:text-sm uppercase tracking-[0.15em] text-gold/90">
            Campus Ambassador Program
          </span>
        </div>

        <h1 className="font-heading font-bold text-offwhite leading-[0.95] tracking-[-0.03em] mb-6 sm:mb-8">
          <div
            ref={line1Ref}
            className="opacity-0 translate-y-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            Shape the Future
          </div>
          <div
            ref={line2Ref}
            className="opacity-0 translate-y-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            of Quant Finance
          </div>
        </h1>

        <p
          ref={subRef}
          className="opacity-0 translate-y-5 font-body text-base sm:text-lg text-offwhite/80 max-w-xl leading-relaxed mb-8"
        >
          Join a nationwide network of student ambassadors bringing algorithmic
          trading and quantitative research culture to campuses across India.
        </p>

        <div
          ref={ctaRef}
          className="opacity-0 translate-y-4 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#apply"
            onClick={handleCTAClick}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gold text-navy font-body text-sm font-semibold rounded-full hover:bg-gold-light hover:scale-[1.04] transition-all duration-300 shadow-glow"
          >
            Apply Now
          </a>
          <a
            href="#about"
            onClick={handleLearnMoreClick}
            className="inline-flex items-center justify-center px-8 py-3.5 border border-offwhite/30 text-offwhite font-body text-sm font-medium rounded-full hover:border-gold hover:text-gold transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* E-Cell Collaboration Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white/5 flex items-center justify-center z-10">
        <span className="font-body text-xs text-offwhite/50">
          In Collaboration with E-Cell MNIT
        </span>
      </div>
    </section>
  )
}

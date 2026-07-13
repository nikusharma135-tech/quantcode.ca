import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Motive() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineTopRef = useRef<HTMLDivElement>(null)
  const lineBottomRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const attrRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    // Gold lines scale in from center
    if (lineTopRef.current) {
      gsap.set(lineTopRef.current, { scaleX: 0 })
      tl.to(lineTopRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0)
    }
    if (lineBottomRef.current) {
      gsap.set(lineBottomRef.current, { scaleX: 0 })
      tl.to(lineBottomRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0)
    }

    // Label
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 15 })
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
    }

    // Quote - word by word stagger
    if (quoteRef.current) {
      gsap.set(quoteRef.current, { opacity: 0, y: 10 })
      tl.to(quoteRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.4)
    }

    // Attribution
    if (attrRef.current) {
      gsap.set(attrRef.current, { opacity: 0, y: 10 })
      tl.to(attrRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-navy py-24 sm:py-32 lg:py-36"
    >
      {/* Top gold line */}
      <div
        ref={lineTopRef}
        className="absolute top-0 left-[8vw] right-[8vw] h-px bg-gold/30 origin-center"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span
          ref={labelRef}
          className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-8"
        >
          Our Mission
        </span>

        <blockquote
          ref={quoteRef}
          className="font-heading text-xl sm:text-2xl lg:text-[1.75rem] font-medium italic text-offwhite leading-relaxed mb-6"
        >
          "Quant finance in India is concentrated in a handful of campuses. This
          program exists to close that gap — one ambassador, one campus at a
          time."
        </blockquote>

        <p
          ref={attrRef}
          className="font-body text-sm text-offwhite/60"
        >
          — QUANTΣODE Core Team
        </p>
      </div>

      {/* Bottom gold line */}
      <div
        ref={lineBottomRef}
        className="absolute bottom-0 left-[8vw] right-[8vw] h-px bg-gold/30 origin-center"
      />
    </section>
  )
}

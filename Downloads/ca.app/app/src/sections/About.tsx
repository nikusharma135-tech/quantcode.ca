import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  'Founded at MNIT Jaipur',
  'Flagship: Summer of Quant',
  'Industry Advisory Council',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const elements = [labelRef.current, headingRef.current, bodyRef.current, chipsRef.current]
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    elements.forEach((el, i) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 30 })
        tl.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, i * 0.1)
      }
    })

    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, y: 20 })
      tl.to(imageRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.2)
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <div>
            <span
              ref={labelRef}
              className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4"
            >
              About
            </span>

            <h2
              ref={headingRef}
              className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em] mb-6"
            >
              Quant Culture, Built by Students
            </h2>

            <p
              ref={bodyRef}
              className="font-body text-base sm:text-lg text-charcoal leading-relaxed mb-8"
            >
              QUANTΣODE is a student-led quant finance and algorithmic trading
              club at MNIT Jaipur. We run flagship programs — the Quantitative
              Finance Practitioner course, Summer of Quant, and Winter of Quant —
              to close the gap between academic theory and industry practice.
              ARBITREX, our algorithmic trading initiative, is proof of what
              student-driven research can achieve.
            </p>

            <div ref={chipsRef} className="flex flex-wrap gap-3">
              {stats.map((stat) => (
                <span
                  key={stat}
                  className="inline-flex items-center px-5 py-2 border border-navy/15 rounded-full font-body text-sm text-charcoal"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div ref={imageRef} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="./images/about-lab.jpg"
              alt="Students working in a modern computing lab with financial charts on screens"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

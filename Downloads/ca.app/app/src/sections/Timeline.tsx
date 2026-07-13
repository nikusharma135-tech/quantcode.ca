import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '1',
    title: 'Apply',
    desc: 'Submit the application form with your details and a brief statement of interest.',
  },
  {
    num: '2',
    title: 'Screening',
    desc: 'Applications reviewed by the QUANTΣODE team. Shortlisted candidates may be invited for a brief interview.',
  },
  {
    num: '3',
    title: 'Onboarding',
    desc: 'Selected ambassadors attend an orientation session covering responsibilities, tools, and resources.',
  },
  {
    num: '4',
    title: 'Go Live',
    desc: 'Start representing QUANTΣODE on your campus with full access to resources and support.',
  },
]

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])

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

    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
    }

    // Line draws in
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0 })
      tl.to(lineRef.current, { scaleX: 1, duration: 1, ease: 'power2.out' }, 0.2)
    }

    // Nodes pop in
    nodesRef.current.forEach((node, i) => {
      if (node) {
        gsap.set(node, { opacity: 0, scale: 0 })
        tl.to(node, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 0.35 + i * 0.15)
      }
    })

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#EFEEE9] py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={headerRef} className="mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Selection Process
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em]">
            Four Steps to Becoming an Ambassador
          </h2>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div
            ref={lineRef}
            className="absolute top-7 left-0 right-0 h-0.5 bg-navy/15 origin-left"
          />

          <div className="grid grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={step.num} className="text-center">
                {/* Node */}
                <div
                  ref={(el) => { nodesRef.current[i] = el }}
                  className="w-14 h-14 rounded-full bg-offwhite border-2 border-gold flex items-center justify-center mx-auto mb-5 relative z-10"
                >
                  <span className="font-heading text-xl font-bold text-navy">
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-navy mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-charcoal leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-navy/15" />

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-5 relative">
                {/* Node */}
                <div className="w-14 h-14 rounded-full bg-offwhite border-2 border-gold flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="font-heading text-xl font-bold text-navy">
                    {step.num}
                  </span>
                </div>

                <div className="pt-2">
                  <h3 className="font-heading text-lg font-semibold text-navy mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-charcoal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

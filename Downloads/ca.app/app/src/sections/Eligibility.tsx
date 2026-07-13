import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const items = [
  'Currently enrolled in a full-time undergraduate or postgraduate program at any recognized Indian college or university',
  'Strong written and verbal communication skills',
  'Active on campus — involved in student societies, clubs, or departmental activities',
  'Interest in finance, mathematics, programming, or data science (prior quant experience not required)',
  'Commitment of 4–6 hours per week throughout the program duration',
]

export default function Eligibility() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

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

    itemsRef.current.forEach((item, i) => {
      if (item) {
        gsap.set(item, { opacity: 0, x: -20 })
        tl.to(item, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.2 + i * 0.1)
      }
    })

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-offwhite py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-10">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Eligibility
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em]">
            Who Can Apply
          </h2>
        </div>

        <div className="space-y-5">
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemsRef.current[i] = el }}
              className="flex items-start gap-4"
            >
              <CheckCircle
                className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <p className="font-body text-base sm:text-[17px] text-charcoal leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

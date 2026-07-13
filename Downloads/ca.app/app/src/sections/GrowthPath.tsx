import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const paths = [
  {
    num: '01',
    title: 'Lead Ambassador',
    desc: 'Top-performing ambassadors may be promoted to Lead Ambassador, coordinating a cluster of 3–5 campuses and mentoring new joins.',
  },
  {
    num: '02',
    title: 'Core Team Track',
    desc: 'Demonstrated commitment and impact open a pathway to join the QUANTΣODE core organizing team.',
  },
  {
    num: '03',
    title: 'Future Opportunities',
    desc: 'Your growth is tied to what you build, not tenure. Outstanding ambassadors receive direct referrals to our industry advisory network.',
  },
]

export default function GrowthPath() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const closingRef = useRef<HTMLParagraphElement>(null)

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

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.set(card, { opacity: 0, y: 20 })
        tl.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.15 + i * 0.12)
      }
    })

    if (closingRef.current) {
      gsap.set(closingRef.current, { opacity: 0, y: 15 })
      tl.to(closingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.6)
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-navy py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={headerRef} className="mb-12">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Growth Path
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-offwhite leading-tight tracking-[-0.02em]">
            Where This Leads
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {paths.map((item, i) => (
            <div
              key={item.num}
              ref={(el) => { cardsRef.current[i] = el }}
            >
              <span className="font-heading text-5xl font-bold text-gold/40 mb-4 block">
                {item.num}
              </span>

              <h3 className="font-heading text-xl sm:text-[22px] font-semibold text-offwhite mb-3">
                {item.title}
              </h3>

              <p className="font-body text-[15px] text-offwhite/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          ref={closingRef}
          className="mt-12 text-center font-body text-sm italic text-offwhite/50"
        >
          Growth is tied to what ambassadors build, not tenure or time served.
        </p>
      </div>
    </section>
  )
}

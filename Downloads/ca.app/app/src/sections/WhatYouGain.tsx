import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, BookOpen, Network, Star, FileText } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
  {
    icon: Award,
    title: 'Certificate of Recognition',
    desc: 'A formal certificate issued by QUANTΣODE acknowledging your contribution as a Campus Ambassador.',
  },
  {
    icon: BookOpen,
    title: 'Program Access',
    desc: 'Priority access and potential fee waivers to QUANTΣODE flagship programs and courses.',
  },
  {
    icon: Network,
    title: 'Network Access',
    desc: 'Direct access to our advisory council, industry mentors, and the broader quant community.',
  },
  {
    icon: Star,
    title: 'Public Recognition',
    desc: 'Featured mentions on our website, LinkedIn, and program communications.',
  },
  {
    icon: FileText,
    title: 'Resume Credential',
    desc: 'A credible, quantifiable leadership experience for your resume and graduate school applications.',
  },
]

export default function WhatYouGain() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

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

    if (noteRef.current) {
      gsap.set(noteRef.current, { opacity: 0, y: 20 })
      tl.to(noteRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.15)
    }

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.set(card, { opacity: 0, scale: 0.95 })
        tl.to(card, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.25 + i * 0.1)
      }
    })

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-navy py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={headerRef}>
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Benefits
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-offwhite leading-tight tracking-[-0.02em] mb-6">
            What You Gain
          </h2>
        </div>

        <p
          ref={noteRef}
          className="font-body text-base italic text-offwhite/70 leading-relaxed max-w-3xl mb-12"
        >
          QUANTΣODE is a student-led, self-funded community. We cannot offer
          monetary compensation. What we offer instead is meaningful,
          career-shaping value.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                ref={(el) => { cardsRef.current[i] = el }}
                className="bg-white/5 border border-gold/20 rounded-lg p-6 sm:p-8 hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>

                <h3 className="font-heading text-lg font-semibold text-offwhite mb-2">
                  {item.title}
                </h3>

                <p className="font-body text-sm text-offwhite/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

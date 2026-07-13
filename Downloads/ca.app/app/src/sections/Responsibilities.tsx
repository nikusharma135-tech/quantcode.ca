import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Megaphone, Users, Target, Share2, MessageSquare, HeartHandshake } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const responsibilities = [
  {
    icon: Megaphone,
    title: 'Outreach & Promotion',
    desc: 'Spread awareness about QUANTΣODE programs through social media, college forums, and word-of-mouth.',
  },
  {
    icon: Users,
    title: 'Local Sessions',
    desc: 'Organize workshops, info sessions, and study circles on quant finance topics at your campus.',
  },
  {
    icon: Target,
    title: 'Program Recruitment',
    desc: 'Identify and recruit students for our flagship programs: Summer of Quant, Winter of Quant, and the QF Practitioner course.',
  },
  {
    icon: Share2,
    title: 'Content Amplification',
    desc: 'Share QUANTΣODE content, research, and event updates across your campus networks.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback Loop',
    desc: 'Collect feedback from participants and relay insights to help us improve program quality.',
  },
  {
    icon: HeartHandshake,
    title: 'Community Building',
    desc: 'Create and sustain a local quant community that outlasts any single program cycle.',
  },
]

export default function Responsibilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
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

    // Header
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 })
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
    }

    // Cards stagger
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.set(card, { opacity: 0, y: 40 })
        tl.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.15 + i * 0.08)
      }
    })

    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="responsibilities"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={headerRef} className="mb-12">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Responsibilities
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em] mb-4">
            What You'll Do
          </h2>

          <p className="font-body text-base sm:text-lg text-charcoal leading-relaxed max-w-3xl">
            Six core areas of focus. Each responsibility is designed to build
            skills that matter in quant finance — outreach, teaching, community
            building, and feedback-driven iteration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {responsibilities.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                ref={(el) => { cardsRef.current[i] = el }}
                className="group bg-white rounded-lg p-6 sm:p-8 border border-navy/5 hover:border-gold/20 hover:shadow-lg transition-all duration-300"
              >
                {/* Gold top line */}
                <div className="w-full h-0.5 bg-gold mb-6 rounded-full" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-navy mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-charcoal leading-relaxed">
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

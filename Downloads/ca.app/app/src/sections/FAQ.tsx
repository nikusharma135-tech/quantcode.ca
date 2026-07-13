import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus, Minus } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'Is this a paid position?',
    a: 'No. The Campus Ambassador Program is unpaid. QUANTΣODE is a student-led, self-funded community. The value lies in learning, networking, and resume-building.',
  },
  {
    q: 'Do I need prior experience in quant finance?',
    a: 'No prior experience is required. Interest in finance, mathematics, programming, or data science is sufficient.',
  },
  {
    q: 'I am not from MNIT Jaipur. Can I apply?',
    a: 'Yes. This program is open to students from any recognized college or university in India.',
  },
  {
    q: 'How much time will this require?',
    a: 'We expect a commitment of 4–6 hours per week throughout the program duration.',
  },
  {
    q: 'When will I hear back after applying?',
    a: 'Applications are reviewed on a rolling basis. Shortlisted candidates are typically contacted within 2–3 weeks.',
  },
]

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="border-b border-navy/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-base sm:text-[17px] font-semibold text-navy pr-4 group-hover:text-navy-light transition-colors duration-200">
          {item.q}
        </span>
        <span className="flex-shrink-0 text-gold">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 200}px` : '0px',
        }}
      >
        <p className="font-body text-[15px] text-charcoal leading-relaxed pb-5">
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

    if (listRef.current) {
      const items = listRef.current.children
      gsap.set(items, { opacity: 0, y: 15 })
      tl.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 0.15)
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-10">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            FAQ
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em]">
            Common Questions
          </h2>
        </div>

        <div ref={listRef}>
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

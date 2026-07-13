import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TrendingUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Sample data for demo
const sampleLeaderboard = [
  { rank: 1, name: 'A. Sharma', college: 'IIT Delhi', referrals: 12 },
  { rank: 2, name: 'K. Patel', college: 'BITS Pilani', referrals: 9 },
  { rank: 3, name: 'R. Gupta', college: 'NIT Trichy', referrals: 7 },
  { rank: 4, name: 'S. Reddy', college: 'IIIT Hyderabad', referrals: 5 },
  { rank: 5, name: 'M. Khan', college: 'MNIT Jaipur', referrals: 4 },
]

export default function ReferralLeaderboard() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [leaderboard] = useState(sampleLeaderboard)

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
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
    }

    if (tableRef.current) {
      gsap.set(tableRef.current, { opacity: 0, y: 30 })
      tl.to(tableRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.2)
    }

    return () => { tl.kill() }
  }, [])

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-gold font-bold text-lg'
    if (rank === 2) return 'text-gold/80 font-bold'
    if (rank === 3) return 'text-gold/60 font-bold'
    return 'text-charcoal font-medium'
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-offwhite py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={headerRef} className="mb-10">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Referral Program
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em] mb-4">
            Track Your Impact
          </h2>

          <p className="font-body text-base sm:text-lg text-charcoal leading-relaxed max-w-2xl">
            Every approved ambassador receives a unique referral code to share
            with peers. Track sign-ups and see how your network grows.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div
          ref={tableRef}
          className="max-w-3xl mx-auto rounded-lg overflow-hidden border border-navy/10"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_1fr_100px] bg-navy text-offwhite">
            <div className="px-4 py-3 font-body text-xs uppercase tracking-[0.06em] font-medium">
              Rank
            </div>
            <div className="px-4 py-3 font-body text-xs uppercase tracking-[0.06em] font-medium">
              Ambassador
            </div>
            <div className="px-4 py-3 font-body text-xs uppercase tracking-[0.06em] font-medium hidden sm:block">
              College
            </div>
            <div className="px-4 py-3 font-body text-xs uppercase tracking-[0.06em] font-medium text-right">
              Referrals
            </div>
          </div>

          {/* Table Rows */}
          {leaderboard.map((entry, i) => (
            <div
              key={entry.rank}
              className={`grid grid-cols-[80px_1fr_1fr_100px] ${
                i % 2 === 0 ? 'bg-white' : 'bg-offwhite'
              } hover:bg-gold/5 transition-colors duration-200`}
            >
              <div className={`px-4 py-4 font-heading ${getRankStyle(entry.rank)}`}>
                {entry.rank}
              </div>
              <div className="px-4 py-4 font-body text-[15px] text-charcoal">
                {entry.name}
              </div>
              <div className="px-4 py-4 font-body text-sm text-charcoal/70 hidden sm:block">
                {entry.college}
              </div>
              <div className="px-4 py-4 font-body text-[15px] text-charcoal text-right flex items-center justify-end gap-1.5">
                <TrendingUp className="w-4 h-4 text-gold" strokeWidth={2} />
                {entry.referrals}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 font-body text-sm text-charcoal/50">
          Referrals are for program sign-ups and awareness, not sales.
        </p>
      </div>
    </section>
  )
}

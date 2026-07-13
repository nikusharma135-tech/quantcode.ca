import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WhoIsCA() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

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

    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 30 })
      tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
    }

    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, y: 20 })
      tl.to(imageRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.2)
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#EFEEE9] py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div ref={textRef} className="mb-10">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            The Role
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em] mb-5">
            You Are the Bridge
          </h2>

          <p className="font-body text-base sm:text-lg text-charcoal leading-relaxed max-w-3xl">
            A Campus Ambassador is the connection point between your college and
            QUANTΣODE. You represent our mission on the ground — identifying
            talent, hosting sessions, and building a local quant community from
            scratch.
          </p>
        </div>

        <div
          ref={imageRef}
          className="rounded-lg overflow-hidden shadow-md"
        >
          <img
            src="./images/campus-aerial.jpg"
            alt="Aerial view of a modern university campus with students walking along pathways"
            className="w-full h-56 sm:h-72 lg:h-[360px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

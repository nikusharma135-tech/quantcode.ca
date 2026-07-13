import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Linkedin, MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Program', href: '#responsibilities' },
  { label: 'Apply', href: '#apply' },
  { label: 'FAQ', href: '#faq' },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    gsap.set(footer.children, { opacity: 0 })
    const anim = gsap.to(footer.children, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    })

    return () => { anim.kill() }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="w-full bg-navy py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Column 1: Brand */}
          <div>
            <span className="font-body text-sm font-bold uppercase tracking-[0.12em] text-offwhite mb-4 block">
              QUANT<span className="text-gold text-base">Σ</span>ODE
            </span>
            <div className="flex items-start gap-2 text-offwhite/60">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm leading-relaxed">
                Malaviya National Institute of Technology, Jaipur
              </p>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="font-heading text-base font-semibold text-offwhite mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:quantcode@mnit.ac.in"
                className="flex items-center gap-2 font-body text-sm text-offwhite/60 hover:text-gold transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                quantcode@mnit.ac.in
              </a>
              <a
                href="https://linkedin.com/company/quantcode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm text-offwhite/60 hover:text-gold transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="font-heading text-base font-semibold text-offwhite mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="block font-body text-sm text-offwhite/60 hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-offwhite/10 my-10" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-offwhite/40">
            2025 QUANTΣODE. All rights reserved.
          </p>

          {/* E-Cell Collaboration */}
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-offwhite/40">
              In Collaboration with
            </span>
            <img
              src="./images/ecell-logo.png"
              alt="E-Cell MNIT Logo"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

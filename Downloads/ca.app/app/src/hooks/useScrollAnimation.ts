import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationOptions {
  y?: number
  x?: number
  opacity?: number
  scale?: number
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  start?: string
  childSelector?: string
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 30,
      x = 0,
      opacity = 0,
      scale = 1,
      duration = 0.7,
      delay = 0,
      stagger = 0,
      ease = 'power2.out',
      start = 'top 85%',
      childSelector,
    } = options

    const targets = childSelector ? el.querySelectorAll(childSelector) : el

    gsap.set(targets, { y, x, opacity, scale })

    const anim = gsap.to(targets, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger: stagger || undefined,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    })

    return () => {
      anim.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [])

  return ref
}

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Copy, CheckCircle, Mail, Send, ShieldCheck } from 'lucide-react'
import { supabase, generateUniqueReferralCode } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+']

interface FormData {
  fullName: string
  email: string
  college: string
  year: string
  branch: string
  phone: string
  linkedin: string
}

export default function ApplyForm() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    college: '',
    year: '',
    branch: '',
    phone: '',
    linkedin: '',
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

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

    if (formRef.current) {
      const fields = formRef.current.querySelectorAll('.form-field')
      gsap.set(fields, { opacity: 0, y: 20 })
      tl.to(fields, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0.15)
    }

    return () => { tl.kill() }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
      setError('')
    },
    []
  )

  const handleSendOTP = useCallback(async () => {
    if (!formData.email) {
      setError('Please enter your email first.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: true },
      })
      if (error) {
        setError('Failed to send OTP. Please try again.')
        return
      }
      setOtpSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }, [formData.email])

  const handleVerifyOTP = useCallback(async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otpCode,
        type: 'email',
      })
      if (error) {
        setError('Invalid OTP. Please check and try again.')
        return
      }
      setOtpVerified(true)
      setError('')
    } catch {
      setError('Verification failed. Please try again.')
    }
  }, [formData.email, otpCode])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!otpVerified) {
        setError('Please verify your email with OTP before submitting.')
        return
      }

      // Validate required fields
      const required: (keyof FormData)[] = ['fullName', 'email', 'college', 'year', 'branch', 'phone']
      for (const field of required) {
        if (!formData[field]) {
          setError(`Please fill in all required fields.`)
          return
        }
      }

      setIsSubmitting(true)
      setError('')

      try {
        // Generate unique referral code
        const code = await generateUniqueReferralCode()

        // Insert into ambassadors table
        const { error: insertError } = await supabase.from('ambassadors').insert({
          name: formData.fullName,
          email: formData.email,
          college: formData.college,
          year: formData.year,
          branch: formData.branch,
          phone: formData.phone,
          linkedin: formData.linkedin || null,
          referral_code: code,
          verified: true,
        })

        if (insertError) {
          if (insertError.code === '23505') {
            setError('You have already registered with this email.')
          } else {
            setError('Registration failed. Please try again.')
          }
          setIsSubmitting(false)
          return
        }

        setReferralCode(code)
        const baseUrl = window.location.origin + window.location.pathname
        setReferralLink(`${baseUrl}?ref=${code}`)
        setSubmitted(true)
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [otpVerified, formData]
  )

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [referralLink])

  // Success state
  if (submitted) {
    return (
      <section
        id="apply"
        ref={sectionRef}
        className="w-full bg-[#EFEEE9] py-20 sm:py-28 lg:py-32"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" strokeWidth={1.5} />

          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-navy leading-tight tracking-[-0.02em] mb-4">
            Welcome to the Network
          </h2>

          <p className="font-body text-base text-charcoal mb-8">
            Your application has been received. We will review it and get back to you within 2–3 weeks.
          </p>

          {/* Referral Code */}
          <div className="bg-white rounded-lg p-6 border border-navy/10 mb-4">
            <p className="font-body text-sm text-charcoal/70 mb-2">
              Your unique referral code:
            </p>
            <code className="font-mono text-2xl sm:text-3xl font-bold text-gold tracking-wider">
              {referralCode}
            </code>
          </div>

          {/* Shareable Link */}
          <div className="bg-white rounded-lg p-6 border border-navy/10">
            <p className="font-body text-sm text-charcoal/70 mb-3">
              Share your link:
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-sm text-navy bg-offwhite px-4 py-3 rounded-md truncate">
                {referralLink}
              </code>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-5 py-3 bg-navy text-offwhite rounded-md font-body text-sm font-medium hover:bg-navy-light transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="apply"
      ref={sectionRef}
      className="w-full bg-[#EFEEE9] py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-10">
          <span className="inline-block font-body text-xs uppercase tracking-[0.12em] text-gold mb-4">
            Apply Now
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-navy leading-tight tracking-[-0.02em] mb-3">
            Start Your Journey
          </h2>

          <p className="font-body text-sm text-charcoal/70">
            Application deadline: <span className="font-medium">To be announced</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-body text-sm text-red-700">{error}</p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="form-field">
            <label htmlFor="fullName" className="block font-body text-sm font-medium text-charcoal mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
              placeholder="Your full name"
            />
          </div>

          {/* Email + OTP */}
          <div className="form-field">
            <label htmlFor="email" className="block font-body text-sm font-medium text-charcoal mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpVerified}
                  className="w-full bg-white border border-navy/15 rounded-md pl-11 pr-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200 disabled:bg-offwhite disabled:text-charcoal/60"
                  placeholder="your@email.com"
                />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpSent}
                  className="flex items-center gap-2 px-5 py-3.5 bg-navy text-offwhite rounded-md font-body text-sm font-medium hover:bg-navy-light disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  {otpSent ? 'Sent' : 'Send OTP'}
                </button>
              )}
              {otpVerified && (
                <div className="flex items-center gap-2 px-5 py-3.5 bg-green-50 text-green-700 rounded-md font-body text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div className="form-field bg-white/50 border border-gold/20 rounded-lg p-4">
              <label htmlFor="otp" className="block font-body text-sm font-medium text-charcoal mb-2">
                Enter 6-digit OTP
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="flex-1 bg-white border border-navy/15 rounded-md px-4 py-3 font-body text-lg text-charcoal tracking-[0.3em] text-center focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
                  placeholder="000000"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="px-6 py-3 bg-gold text-navy rounded-md font-body text-sm font-semibold hover:bg-gold-light transition-colors duration-200"
                >
                  Verify
                </button>
              </div>
              <p className="mt-2 font-body text-xs text-charcoal/60">
                Check your inbox (and spam folder) for the OTP.
              </p>
            </div>
          )}

          {/* College + Year */}
          <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="college" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                College/Institute <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
                placeholder="Your college name"
              />
            </div>
            <div>
              <label htmlFor="year" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200 appearance-none"
              >
                <option value="">Select year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch + Phone */}
          <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="branch" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                Branch/Major <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="form-field">
            <label htmlFor="linkedin" className="block font-body text-sm font-medium text-charcoal mb-1.5">
              LinkedIn Profile <span className="text-charcoal/40">(optional)</span>
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full bg-white border border-navy/15 rounded-md px-4 py-3.5 font-body text-[15px] text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15 transition-all duration-200"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Submit */}
          <div className="form-field pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gold text-navy rounded-lg font-heading text-base font-semibold hover:bg-gold-light hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

          <p className="form-field font-body text-xs text-charcoal/50 text-center pt-2">
            By submitting, you agree that your application will be reviewed by the QUANTΣODE team.
            Approval is not instant — see the selection process above.
          </p>
        </form>
      </div>
    </section>
  )
}

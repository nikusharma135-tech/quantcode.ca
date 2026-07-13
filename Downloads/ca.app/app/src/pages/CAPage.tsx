import Navigation from '@/sections/Navigation'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Motive from '@/sections/Motive'
import WhoIsCA from '@/sections/WhoIsCA'
import Responsibilities from '@/sections/Responsibilities'
import WhatYouGain from '@/sections/WhatYouGain'
import Eligibility from '@/sections/Eligibility'
import Timeline from '@/sections/Timeline'
import GrowthPath from '@/sections/GrowthPath'
import ReferralLeaderboard from '@/sections/ReferralLeaderboard'
import ApplyForm from '@/sections/ApplyForm'
import FAQ from '@/sections/FAQ'
import Footer from '@/sections/Footer'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

export default function CAPage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-offwhite">
      <Navigation />
      <Hero />
      <About />
      <Motive />
      <WhoIsCA />
      <Responsibilities />
      <WhatYouGain />
      <Eligibility />
      <Timeline />
      <GrowthPath />
      <ReferralLeaderboard />
      <ApplyForm />
      <FAQ />
      <Footer />
    </div>
  )
}

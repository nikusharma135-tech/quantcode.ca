import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Generate a unique referral code
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `QC-${code}`
}

// Check if a referral code exists
export async function isReferralCodeUnique(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('ambassadors')
    .select('referral_code')
    .eq('referral_code', code)
    .single()

  if (error && error.code === 'PGRST116') {
    return true // No rows found = unique
  }
  return !data
}

// Generate a guaranteed unique referral code
export async function generateUniqueReferralCode(): Promise<string> {
  let code = generateReferralCode()
  let isUnique = await isReferralCodeUnique(code)
  let attempts = 0
  const maxAttempts = 10

  while (!isUnique && attempts < maxAttempts) {
    code = generateReferralCode()
    isUnique = await isReferralCodeUnique(code)
    attempts++
  }

  return code
}

// Get leaderboard data
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('ambassadors')
    .select('name, college, referral_count')
    .gt('referral_count', 0)
    .order('referral_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Leaderboard error:', error)
    return []
  }

  return data || []
}

// Get referral count for an ambassador
export async function getReferralCount(referralCode: string): Promise<number> {
  const { count, error } = await supabase
    .from('ambassadors')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', referralCode)

  if (error) {
    console.error('Referral count error:', error)
    return 0
  }

  return count || 0
}

// Sign up with OTP
export async function signUpWithOTP(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })

  return { data, error }
}

// Verify OTP
export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  return { data, error }
}



import { useAppDispatch } from '@/lib/redux/hooks'
import { setClearUserSession, setUserSession } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { ReactNode, useEffect } from 'react'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {

          const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.session?.user.id).single()
          dispatch(setUserSession({ user: data.session?.user, session: data.session, profile: profileData }))
        } else {
          dispatch(setClearUserSession())
        }
      } catch (error) {
        console.error('Error checking initial session:', error)
        dispatch(setClearUserSession())
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session?.user.id).single()
          dispatch(setUserSession({ user: session?.user, session: session, profile: profileData }))
        } else {
          dispatch(setClearUserSession())
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])
  return (
    <>{children}</>
  )
}

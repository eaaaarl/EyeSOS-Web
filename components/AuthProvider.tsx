import { useAppDispatch } from '@/lib/redux/hooks'
import { setClearUserSession, setUserSession } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import React, { ReactNode, useEffect, useRef, useCallback } from 'react'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const isInitialized = useRef(false)

  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      dispatch(setUserSession({
        user: session.user,
        session: session,
        profile: profileData
      }))
    } else {
      dispatch(setClearUserSession())
    }
  }, [dispatch])

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        await handleSession(data.session)
      } catch (error) {
        console.error('Error checking initial session:', error)
        dispatch(setClearUserSession())
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event)
        await handleSession(session)
      }
    )

    return () => {
      subscription.unsubscribe()
      isInitialized.current = false
    }
  }, [handleSession, dispatch])

  return <>{children}</>
}
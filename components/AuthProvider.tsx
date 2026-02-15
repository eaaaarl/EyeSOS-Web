'use client'

import { useAppDispatch } from '@/lib/redux/hooks'
import { setClearUserSession, setUserSession } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { ReactNode, useEffect } from 'react'

function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let mounted = true

    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!mounted) return

      if (data.session?.user) {
        dispatch(
          setUserSession({
            user: data.session.user,
            session: data.session
          })
        )
      } else {
        dispatch(setClearUserSession())
      }
    }

    checkInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(
          setUserSession({
            user: session.user,
            session
          })
        )
      } else {
        dispatch(setClearUserSession())
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [dispatch])

  return <>{children}</>
}

export default AuthProvider

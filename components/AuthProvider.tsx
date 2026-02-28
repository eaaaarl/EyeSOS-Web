'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setClearUserSession, setUserSession } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { ReactNode, useEffect } from 'react'

function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { isSigningIn } = useAppSelector((state) => state.auth)

  useEffect(() => {
    let mounted = true

    const checkInitialSession = async () => {
      const isRecovery = window.location.pathname.includes("/reset-password")
      const isForgot = window.location.pathname.includes("/forgot-password")
      const isLogin = window.location.pathname === "/"
      if (isRecovery || isForgot || isLogin) return

      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      if (data.session?.user) {
        dispatch(setUserSession({ user: data.session.user, session: data.session }))
      } else {
        dispatch(setClearUserSession())
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isRecoveryPage = window.location.pathname.includes("/reset-password")
      const isForgotPage = window.location.pathname.includes("/forgot-password")

      // Don't sync session during sign-in attempts to prevent flickering
      // The signIn mutation will handle setting the session or error
      if (isSigningIn && event === "SIGNED_IN") {
        return
      }

      // Don't sync session to Redux if we're in recovery mode or on a recovery-related page.
      // Supabase automatically signs the user in during recovery, but we don't want
      // the rest of the app (or other tabs) to treat them as "authenticated" until they finish.
      if (event === "PASSWORD_RECOVERY" || isRecoveryPage || isForgotPage) {
        // We might still want to clear the session if the event is specifically signed out
        if (event === "SIGNED_OUT") {
          dispatch(setClearUserSession())
        }
        return
      }

      if (session?.user) {
        dispatch(setUserSession({ user: session.user, session }))
      } else {
        dispatch(setClearUserSession())
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [dispatch, isSigningIn])

  return <>{children}</>
}

export default AuthProvider
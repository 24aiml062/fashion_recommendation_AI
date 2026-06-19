import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getProfile, getBodyProfile, getWardrobe } from '../api/api'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [bodyProfile, setBodyProfile] = useState(null)
  const [wardrobe, setWardrobe] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    try {
      const res = await getProfile()
      setProfile(res.data)
    } catch {
      setProfile(null) // 404 means "not created yet" — not an error state
    }
  }, [])

  const refreshBodyProfile = useCallback(async () => {
    try {
      const res = await getBodyProfile()
      setBodyProfile(res.data)
    } catch {
      setBodyProfile(null)
    }
  }, [])

  const refreshWardrobe = useCallback(async () => {
    try {
      const res = await getWardrobe()
      setWardrobe(res.data)
    } catch {
      setWardrobe(null)
    }
  }, [])

  useEffect(() => {
    Promise.all([refreshProfile(), refreshBodyProfile(), refreshWardrobe()])
      .finally(() => setLoading(false))
  }, [refreshProfile, refreshBodyProfile, refreshWardrobe])

  return (
    <AppDataContext.Provider value={{
      profile, bodyProfile, wardrobe, loading,
      refreshProfile, refreshBodyProfile, refreshWardrobe,
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}

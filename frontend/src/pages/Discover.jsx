import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRecommendation } from '../api/api'
import { useAppData } from '../context/AppDataContext'
import SwipeDeck from '../components/SwipeDeck'
import SeamDivider from '../components/SeamDivider'

const OCCASIONS = ['College', 'Wedding', 'Party', 'Interview', 'Office', 'Vacation']
const WEATHERS = ['Hot', 'Moderate', 'Cold']

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function Discover() {
  const { profile, bodyProfile, wardrobe } = useAppData()
  const [looks, setLooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasItems = wardrobe
    ? Object.values(wardrobe).some((a) => a.length > 0)
    : false

  const fetchLooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const combos = shuffle(
        OCCASIONS.flatMap((o) => WEATHERS.map((w) => ({ occasion: o, weather: w })))
      ).slice(0, 4)

      const results = await Promise.allSettled(
        combos.map(({ occasion, weather }) =>
          getRecommendation({ occasion, weather }).then((r) => ({
            ...r.data,
            occasion,
          }))
        )
      )
      const valid = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      if (valid.length === 0) throw new Error('no looks generated')
      setLooks(valid)
    } catch (err) {
      setError(err.message || 'could not load looks')
    } finally {
      setLoading(false)
    }
  }

  // Run once when prerequisites are met
  useEffect(() => {
    if (profile && bodyProfile && hasItems) fetchLooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // intentionally empty — run once on mount

  // Guard AFTER all hooks
  if (!profile || !bodyProfile || !hasItems) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="font-serif text-2xl font-medium italic text-ink">not quite ready</p>
        <p className="font-mono text-[11px] uppercase text-muted">
          complete profile, mirror, and closet first
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2">
        <h1 className="font-serif text-2xl font-medium text-ink">Discover looks</h1>
        <p className="text-sm text-muted mt-0.5">swipe through outfit ideas for today</p>
      </div>

      <SeamDivider />

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="animate-wiggle inline-block text-2xl">✂</span>
          <p className="font-mono text-[11px] uppercase text-muted">stitching your looks…</p>
        </div>
      )}

      {error && (
        <div className="bg-thread/10 border border-thread/30 rounded-xl p-3 flex gap-2 items-start">
          <span className="font-serif text-thread text-base leading-none mt-0.5">!</span>
          <p className="text-sm text-ink">{error}</p>
        </div>
      )}

      {!loading && looks.length > 0 && <SwipeDeck looks={looks} />}

      {!loading && looks.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <p className="font-serif text-xl font-medium italic text-ink">that's all for today</p>
          <p className="font-mono text-[10px] uppercase text-muted">new looks tomorrow morning</p>
          <button
            onClick={fetchLooks}
            className="mt-2 border border-borderwarm font-mono text-[10px] uppercase rounded-full px-5 py-2.5 text-muted hover:border-thread hover:text-thread transition-colors"
          >
            try again
          </button>
        </div>
      )}
    </div>
  )
}

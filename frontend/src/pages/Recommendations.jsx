import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getRecommendation, uploadClothing } from '../api/api'
import { useAppData } from '../context/AppDataContext'
import OccasionChips from '../components/OccasionChips'
import ClosetRail from '../components/ClosetRail'
import MirrorPanel from '../components/MirrorPanel'
import MissingItemCard from '../components/MissingItemCard'
import WhyFitCard from '../components/WhyFitCard'
import SeamDivider from '../components/SeamDivider'

const OCCASIONS = ['College', 'Wedding', 'Party', 'Interview', 'Office', 'Vacation']
const WEATHERS = ['Hot', 'Moderate', 'Cold']

function totalItems(wardrobe) {
  if (!wardrobe) return 0
  return Object.values(wardrobe).reduce((s, a) => s + a.length, 0)
}

function hasItems(wardrobe) {
  return totalItems(wardrobe) > 0
}

// Inline error card for hard errors
function ErrorCard({ message }) {
  return (
    <div className="bg-thread/10 border border-thread/30 rounded-xl p-3 flex gap-2 items-start">
      <span className="font-serif text-thread text-base leading-none mt-0.5">!</span>
      <p className="text-sm text-ink">{message}</p>
    </div>
  )
}

export default function Recommendations() {
  const { profile, bodyProfile, wardrobe, loading: ctxLoading, refreshWardrobe } = useAppData()
  const [occasion, setOccasion] = useState(null)
  const [weather, setWeather] = useState('Moderate')
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  // Upload flow for "add a piece" from rail
  const [showUpload, setShowUpload] = useState(false)
  const fileRef = useRef()

  const count = totalItems(wardrobe)

  const handleStyleMe = async () => {
    if (!occasion) {
      setShaking(true)
      toast('pick an occasion first')
      setTimeout(() => setShaking(false), 400)
      return
    }
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await getRecommendation({ occasion, weather })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPiece = () => {
    setShowUpload(true)
    setTimeout(() => fileRef.current?.click(), 100)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await uploadClothing(file)
      const items = Array.isArray(res.data) ? res.data : [res.data]
      await refreshWardrobe()
      toast(items.length > 1 ? `added ${items.length} pieces` : `piece added · ${items[0].item_name}`)
    } catch (err) {
      toast(err.response?.data?.detail || 'upload failed')
    }
    setShowUpload(false)
    e.target.value = ''
  }

  // Pre-flight guards
  if (!ctxLoading) {
    if (!profile) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="font-serif text-2xl font-medium text-ink">set up your profile first</p>
        <p className="font-mono text-[11px] uppercase text-muted">we need to know your style</p>
        <Link to="/profile" className="mt-2 bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-thread-dark transition-colors">
          go to profile
        </Link>
      </div>
    )
    if (!bodyProfile) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="font-serif text-2xl font-medium text-ink">mirror yourself first</p>
        <p className="font-mono text-[11px] uppercase text-muted">upload a photo for body analysis</p>
        <Link to="/body-analysis" className="mt-2 bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-thread-dark transition-colors">
          go to mirror
        </Link>
      </div>
    )
    if (!hasItems(wardrobe)) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="font-serif text-2xl font-medium text-ink">your closet is empty</p>
        <p className="font-mono text-[11px] uppercase text-muted">add some pieces to get started</p>
        <Link to="/wardrobe" className="mt-2 bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-thread-dark transition-colors">
          build your closet
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {/* Hidden file input for add-a-piece */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} />

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-serif text-xl font-medium text-ink">
          atelier<span className="text-thread italic">.</span>
        </span>
        <Link
          to="/wardrobe"
          className="font-mono text-[10px] uppercase tracking-wide text-muted active:scale-95 transition-transform hover:text-thread"
        >
          closet · {count} {count === 1 ? 'piece' : 'pieces'}
        </Link>
      </div>

      {/* ── Occasion picker ── */}
      <div className="mb-5">
        <h1 className="font-serif text-3xl font-medium text-ink leading-tight mb-1">
          What's the occasion today?
        </h1>
        <p className="text-sm text-muted mb-4">
          {occasion
            ? `Styling for ${occasion} — pick a few pieces or let us choose.`
            : 'Pick a moment, we\'ll pull the outfit.'}
        </p>
        <OccasionChips
          options={OCCASIONS}
          selected={occasion}
          onSelect={setOccasion}
          shaking={shaking}
        />
      </div>

      {/* Weather picker */}
      <div className="flex items-center gap-2 mt-3 mb-1">
        <span className="font-mono text-[10px] uppercase tracking-wide text-muted">Weather</span>
        <div className="flex gap-1.5">
          {WEATHERS.map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded-full border transition-all active:scale-95 ${
                weather === w
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-card text-muted border-borderwarm hover:border-thread'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <SeamDivider />

      {/* ── Closet rail ── */}
      {wardrobe && hasItems(wardrobe) && (
        <>
          <ClosetRail wardrobe={wardrobe} onAddClick={handleAddPiece} />
          <SeamDivider />
        </>
      )}

      {/* ── Style me button ── */}
      <button
        onClick={handleStyleMe}
        disabled={loading || ctxLoading}
        className="w-full flex items-center justify-center gap-2 bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full py-3.5 hover:bg-thread-dark active:scale-[0.97] transition-all disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="animate-wiggle inline-block">✂</span>
            stitching your look…
          </>
        ) : (
          <>✂ style me</>
        )}
      </button>

      {/* ── Error ── */}
      {error && (
        <div className="mt-4">
          <ErrorCard message={error} />
        </div>
      )}

      {/* ── Fitting room result ── */}
      {result && (
        <div className="mt-6 space-y-4">
          <MirrorPanel result={result} occasion={occasion} />
          <MissingItemCard items={result.missing_items} />
          <WhyFitCard reasons={result.explanation} />
        </div>
      )}
    </div>
  )
}

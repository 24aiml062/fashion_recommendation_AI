import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Avatar from './Avatar'

const skinColors = {
  Fair: '#FDDBB4', Light: '#F5C89A', Medium: '#D4956A', Tan: '#B07842', Dark: '#6B3F2A',
}

function OutfitMiniCard({ look, index, isTop }) {
  const slots = look.outfit ? Object.entries(look.outfit).filter(([, v]) => v) : []
  const skinColor = skinColors[look.avatar?.skin_tone] || '#D4956A'

  return (
    <div
      className="absolute inset-0 rounded-2xl p-4 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #E8E1D2 0%, #DCD3C0 100%)',
        transform: isTop ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        transition: 'transform 300ms ease',
        zIndex: isTop ? 2 : 1,
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
        {look.occasion || 'outfit'}
      </span>
      <div
        className="flex-1 rounded-xl border border-white/70 flex items-center justify-center overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)' }}
      >
        <Avatar
          bodyType={look.avatar?.body_type || 'average'}
          skinColor={skinColor}
          hairStyle={look.avatar?.hair_style || 'short black hair'}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {slots.map(([key, val]) => (
          <span key={key} className="font-mono text-[9px] bg-white/85 rounded-full px-2 py-0.5 text-ink">
            {val}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SwipeDeck({ looks }) {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState({ x: 0, dragging: false })
  const [flying, setFlying] = useState(null) // 'left' | 'right' | null
  const startX = useRef(0)

  const current = looks[index]
  const next = looks[index + 1]
  const exhausted = index >= looks.length

  const advance = (dir) => {
    setFlying(dir)
    if (dir === 'right') toast('saved to your favorite looks 🤍')
    else toast('skipped — noted for next time')
    setTimeout(() => {
      setFlying(null)
      setDrag({ x: 0, dragging: false })
      setIndex((i) => i + 1)
    }, 260)
  }

  // Pointer events
  const onPointerDown = (e) => {
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0
    setDrag({ x: 0, dragging: true })
  }
  const onPointerMove = (e) => {
    if (!drag.dragging) return
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    setDrag((d) => ({ ...d, x: clientX - startX.current }))
  }
  const onPointerUp = () => {
    if (!drag.dragging) return
    if (Math.abs(drag.x) > 90) advance(drag.x > 0 ? 'right' : 'left')
    else setDrag({ x: 0, dragging: false })
  }

  if (exhausted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="font-serif text-2xl font-medium italic text-ink">
          that's all for today
        </p>
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
          new looks tomorrow morning
        </p>
      </div>
    )
  }

  // Stamp opacity (capped at 100px drag)
  const stampOpacity = Math.min(Math.abs(drag.x) / 100, 1)
  const rotate = drag.x / 18

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Deck */}
      <div
        className="relative w-full max-w-xs"
        style={{ height: '420px' }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        {/* Next card peeking */}
        {next && <OutfitMiniCard look={next} index={index + 1} isTop={false} />}

        {/* Current card */}
        {current && (
          <div
            style={{
              position: 'absolute', inset: 0,
              transform: flying === 'right'
                ? 'translateX(500px) rotate(25deg)'
                : flying === 'left'
                  ? 'translateX(-500px) rotate(-25deg)'
                  : `translateX(${drag.x}px) rotate(${rotate}deg)`,
              opacity: flying ? 0 : 1,
              transition: flying ? 'transform 250ms ease, opacity 250ms ease' : 'none',
              cursor: drag.dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              zIndex: 2,
            }}
          >
            <OutfitMiniCard look={current} index={index} isTop={true} />

            {/* Keep stamp */}
            <div
              className="absolute top-8 left-4 border-2 border-sage rounded-lg px-3 py-1 pointer-events-none"
              style={{
                opacity: drag.x > 0 ? stampOpacity : 0,
                transform: 'rotate(-12deg)',
                transition: 'opacity 100ms',
              }}
            >
              <span className="font-mono text-sm font-bold text-sage uppercase tracking-widest">
                keep
              </span>
            </div>

            {/* Skip stamp */}
            <div
              className="absolute top-8 right-4 border-2 border-thread rounded-lg px-3 py-1 pointer-events-none"
              style={{
                opacity: drag.x < 0 ? stampOpacity : 0,
                transform: 'rotate(12deg)',
                transition: 'opacity 100ms',
              }}
            >
              <span className="font-mono text-sm font-bold text-thread uppercase tracking-widest">
                skip
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Button fallback */}
      <div className="flex gap-4">
        <button
          onClick={() => advance('left')}
          className="w-12 h-12 rounded-full border border-borderwarm bg-card flex items-center justify-center text-muted hover:border-thread hover:text-thread transition-colors text-lg"
          aria-label="Skip"
        >
          ✕
        </button>
        <button
          onClick={() => advance('right')}
          className="w-12 h-12 rounded-full bg-ink text-canvas flex items-center justify-center hover:bg-thread-dark transition-colors text-lg"
          aria-label="Keep"
        >
          ♥
        </button>
      </div>

      {/* Progress */}
      <p className="font-mono text-[10px] uppercase text-muted">
        {index + 1} / {looks.length}
      </p>
    </div>
  )
}

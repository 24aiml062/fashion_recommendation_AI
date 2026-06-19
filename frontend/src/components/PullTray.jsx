import { useState } from 'react'

export default function PullTray({ items, onRemove, onDrop }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e) => {
    setDragOver(false)
    if (onDrop) onDrop(e)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-6 rounded-2xl border-[1.5px] border-dashed transition-colors duration-200 p-4 min-h-[80px] ${
        dragOver
          ? 'border-thread bg-thread/5'
          : 'border-borderwarm bg-canvas'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted mb-3">
        today's pull · drag here
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-muted/60 italic font-serif text-center py-2">
          drag pieces here or tap a card to add
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1.5 bg-ink text-canvas font-mono text-[10px] rounded-full px-3 py-1.5 animate-pop_in"
            >
              {item.item_name}
              <button
                onClick={() => onRemove(item.id)}
                className="text-canvas/60 hover:text-canvas transition-colors leading-none"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

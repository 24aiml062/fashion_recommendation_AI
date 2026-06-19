import { useState } from 'react'
import { Link } from 'react-router-dom'

function AddPieceCard({ onAddClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-24">
      {/* Hook line */}
      <div className="w-0.5 h-3 bg-muted/30 rounded-full mb-1" />
      <button
        onClick={onAddClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-24 border-[1.5px] border-dashed border-borderwarm rounded-t-[10px] rounded-b-[4px] p-2.5 flex flex-col items-center justify-center aspect-[3/4] bg-canvas hover:border-thread transition-colors"
      >
        <span
          className={`text-xl text-muted transition-transform duration-200 ${
            hovered ? 'rotate-90' : 'rotate-0'
          }`}
        >
          +
        </span>
        <span className="font-mono text-[9px] uppercase text-muted mt-1 text-center">
          add a piece
        </span>
      </button>
    </div>
  )
}

function GarmentCard({ item, selected, onToggle }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-24">
      {/* Hook line */}
      <div
        className="rounded-full transition-all duration-300"
        style={{
          width: '2px',
          height: selected ? '20px' : '6px',
          background: selected ? '#B5482E' : '#A39C92',
          marginBottom: '4px',
        }}
      />
      {/* Card */}
      <button
        onClick={() => onToggle(item.id)}
        className="relative w-full"
        style={{
          transform: selected
            ? 'translateY(-4px) rotate(-1.5deg)'
            : 'translateY(0) rotate(0)',
          transition: 'transform 250ms cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        <div
          className={`bg-card border rounded-t-[10px] rounded-b-[4px] p-2.5 transition-shadow duration-200 ${
            selected
              ? 'border-thread shadow-md'
              : 'border-borderwarm shadow-none'
          }`}
        >
          {/* Image / swatch */}
          <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-canvas mb-1.5">
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-full object-cover"
            />
            {/* Checkmark badge */}
            {selected && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-thread rounded-full flex items-center justify-center animate-pop_in">
                <span className="text-canvas text-[8px] font-bold">✓</span>
              </div>
            )}
          </div>
          <p className="text-[10px] font-medium text-ink truncate leading-tight">
            {item.item_name}
          </p>
          <p className="font-mono text-[9px] uppercase text-muted truncate">
            {item.category} · {item.color}
          </p>
        </div>
      </button>
    </div>
  )
}

export default function ClosetRail({ wardrobe, onAddClick }) {
  const [selected, setSelected] = useState([])

  const allItems = wardrobe
    ? [
        ...(wardrobe.tops || []),
        ...(wardrobe.bottoms || []),
        ...(wardrobe.footwear || []),
        ...(wardrobe.accessories || []),
        ...(wardrobe.other || []),
      ]
    : []

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  if (allItems.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-[17px] font-medium text-ink">
          Your closet rail
        </h2>
        <Link
          to="/wardrobe"
          className="font-mono text-[10px] uppercase tracking-wide text-thread hover:text-thread-dark transition-colors"
        >
          see all →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {allItems.map((item) => (
          <GarmentCard
            key={item.id}
            item={item}
            selected={selected.includes(item.id)}
            onToggle={toggle}
          />
        ))}
        <AddPieceCard onAddClick={onAddClick} />
      </div>
    </div>
  )
}

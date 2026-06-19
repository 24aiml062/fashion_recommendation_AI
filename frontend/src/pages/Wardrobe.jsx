import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { uploadClothing, deleteWardrobeItem } from '../api/api'
import { useAppData } from '../context/AppDataContext'
import ClothingCard from '../components/ClothingCard'
import OccasionChips from '../components/OccasionChips'
import PullTray from '../components/PullTray'
import SeamDivider from '../components/SeamDivider'

const FILTERS = ['all', 'tops', 'bottoms', 'footwear', 'accessories', 'other']
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function AddPieceCard({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center justify-center aspect-square border-[1.5px] border-dashed border-borderwarm rounded-t-[10px] rounded-b-[4px] bg-canvas hover:border-thread transition-colors"
    >
      <span className={`text-xl text-muted transition-transform duration-200 ${hovered ? 'rotate-90' : ''}`}>+</span>
      <span className="font-mono text-[9px] uppercase text-muted mt-1">add piece</span>
    </button>
  )
}

export default function Wardrobe() {
  const { wardrobe, refreshWardrobe } = useAppData()
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [trayItems, setTrayItems] = useState([])
  const fileRef = useRef()

  // Build counts for filter chips
  const counts = wardrobe ? {
    all: Object.values(wardrobe).reduce((s, a) => s + a.length, 0),
    tops: wardrobe.tops?.length || 0,
    bottoms: wardrobe.bottoms?.length || 0,
    footwear: wardrobe.footwear?.length || 0,
    accessories: wardrobe.accessories?.length || 0,
    other: wardrobe.other?.length || 0,
  } : {}

  // Filtered items
  const allItems = wardrobe
    ? filter === 'all'
      ? [
          ...wardrobe.tops,
          ...wardrobe.bottoms,
          ...wardrobe.footwear,
          ...wardrobe.accessories,
          ...(wardrobe.other || []),
        ]
      : wardrobe[filter] || []
    : []

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) { toast('only jpg, png, webp allowed'); return }
    if (file.size > 5 * 1024 * 1024) { toast('image must be under 5mb'); return }

    setUploading(true)
    try {
      const res = await uploadClothing(file)
      // API now returns an array of detected items
      const items = Array.isArray(res.data) ? res.data : [res.data]
      await refreshWardrobe()

      if (items.length === 1) {
        const item = items[0]
        if (item.category === 'Other') {
          toast('added — category unclear, tap edit to fix it')
        } else {
          toast(`added · ${item.item_name}`)
        }
      } else {
        const names = items.map((i) => i.item_name).join(', ')
        toast(`added ${items.length} items · ${names}`)
      }
    } catch (err) {
      toast(err.response?.data?.detail || 'upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteWardrobeItem(id)
      await refreshWardrobe()
      setTrayItems((prev) => prev.filter((i) => i.id !== id))
      toast('removed from closet')
    } catch (err) {
      toast(err.response?.data?.detail || 'could not delete')
    }
  }

  const addToTray = (item) => {
    setTrayItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item])
  }
  const removeFromTray = (id) => setTrayItems((prev) => prev.filter((i) => i.id !== id))

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item))
  }
  const handleTrayDrop = (e) => {
    e.preventDefault()
    try {
      const item = JSON.parse(e.dataTransfer.getData('application/json'))
      addToTray(item)
    } catch (_) {}
  }

  const total = counts.all || 0

  return (
    <div>
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="mb-1">
        <h1 className="font-serif text-2xl font-medium text-ink">Your closet</h1>
        <p className="text-[13px] text-muted mt-0.5">
          {total} {total === 1 ? 'piece' : 'pieces'} · sorted by date added
        </p>
      </div>

      <SeamDivider />

      {/* Upload button — always visible */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full py-3 hover:bg-thread-dark active:scale-[0.97] transition-all disabled:opacity-60 mb-5"
      >
        {uploading ? (
          <>
            <span className="animate-wiggle inline-block">✂</span>
            reading your piece…
          </>
        ) : (
          '+ add a piece'
        )}
      </button>

      {/* Filter chips */}
      <div className="mb-4">
        <OccasionChips
          options={FILTERS}
          selected={filter}
          onSelect={setFilter}
          counts={counts}
        />
      </div>

      {/* Grid */}
      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
          <p className="font-serif text-xl font-medium text-ink">nothing here yet</p>
          <p className="font-mono text-[10px] uppercase text-muted">
            {filter === 'all' ? 'tap the button above to add your first piece' : `no ${filter} in your closet`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {allItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={refreshWardrobe}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            />
          ))}
          <AddPieceCard onClick={() => fileRef.current?.click()} />
        </div>
      )}

      <SeamDivider />

      {/* Pull tray */}
      <PullTray
        items={trayItems}
        onRemove={removeFromTray}
        onDrop={handleTrayDrop}
      />
    </div>
  )
}

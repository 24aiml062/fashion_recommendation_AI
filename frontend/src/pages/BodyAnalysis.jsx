import { useState } from 'react'
import toast from 'react-hot-toast'
import { analyzeBody } from '../api/api'
import { useAppData } from '../context/AppDataContext'
import Avatar from '../components/Avatar'
import SeamDivider from '../components/SeamDivider'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const skinColors = {
  Fair: '#FDDBB4', Light: '#F5C89A', Medium: '#D4956A', Tan: '#B07842', Dark: '#6B3F2A',
}

export default function BodyAnalysis() {
  const { bodyProfile, refreshBodyProfile } = useAppData()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    if (!ALLOWED_TYPES.includes(selected.type)) { toast('only jpg, png, webp allowed'); return }
    if (selected.size > 5 * 1024 * 1024) { toast('image must be under 5mb'); return }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      await analyzeBody(file)
      await refreshBodyProfile()
      toast('mirror updated')
      setFile(null)
      setPreview(null)
    } catch (err) {
      const msg = err.response?.data?.detail || 'something went wrong'
      // Hard error inline card
      toast(msg)
    } finally {
      setLoading(false)
    }
  }

  const avatarBodyType = bodyProfile?.body_type?.toLowerCase().replace('-', '_') || 'average'
  const avatarSkinColor = bodyProfile ? (skinColors[bodyProfile.skin_tone] || '#D4956A') : '#D4956A'
  const avatarHairStyle = bodyProfile?.hair_style?.toLowerCase() || 'short black hair'

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-ink mb-1">Your mirror</h1>
      <p className="text-sm text-muted">Upload a photo — we'll read your body type, skin tone, and hair to build your avatar.</p>

      <SeamDivider />

      {/* Upload */}
      <div className="bg-card border border-borderwarm rounded-2xl p-5 space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wide text-muted mb-2">
            Select photo (jpg · png · webp · max 5mb)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:font-mono file:text-[10px] file:uppercase file:bg-ink file:text-canvas hover:file:bg-thread-dark transition"
          />
        </div>

        {preview && (
          <img src={preview} alt="Preview"
            className="w-full max-h-56 object-contain rounded-xl border border-borderwarm" />
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full py-3.5 hover:bg-thread-dark active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-wiggle inline-block">✂</span>
              reading your fit…
            </>
          ) : 'analyse'}
        </button>
      </div>

      {/* Results */}
      {bodyProfile && (
        <>
          <SeamDivider />
          <div className="grid grid-cols-2 gap-4">
            {/* Stats */}
            <div className="bg-card border border-borderwarm rounded-2xl p-4">
              <h2 className="font-serif text-base font-medium text-ink mb-3">Your read</h2>
              {[
                { label: 'Body Type', value: bodyProfile.body_type },
                { label: 'Skin Tone', value: bodyProfile.skin_tone },
                { label: 'Hair', value: bodyProfile.hair_style },
              ].map(({ label, value }) => (
                <div key={label} className="py-2 border-b border-dashed border-borderwarm last:border-0">
                  <p className="font-mono text-[9px] uppercase text-muted">{label}</p>
                  <p className="text-sm font-medium text-ink mt-0.5">{value}</p>
                </div>
              ))}
              <p className="font-mono text-[9px] uppercase text-muted mt-3">
                upload a new photo anytime
              </p>
            </div>

            {/* Avatar preview */}
            <div className="bg-card border border-borderwarm rounded-2xl p-4 flex flex-col items-center">
              <h2 className="font-serif text-base font-medium text-ink mb-2 self-start">Avatar</h2>
              <Avatar
                bodyType={avatarBodyType}
                skinColor={avatarSkinColor}
                hairStyle={avatarHairStyle}
                enableHoverTilt
              />
              <p className="font-mono text-[9px] uppercase text-muted text-center mt-1">
                your body double
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

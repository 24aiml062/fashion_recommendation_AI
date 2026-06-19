import Avatar from './Avatar'
import OutfitCard from './OutfitCard'

const skinColors = {
  Fair: '#FDDBB4', Light: '#F5C89A', Medium: '#D4956A', Tan: '#B07842', Dark: '#6B3F2A',
}

export default function MirrorPanel({ result, occasion }) {
  const avatarBodyType = result.avatar.body_type
  const avatarSkinColor = skinColors[result.avatar.skin_tone] || '#D4956A'
  const avatarHairStyle = result.avatar.hair_style

  return (
    <div
      className="rounded-2xl p-5 opacity-0 animate-slide_up"
      style={{
        background: 'linear-gradient(180deg, #E8E1D2 0%, #DCD3C0 100%)',
        animationDuration: '500ms',
        animationFillMode: 'forwards',
      }}
    >
      {/* Live label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-1.5 h-1.5 rounded-full bg-thread animate-pulse_dot"
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink/60">
          today's fitting · {occasion}
        </span>
      </div>

      {/* Glass mirror stage */}
      <div
        className="relative rounded-2xl border border-white/70 flex flex-col items-center py-6 px-4 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)' }}
      >
      {/* Avatar — wrapper handles reveal, inner handles tilt */}
        <div
          className="opacity-0 animate-reveal_up"
          style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
        >
          <Avatar
            bodyType={avatarBodyType}
            skinColor={avatarSkinColor}
            hairStyle={avatarHairStyle}
            enableHoverTilt
          />
        </div>

        {/* Outfit pills */}
        <div className="mt-4 w-full">
          <OutfitCard outfit={result.outfit} />
        </div>
      </div>
    </div>
  )
}

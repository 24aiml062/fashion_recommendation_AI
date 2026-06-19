import { useState } from 'react'

export default function Avatar({
  bodyType = 'average',
  skinColor = '#D4956A',
  hairStyle = 'short black hair',
  enableHoverTilt = false,
}) {
  const [tilting, setTilting] = useState(false)
  // ── Body width config ──────────────────────────────────────
  const bodyConfig = {
    slim:      { shoulder: 52, waist: 36, hip: 46 },
    average:   { shoulder: 62, waist: 44, hip: 56 },
    athletic:  { shoulder: 70, waist: 46, hip: 56 },
    curvy:     { shoulder: 64, waist: 50, hip: 70 },
    plus_size: { shoulder: 76, waist: 64, hip: 80 },
  }
  const { shoulder, waist, hip } = bodyConfig[bodyType] || bodyConfig.average
  const cx = 100  // horizontal center

  // ── Hair ──────────────────────────────────────────────────
  const hairLower = hairStyle.toLowerCase()
  const isLong = hairLower.includes('long')
  const isCurly = hairLower.includes('curly') || hairLower.includes('wavy')

  const hairColorMap = {
    black:  '#1a1a1a',
    brown:  '#4a2c0a',
    blonde: '#d4a017',
    red:    '#8b2500',
    grey:   '#888888',
    gray:   '#888888',
    white:  '#e8e8e8',
  }
  const hairColor =
    Object.entries(hairColorMap).find(([k]) => hairLower.includes(k))?.[1] || '#1a1a1a'

  // ── Derived measurements ───────────────────────────────────
  const headCY   = 72
  const headRX   = 22
  const headRY   = 27
  const neckTop  = headCY + headRY - 4   // ~95
  const neckBot  = neckTop + 14          // ~109
  const torsoTop = neckBot
  const torsoBot = torsoTop + 88         // ~197
  const legBot   = torsoBot + 100        // ~297

  // shoulder / waist / hip half-widths
  const sHalf = shoulder / 2
  const wHalf = waist / 2
  const hHalf = hip / 2

  // torso split points
  const waistY = torsoTop + 52
  const hipY   = torsoTop + 78

  // ── Torso path (smooth curves) ────────────────────────────
  // Left side: shoulder → waist → hip
  // Right side: hip → waist → shoulder
  const torsoPath = [
    `M ${cx - sHalf} ${torsoTop}`,
    `C ${cx - sHalf} ${waistY - 20}, ${cx - wHalf} ${waistY - 10}, ${cx - wHalf} ${waistY}`,
    `C ${cx - wHalf} ${waistY + 10}, ${cx - hHalf} ${hipY - 6}, ${cx - hHalf} ${hipY}`,
    `L ${cx - hHalf} ${torsoBot}`,
    `L ${cx + hHalf} ${torsoBot}`,
    `L ${cx + hHalf} ${hipY}`,
    `C ${cx + hHalf} ${hipY - 6}, ${cx + wHalf} ${waistY + 10}, ${cx + wHalf} ${waistY}`,
    `C ${cx + wHalf} ${waistY - 10}, ${cx + sHalf} ${waistY - 20}, ${cx + sHalf} ${torsoTop}`,
    `Z`,
  ].join(' ')

  // ── Arm paths ─────────────────────────────────────────────
  const armW = 13
  const leftArmPath = `
    M ${cx - sHalf - 2} ${torsoTop + 4}
    C ${cx - sHalf - 18} ${torsoTop + 30}, ${cx - sHalf - 22} ${torsoTop + 60}, ${cx - sHalf - 14} ${torsoTop + 88}
    Q ${cx - sHalf - 8} ${torsoTop + 94} ${cx - sHalf - 2} ${torsoTop + 88}
    C ${cx - sHalf + 4} ${torsoTop + 60}, ${cx - sHalf} ${torsoTop + 30}, ${cx - sHalf + armW - 2} ${torsoTop + 4}
    Z
  `
  const rightArmPath = `
    M ${cx + sHalf + 2} ${torsoTop + 4}
    C ${cx + sHalf + 18} ${torsoTop + 30}, ${cx + sHalf + 22} ${torsoTop + 60}, ${cx + sHalf + 14} ${torsoTop + 88}
    Q ${cx + sHalf + 8} ${torsoTop + 94} ${cx + sHalf + 2} ${torsoTop + 88}
    C ${cx + sHalf - 4} ${torsoTop + 60}, ${cx + sHalf} ${torsoTop + 30}, ${cx + sHalf - armW + 2} ${torsoTop + 4}
    Z
  `

  // ── Leg paths ─────────────────────────────────────────────
  const legW   = hHalf * 0.46
  const legGap = 3
  // left leg
  const llx = cx - legGap - legW
  const lrx = cx - legGap
  // right leg
  const rlx = cx + legGap
  const rrx = cx + legGap + legW

  const leftLegPath = `
    M ${llx} ${torsoBot}
    C ${llx - 4} ${torsoBot + 40}, ${llx - 2} ${torsoBot + 70}, ${llx + 2} ${legBot}
    L ${lrx - 2} ${legBot}
    C ${lrx + 2} ${torsoBot + 70}, ${lrx + 4} ${torsoBot + 40}, ${lrx} ${torsoBot}
    Z
  `
  const rightLegPath = `
    M ${rlx} ${torsoBot}
    C ${rlx - 4} ${torsoBot + 40}, ${rlx - 2} ${torsoBot + 70}, ${rlx + 2} ${legBot}
    L ${rrx - 2} ${legBot}
    C ${rrx + 2} ${torsoBot + 70}, ${rrx + 4} ${torsoBot + 40}, ${rrx} ${torsoBot}
    Z
  `

  // ── Shoe ellipses ─────────────────────────────────────────
  const leftShoeX  = (llx + lrx) / 2 - 2
  const rightShoeX = (rlx + rrx) / 2 + 2

  // ── Clothing colors ───────────────────────────────────────
  const shirtColor  = '#c96a3e'   // brand terracotta
  const shirtShade  = '#a8532c'   // darker for depth
  const pantColor   = '#3d3d5c'   // deep navy/indigo
  const pantShade   = '#2a2a40'
  const shoeColor   = '#2a2a2a'

  // ── Hair geometry ─────────────────────────────────────────
  // Cap (all styles share a scalp cap)
  const capPath = `
    M ${cx - headRX - 4} ${headCY - 6}
    C ${cx - headRX - 6} ${headCY - 30}, ${cx - 10} ${headCY - headRY - 12}, ${cx} ${headCY - headRY - 8}
    C ${cx + 10} ${headCY - headRY - 12}, ${cx + headRX + 6} ${headCY - 30}, ${cx + headRX + 4} ${headCY - 6}
    Z
  `

  // Long hair strands on sides
  const longHairLeft = `
    M ${cx - headRX - 2} ${headCY - 10}
    C ${cx - headRX - 10} ${headCY + 20}, ${cx - headRX - 14} ${headCY + 60}, ${cx - headRX - 8} ${headCY + 90}
    L ${cx - headRX + 4} ${headCY + 90}
    C ${cx - headRX - 2} ${headCY + 60}, ${cx - headRX + 2} ${headCY + 20}, ${cx - headRX + 6} ${headCY - 8}
    Z
  `
  const longHairRight = `
    M ${cx + headRX + 2} ${headCY - 10}
    C ${cx + headRX + 10} ${headCY + 20}, ${cx + headRX + 14} ${headCY + 60}, ${cx + headRX + 8} ${headCY + 90}
    L ${cx + headRX - 4} ${headCY + 90}
    C ${cx + headRX + 2} ${headCY + 60}, ${cx + headRX - 2} ${headCY + 20}, ${cx + headRX - 6} ${headCY - 8}
    Z
  `

  // Curly puffs (decorative circles for curly hair)
  const curlyPuffs = [
    { x: cx - 26, y: headCY - 28, r: 10 },
    { x: cx - 14, y: headCY - 36, r: 11 },
    { x: cx,      y: headCY - 38, r: 11 },
    { x: cx + 14, y: headCY - 36, r: 11 },
    { x: cx + 26, y: headCY - 28, r: 10 },
    { x: cx - 28, y: headCY - 18, r: 9  },
    { x: cx + 28, y: headCY - 18, r: 9  },
  ]

  const handleMouseEnter = () => { if (enableHoverTilt) setTilting(true) }
  const handleAnimationEnd = () => setTilting(false)

  return (
    <svg
      width="200"
      height="340"
      viewBox="0 0 200 340"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Avatar: ${bodyType} body type, ${skinColor} skin, ${hairStyle}`}
      role="img"
      onMouseEnter={handleMouseEnter}
      className={enableHoverTilt && tilting ? 'animate-tilt' : ''}
      onAnimationEnd={handleAnimationEnd}
    >
      <defs>
        {/* Skin gradient for depth */}
        <radialGradient id="skinGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor={skinColor} stopOpacity="1" />
          <stop offset="100%" stopColor={skinColor} stopOpacity="0.75" />
        </radialGradient>

        {/* Shirt gradient */}
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shirtShade} />
          <stop offset="40%"  stopColor={shirtColor} />
          <stop offset="100%" stopColor={shirtShade} />
        </linearGradient>

        {/* Pant gradient */}
        <linearGradient id="pantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={pantColor} />
          <stop offset="100%" stopColor={pantShade} />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="shadow" x="-10%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00000022" />
        </filter>

        {/* Subtle face highlight */}
        <radialGradient id="faceHighlight" cx="40%" cy="30%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* ── Long hair (behind head) ── */}
      {isLong && !isCurly && (
        <>
          <path d={longHairLeft}  fill={hairColor} opacity="0.95" />
          <path d={longHairRight} fill={hairColor} opacity="0.95" />
        </>
      )}

      {/* ── Arms (behind torso) ── */}
      <path d={leftArmPath}  fill="url(#skinGrad)" filter="url(#shadow)" />
      <path d={rightArmPath} fill="url(#skinGrad)" filter="url(#shadow)" />

      {/* ── Shirt sleeves (overlay on arms) ── */}
      <path
        d={leftArmPath}
        fill="url(#shirtGrad)"
        opacity="0.55"
        clipPath={`inset(0 0 ${torsoBot - torsoTop - 50}px 0)`}
      />
      <path
        d={rightArmPath}
        fill="url(#shirtGrad)"
        opacity="0.55"
        clipPath={`inset(0 0 ${torsoBot - torsoTop - 50}px 0)`}
      />

      {/* ── Legs ── */}
      <path d={leftLegPath}  fill="url(#pantGrad)" filter="url(#shadow)" />
      <path d={rightLegPath} fill="url(#pantGrad)" filter="url(#shadow)" />

      {/* Leg seam / crease */}
      <line
        x1={cx - legGap - legW * 0.3} y1={torsoBot + 10}
        x2={cx - legGap - legW * 0.1} y2={legBot - 10}
        stroke={pantShade} strokeWidth="0.8" strokeOpacity="0.5"
      />
      <line
        x1={cx + legGap + legW * 0.3} y1={torsoBot + 10}
        x2={cx + legGap + legW * 0.1} y2={legBot - 10}
        stroke={pantShade} strokeWidth="0.8" strokeOpacity="0.5"
      />

      {/* ── Shoes ── */}
      <ellipse cx={leftShoeX}  cy={legBot + 5} rx={legW + 2} ry={7} fill={shoeColor} />
      <ellipse cx={rightShoeX} cy={legBot + 5} rx={legW + 2} ry={7} fill={shoeColor} />
      {/* Shoe highlight */}
      <ellipse cx={leftShoeX  - 3} cy={legBot + 3} rx={legW * 0.45} ry={3} fill="#ffffff" opacity="0.15" />
      <ellipse cx={rightShoeX - 3} cy={legBot + 3} rx={legW * 0.45} ry={3} fill="#ffffff" opacity="0.15" />

      {/* ── Torso / shirt ── */}
      <path d={torsoPath} fill="url(#shirtGrad)" filter="url(#shadow)" />

      {/* Collar V-shape */}
      <polyline
        points={`${cx - 10},${torsoTop + 2} ${cx},${torsoTop + 18} ${cx + 10},${torsoTop + 2}`}
        fill="none"
        stroke={shirtShade}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shirt button line */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={torsoTop + 26 + i * 14}
          r="1.8"
          fill={shirtShade}
          opacity="0.7"
        />
      ))}

      {/* ── Neck ── */}
      <rect
        x={cx - 8} y={neckTop}
        width={16} height={neckBot - neckTop + 2}
        rx="6"
        fill="url(#skinGrad)"
      />

      {/* ── Head ── */}
      <ellipse
        cx={cx} cy={headCY}
        rx={headRX} ry={headRY}
        fill="url(#skinGrad)"
        filter="url(#shadow)"
      />
      {/* Face highlight */}
      <ellipse
        cx={cx} cy={headCY}
        rx={headRX} ry={headRY}
        fill="url(#faceHighlight)"
      />

      {/* ── Ears ── */}
      <ellipse cx={cx - headRX + 1} cy={headCY + 2} rx="5" ry="7" fill="url(#skinGrad)" />
      <ellipse cx={cx + headRX - 1} cy={headCY + 2} rx="5" ry="7" fill="url(#skinGrad)" />

      {/* ── Eyebrows ── */}
      <path
        d={`M ${cx - 13} ${headCY - 9} Q ${cx - 8} ${headCY - 12} ${cx - 3} ${headCY - 9}`}
        fill="none" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round"
      />
      <path
        d={`M ${cx + 3} ${headCY - 9} Q ${cx + 8} ${headCY - 12} ${cx + 13} ${headCY - 9}`}
        fill="none" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round"
      />

      {/* ── Eyes ── */}
      {/* Eye whites */}
      <ellipse cx={cx - 8} cy={headCY - 2} rx="5.5" ry="4" fill="#ffffff" />
      <ellipse cx={cx + 8} cy={headCY - 2} rx="5.5" ry="4" fill="#ffffff" />
      {/* Iris */}
      <circle cx={cx - 8} cy={headCY - 2} r="3"   fill="#3d2b1f" />
      <circle cx={cx + 8} cy={headCY - 2} r="3"   fill="#3d2b1f" />
      {/* Pupil */}
      <circle cx={cx - 8} cy={headCY - 2} r="1.4" fill="#111111" />
      <circle cx={cx + 8} cy={headCY - 2} r="1.4" fill="#111111" />
      {/* Eye shine */}
      <circle cx={cx - 6.5} cy={headCY - 3.5} r="1" fill="#ffffff" opacity="0.9" />
      <circle cx={cx + 9.5} cy={headCY - 3.5} r="1" fill="#ffffff" opacity="0.9" />
      {/* Eyelid line */}
      <path d={`M ${cx-13.5} ${headCY-2} Q ${cx-8} ${headCY-6} ${cx-2.5} ${headCY-2}`}
        fill="none" stroke="#3d2b1f" strokeWidth="1" strokeOpacity="0.6" />
      <path d={`M ${cx+2.5} ${headCY-2} Q ${cx+8} ${headCY-6} ${cx+13.5} ${headCY-2}`}
        fill="none" stroke="#3d2b1f" strokeWidth="1" strokeOpacity="0.6" />

      {/* ── Nose ── */}
      <path
        d={`M ${cx} ${headCY + 4} Q ${cx + 4} ${headCY + 10} ${cx + 2} ${headCY + 13} Q ${cx} ${headCY + 14} ${cx - 2} ${headCY + 13} Q ${cx - 4} ${headCY + 10} ${cx} ${headCY + 4}`}
        fill="none" stroke={skinColor} strokeWidth="1.4"
        strokeOpacity="0.55" strokeLinecap="round"
      />

      {/* ── Mouth ── */}
      {/* Lips */}
      <path
        d={`M ${cx - 7} ${headCY + 18} Q ${cx - 3} ${headCY + 16} ${cx} ${headCY + 17} Q ${cx + 3} ${headCY + 16} ${cx + 7} ${headCY + 18} Q ${cx + 3} ${headCY + 22} ${cx} ${headCY + 22} Q ${cx - 3} ${headCY + 22} ${cx - 7} ${headCY + 18}`}
        fill="#c47a7a" opacity="0.75"
      />
      {/* Smile line */}
      <path
        d={`M ${cx - 7} ${headCY + 18} Q ${cx} ${headCY + 23} ${cx + 7} ${headCY + 18}`}
        fill="none" stroke="#a05555" strokeWidth="0.8" strokeOpacity="0.6"
      />

      {/* ── Hair cap (on top of head) ── */}
      {isCurly ? (
        curlyPuffs.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={hairColor} />
        ))
      ) : (
        <path d={capPath} fill={hairColor} />
      )}

      {/* ── Hair side detail (fringe / part line) ── */}
      {!isCurly && (
        <path
          d={`M ${cx - 4} ${headCY - headRY - 5} Q ${cx + 6} ${headCY - headRY + 2} ${cx + 14} ${headCY - headRY + 6}`}
          fill="none"
          stroke={skinColor}
          strokeWidth="1.2"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

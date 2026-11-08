const GREENS = ['#3d6338', '#4f7a45', '#6f8f5e']

const blade = (h) =>
  `M100 170 C86 ${170 - h * 0.4} 92 ${170 - h * 0.8} 100 ${170 - h} C108 ${170 - h * 0.8} 114 ${170 - h * 0.4} 100 170Z`

const tall = [[-20, 105], [-7, 135], [8, 150], [22, 115]].map(([angle, h], i) => (
  <path key={i} d={blade(h)} fill={GREENS[i % 3]} transform={`rotate(${angle} 100 170)`} />
))

const broad = [[62, 112, -40], [138, 108, 40], [100, 70, 0], [76, 146, -65], [124, 146, 65]].map(
  ([x, y, angle], i) => (
    <g key={i}>
      <line x1="100" y1="168" x2={x} y2={y} stroke={GREENS[0]} strokeWidth="3" />
      <ellipse cx={x} cy={y} rx="22" ry="32" fill={GREENS[i % 3]} transform={`rotate(${angle} ${x} ${y})`} />
    </g>
  )
)

const bushy = Array.from({ length: 11 }, (_, i) => {
  const a = (i / 11) * Math.PI * 2
  const r = i % 2 ? 26 : 40
  const x = 100 + Math.cos(a) * r
  const y = 115 + Math.sin(a) * r * 0.85
  return (
    <ellipse
      key={i}
      cx={x}
      cy={y}
      rx="15"
      ry="21"
      fill={GREENS[i % 3]}
      transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
    />
  )
})

const VARIANTS = [tall, broad, bushy]

const variant = (id) =>
  [...String(id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 3

export default function PlantArt({ id, size = 200 }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} aria-hidden="true">
      {VARIANTS[variant(id)]}
      <path d="M62 172h76l-10 60H72z" fill="#b8643f" />
      <rect x="56" y="162" width="88" height="16" rx="3" fill="#c9774f" />
    </svg>
  )
}

const ICONS = {
  WATER: 'M8 1.5S3 7 3 10a5 5 0 0010 0c0-3-5-8.5-5-8.5z',
  FERTILIZE: 'M3 13C3 6 7 2 14 2c0 7-4 11-11 11zm0 0l6-6',
  REPOT: 'M2 4h12v2H2zm1 2h10l-1.5 8h-7z'
}

export function CareIcon({ kind }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d={ICONS[kind]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

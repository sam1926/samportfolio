import './MarqueeReel.css'

const ITEMS = [
  'Cinematic Videography',
  '★',
  'Portrait Photography',
  '★',
  'Automotive',
  '★',
  'Lifestyle',
  '★',
  'Event Coverage',
  '★',
  'Visual Storytelling',
  '★',
  'Available for Hire',
  '★',
]

// Quadruple so there's always enough content to fill any screen width
const REPEATED = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

export default function MarqueeReel({ reverse = false }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className={`marquee__track ${reverse ? 'marquee__track--reverse' : ''}`}>
        {REPEATED.map((item, i) => (
          <span
            key={i}
            className={`marquee__item mono ${item === '★' ? 'marquee__star' : ''}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

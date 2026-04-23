import './GridControls.css'

const COL_OPTIONS = [2, 3, 4, 5]

function GridIcon({ cols }) {
  const gap = 1.5
  const w = (16 - gap * (cols - 1)) / cols
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: cols }).map((_, i) => (
        <rect key={i} x={i * (w + gap)} y={0} width={w} height={20} rx="0.5" fill="currentColor" />
      ))}
    </svg>
  )
}

export default function GridControls({ cols, onChange }) {
  return (
    <div className="grid-controls">
      <span className="mono grid-controls__label">Size</span>
      <div className="grid-controls__buttons">
        {COL_OPTIONS.map((n) => (
          <button
            key={n}
            className={`grid-controls__btn ${cols === n ? 'grid-controls__btn--active' : ''}`}
            onClick={() => onChange(n)}
            aria-label={`${n} columns`}
            title={`${n} columns`}
          >
            <GridIcon cols={n} />
          </button>
        ))}
      </div>
    </div>
  )
}

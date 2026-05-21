import { C } from '../../constants/colors'

const STATUS_STYLES = {
  Setup:      { color: C.orange,  bg: `${C.orange}18`  },
  Active:     { color: C.green,   bg: `${C.green}18`   },
  Completed:  { color: C.blue,    bg: `${C.blue}18`    },
}

export default function StatusPill({ status }) {
  const s = STATUS_STYLES[status] ?? { color: C.textMuted, bg: C.surfaceHigh }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
      color: s.color, background: s.bg,
    }}>
      {status}
    </span>
  )
}

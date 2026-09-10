import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { STATE_POSITIONS, getArcControl } from '../data/mapPoints.js'
import { COLORS } from '../data/hrlData.js'

const HOP_DURATION = 550
const HOP_HEIGHT = 9

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2
}

function quadBezier(p0, pc, p1, t) {
  const mt = 1 - t
  return {
    x: mt * mt * p0.x + 2 * mt * t * pc.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * pc.y + t * t * p1.y,
  }
}

const Mascot = forwardRef(function Mascot({ initialState }, ref) {
  const startState = STATE_POSITIONS[initialState] ? initialState : 'CA'
  const [pos, setPos] = useState(STATE_POSITIONS[startState])
  const [transform, setTransform] = useState('translate(-50%, -100%) scale(1, 1)')
  const currentStateRef = useRef(startState)
  const rafRef = useRef(null)

  function cancelAnimation() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  useEffect(() => () => cancelAnimation(), [])

  useImperativeHandle(ref, () => ({
    getCurrentState() {
      return currentStateRef.current
    },
    snapTo(stateCode) {
      if (!STATE_POSITIONS[stateCode]) return
      cancelAnimation()
      currentStateRef.current = stateCode
      setPos(STATE_POSITIONS[stateCode])
      setTransform('translate(-50%, -100%) scale(1, 1)')
    },
    hopTo(stateCode) {
      if (!STATE_POSITIONS[stateCode]) return Promise.resolve()
      const from = STATE_POSITIONS[currentStateRef.current]
      const to = STATE_POSITIONS[stateCode]
      if (currentStateRef.current === stateCode) return Promise.resolve()
      const control = getArcControl(currentStateRef.current, stateCode)

      return new Promise((resolve) => {
        cancelAnimation()
        const start = performance.now()

        function frame(now) {
          const rawT = Math.min(1, (now - start) / HOP_DURATION)
          const t = easeInOutQuad(rawT)
          const base = quadBezier(from, control, to, t)
          const hop = -Math.sin(Math.PI * t) * HOP_HEIGHT
          const squash = Math.sin(Math.PI * rawT)
          const scaleY = 1 + 0.18 * squash
          const scaleX = 1 - 0.12 * squash

          setPos({ x: base.x, y: base.y + hop })
          setTransform(`translate(-50%, -100%) scale(${scaleX}, ${scaleY})`)

          if (rawT < 1) {
            rafRef.current = requestAnimationFrame(frame)
          } else {
            currentStateRef.current = stateCode
            setTransform('translate(-50%, -100%) scale(1, 1)')
            resolve()
          }
        }

        rafRef.current = requestAnimationFrame(frame)
      })
    },
  }))

  return (
    <div
      className="mascot"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 170 100" className="mascot__svg">
        {/* tail */}
        <path
          d="M45,32 C35,37 27,43 21,51 C15,61 13,71 15,83 C17,77 21,69 27,62 C33,54 40,45 47,37 Z"
          fill={COLORS.brown}
        />
        {/* legs */}
        <line x1="52" y1="65" x2="47" y2="96" stroke={COLORS.brown} strokeWidth="9" strokeLinecap="round" />
        <line x1="60" y1="70" x2="58" y2="96" stroke={COLORS.brown} strokeWidth="9" strokeLinecap="round" />
        <line x1="90" y1="65" x2="96" y2="96" stroke={COLORS.brown} strokeWidth="9" strokeLinecap="round" />
        <line x1="99" y1="63" x2="104" y2="96" stroke={COLORS.brown} strokeWidth="9" strokeLinecap="round" />
        {/* body, neck, head, ear and muzzle — a single silhouette */}
        <path
          d="M160,34
             C157,28 153,24 148,22
             C143,18 139,15 135,14
             C132,13 130,12 128,12
             L124,1 L120,11
             C114,15 106,19 100,22
             C93,25 87,28 82,32
             C75,31.5 70,31 65,31
             C58,31.5 52,31.5 47,32.5
             C44,33.5 42,34.5 41,36
             C39,39 38,42 38,46
             C37,49 37,52 38,55
             C39,59 41,62 43,64
             C48,67 54,69 60,70
             C67,71 75,71 82,69.5
             C90,68 96,66 100,63
             C103,60 105,57 107,54
             C109,51 111,49 113,47
             C117,45 122,45 126,44.5
             C132,44 138,43.5 143,42
             C149,40 154,38 160,34 Z"
          fill={COLORS.brown}
        />
      </svg>
    </div>
  )
})

export default Mascot

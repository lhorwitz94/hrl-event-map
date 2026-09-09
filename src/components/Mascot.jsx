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
      <svg viewBox="0 0 160 100" className="mascot__svg">
        {/* tail */}
        <path
          d="M22 46 Q0 40 2 24 Q10 34 26 34 Q18 40 22 46 Z"
          fill={COLORS.tan}
          stroke={COLORS.brown}
          strokeWidth="2"
        />
        {/* legs, gallop stretch — double-stroked so they read against any state color */}
        <path d="M45 70 L28 96" stroke={COLORS.tan} strokeWidth="14" strokeLinecap="round" />
        <path d="M45 70 L28 96" stroke={COLORS.brownLight} strokeWidth="10" strokeLinecap="round" />
        <path d="M35 68 L15 95" stroke={COLORS.tan} strokeWidth="14" strokeLinecap="round" />
        <path d="M35 68 L15 95" stroke={COLORS.brown} strokeWidth="10" strokeLinecap="round" />
        <path d="M85 70 L105 96" stroke={COLORS.tan} strokeWidth="14" strokeLinecap="round" />
        <path d="M85 70 L105 96" stroke={COLORS.brownLight} strokeWidth="10" strokeLinecap="round" />
        <path d="M95 68 L118 94" stroke={COLORS.tan} strokeWidth="14" strokeLinecap="round" />
        <path d="M95 68 L118 94" stroke={COLORS.brown} strokeWidth="10" strokeLinecap="round" />
        {/* torso */}
        <ellipse cx="52" cy="58" rx="30" ry="19" fill={COLORS.brown} stroke={COLORS.tan} strokeWidth="3" />
        {/* neck, crouched low into a racing gallop */}
        <path d="M78 44 L110 63" stroke={COLORS.tan} strokeWidth="19" strokeLinecap="round" />
        <path d="M78 44 L110 63" stroke={COLORS.brown} strokeWidth="15" strokeLinecap="round" />
        {/* head + muzzle + ear */}
        <ellipse
          cx="122"
          cy="68"
          rx="18"
          ry="9"
          fill={COLORS.brown}
          stroke={COLORS.tan}
          strokeWidth="3"
          transform="rotate(28 122 68)"
        />
        <ellipse
          cx="142"
          cy="80"
          rx="6"
          ry="4"
          fill={COLORS.brown}
          stroke={COLORS.tan}
          strokeWidth="2"
          transform="rotate(28 142 80)"
        />
        <path d="M112 55 L114 42 L122 56 Z" fill={COLORS.brown} stroke={COLORS.tan} strokeWidth="2" strokeLinejoin="round" />
        {/* jockey leg/boot */}
        <path d="M80 45 L78 65" stroke={COLORS.tan} strokeWidth="13" strokeLinecap="round" />
        <path d="M80 45 L78 65" stroke={COLORS.brown} strokeWidth="9" strokeLinecap="round" />
        {/* jockey torso, leaning forward along the neck */}
        <ellipse
          cx="93"
          cy="34"
          rx="8"
          ry="14"
          fill={COLORS.tan}
          stroke={COLORS.brown}
          strokeWidth="2"
          transform="rotate(-34 93 34)"
        />
        {/* jockey arm reaching to the reins */}
        <path d="M99 29 L114 50" stroke={COLORS.tan} strokeWidth="9" strokeLinecap="round" />
        <path d="M99 29 L114 50" stroke={COLORS.brown} strokeWidth="6" strokeLinecap="round" />
        {/* jockey head + cap */}
        <circle cx="108" cy="19" r="8.5" fill={COLORS.tan} stroke={COLORS.brown} strokeWidth="1.5" />
        <path d="M99 17 A9 9 0 0 1 117 17 Z" fill={COLORS.brown} stroke={COLORS.tan} strokeWidth="2" />
        <path d="M114 16 L126 19 L114 21 Z" fill={COLORS.brown} stroke={COLORS.tan} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
})

export default Mascot

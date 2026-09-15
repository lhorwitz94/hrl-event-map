import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { STATE_POSITIONS, getArcControl } from '../data/mapPoints.js'
import horseMascot from '../assets/horse-mascot.png'

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
      <img src={horseMascot} alt="" className="mascot__svg" />
    </div>
  )
})

export default Mascot

import { useEffect, useRef, useState } from 'react'
import USMap from './components/USMap.jsx'
import EventCard from './components/EventCard.jsx'
import Mascot from './components/Mascot.jsx'
import { getEventByState } from './data/hrlData.js'
import { HOP_ORDER } from './data/mapPoints.js'
import './App.css'

const ONBOARDING_KEY = 'hrl_onboarding_seen'
const MASCOT_STATE_KEY = 'hrl_mascot_state'

function loadMascotState() {
  try {
    const saved = localStorage.getItem(MASCOT_STATE_KEY)
    return HOP_ORDER.includes(saved) ? saved : 'CA'
  } catch {
    return 'CA'
  }
}

function saveMascotState(state) {
  try {
    localStorage.setItem(MASCOT_STATE_KEY, state)
  } catch {
    // localStorage unavailable (private browsing, etc.) — mascot position just won't persist
  }
}

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const mascotRef = useRef(null)
  const initialMascotState = useRef(loadMascotState()).current

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedEvent(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    let hasSeenOnboarding = true
    try {
      hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY) === 'true'
    } catch {
      // treat as seen — skip a tour we can't remember playing
    }
    if (hasSeenOnboarding) return

    let cancelled = false
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    async function runOnboarding() {
      setIsAnimating(true)
      await wait(700)
      for (const state of ['FL', 'KY', 'CA']) {
        if (cancelled) return
        await mascotRef.current.hopTo(state)
        if (cancelled) return
        await wait(500)
      }
      try {
        localStorage.setItem(ONBOARDING_KEY, 'true')
        localStorage.setItem(MASCOT_STATE_KEY, 'CA')
      } catch {
        // best effort — tour will just replay next visit
      }
      setIsAnimating(false)
    }

    runOnboarding()
    return () => {
      cancelled = true
    }
  }, [])

  function handleMapSelectEvent(event) {
    if (isAnimating) return
    if (mascotRef.current.getCurrentState() !== event.state) {
      mascotRef.current.snapTo(event.state)
      saveMascotState(event.state)
    }
    setSelectedEvent(event)
  }

  async function handleLetsRace() {
    if (isAnimating) return
    setIsAnimating(true)
    const current = mascotRef.current.getCurrentState()
    const nextState = HOP_ORDER[(HOP_ORDER.indexOf(current) + 1) % HOP_ORDER.length]
    await mascotRef.current.hopTo(nextState)
    saveMascotState(nextState)
    setTimeout(() => {
      setSelectedEvent(getEventByState(nextState))
      setIsAnimating(false)
    }, 150)
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">HRL &middot; Inaugural 2027 Season</p>
        <h1 className="app__title">The next generation of horse racing is here</h1>
        <p className="app__tagline">
          Three iconic tracks. One championship season. Click a highlighted state to see the event.
        </p>
      </header>

      <main className="app__main">
        <div className="app__actions">
          <a
            className="app__learn-more"
            href="https://www.thehrl.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          <button
            type="button"
            className="app__lets-race"
            onClick={handleLetsRace}
            disabled={isAnimating}
          >
            Let&rsquo;s Race
          </button>
        </div>
        <USMap onSelectEvent={handleMapSelectEvent}>
          <Mascot ref={mascotRef} initialState={initialMascotState} />
        </USMap>
      </main>

      <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <footer className="app__footer">
        Fan-made event map &middot; not an official HRL product &middot; dates subject to change
      </footer>
    </div>
  )
}

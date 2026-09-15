import { useEffect, useRef, useState } from 'react'
import USMap from './components/USMap.jsx'
import EventCard from './components/EventCard.jsx'
import Mascot from './components/Mascot.jsx'
import { getEventByState } from './data/hrlData.js'
import { HOP_ORDER } from './data/mapPoints.js'
import './App.css'

// Visits the later events first and settles on HOP_ORDER[0] (the season's first race),
// so every fresh page load previews the full season before handing control to the user.
const INTRO_TOUR = [...HOP_ORDER.slice(1), HOP_ORDER[0]]

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const mascotRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedEvent(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    let cancelled = false
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    async function runIntroTour() {
      setIsAnimating(true)
      await wait(700)
      for (const state of INTRO_TOUR) {
        if (cancelled) return
        await mascotRef.current.hopTo(state)
        if (cancelled) return
        await wait(500)
      }
      if (!cancelled) setIsAnimating(false)
    }

    runIntroTour()
    return () => {
      cancelled = true
    }
  }, [])

  function handleMapSelectEvent(event) {
    if (isAnimating) return
    if (mascotRef.current.getCurrentState() !== event.state) {
      mascotRef.current.snapTo(event.state)
    }
    setSelectedEvent(event)
  }

  async function handleLetsRace() {
    if (isAnimating) return
    setIsAnimating(true)
    const current = mascotRef.current.getCurrentState()
    const nextState = HOP_ORDER[(HOP_ORDER.indexOf(current) + 1) % HOP_ORDER.length]
    await mascotRef.current.hopTo(nextState)
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
          <Mascot ref={mascotRef} initialState={HOP_ORDER[0]} />
        </USMap>
      </main>

      <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <footer className="app__footer">
        Fan-made event map &middot; not an official HRL product &middot; dates subject to change
      </footer>
    </div>
  )
}

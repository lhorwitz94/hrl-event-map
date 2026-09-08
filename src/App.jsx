import { useEffect, useState } from 'react'
import USMap from './components/USMap.jsx'
import EventCard from './components/EventCard.jsx'
import './App.css'

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedEvent(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">HRL &middot; Inaugural 2027 Season</p>
        <h1 className="app__title">Where the HRL Races</h1>
        <p className="app__tagline">
          Three iconic tracks. One championship season. Click a highlighted state to see the event.
        </p>
      </header>

      <main className="app__main">
        <USMap onSelectEvent={setSelectedEvent} />
      </main>

      <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <footer className="app__footer">
        Fan-made event map &middot; not an official HRL product &middot; dates subject to change
      </footer>
    </div>
  )
}

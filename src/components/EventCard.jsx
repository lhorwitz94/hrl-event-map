export default function EventCard({ event, onClose }) {
  if (!event) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="event-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-card-title"
    >
      <div className="event-card" style={{ '--event-color': event.highlightColor }}>
        <button type="button" className="event-card__close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <span className="event-card__badge">Event {event.eventNumber} of 3</span>

        <h2 id="event-card-title" className="event-card__track">
          {event.track}
        </h2>
        <p className="event-card__city">{event.city}</p>
        <p className="event-card__date">{event.date}</p>

        <a
          className="event-card__cta"
          href={event.trackSite}
          target="_blank"
          rel="noopener noreferrer"
        >
          Track Details
        </a>
      </div>
    </div>
  )
}

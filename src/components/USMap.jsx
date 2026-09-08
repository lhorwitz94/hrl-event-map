import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { COLORS, getEventByStateName } from '../data/hrlData.js'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

export default function USMap({ onSelectEvent }) {
  const [hoveredState, setHoveredState] = useState(null)

  return (
    <div className="us-map">
      <ComposableMap projection="geoAlbersUsa" className="us-map__svg">
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const event = getEventByStateName(geo.properties.name)
              const isHovered = hoveredState === geo.properties.name

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => event && setHoveredState(geo.properties.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => event && onSelectEvent(event)}
                  tabIndex={event ? 0 : -1}
                  aria-label={event ? `${event.stateName}: ${event.track} event details` : undefined}
                  onKeyDown={(e) => {
                    if (event && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onSelectEvent(event)
                    }
                  }}
                  style={{
                    default: {
                      fill: event ? event.highlightColor : COLORS.brown,
                      stroke: COLORS.tan,
                      strokeWidth: 0.75,
                      outline: 'none',
                      cursor: event ? 'pointer' : 'default',
                      transition: 'fill 0.15s ease',
                    },
                    hover: {
                      fill: event ? COLORS.accentGoldLight : COLORS.brown,
                      stroke: COLORS.tan,
                      strokeWidth: 0.75,
                      outline: 'none',
                      cursor: event ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: event ? COLORS.accentGoldLight : COLORS.brown,
                      stroke: COLORS.tan,
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                  }}
                  className={isHovered ? 'us-map__state us-map__state--hovered' : 'us-map__state'}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}

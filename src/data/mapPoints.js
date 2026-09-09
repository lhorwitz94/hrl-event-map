// ---------------------------------------------------------------------------
// HRL Event Map — mascot travel points
//
// Percent-of-map-container coordinates for CA / FL / KY, measured from the
// rendered react-simple-maps geoAlbersUsa SVG. Plain bounding-box centers
// land too close to (or outside) each state's actual landmass — CA and KY
// sit right against neighboring-state borders, and FL's bbox center falls
// in open water because of the panhandle — so these are each the most
// "interior" point of the landmass (max distance from its own border),
// found by sampling the rendered path with isPointInFill. That keeps the
// mascot icon's full width clear of the border when it lands.
//
// Arc control points are hand-picked (not computed) since only 3 state
// pairs ever exist — each raises the hop's bezier apex above the straight
// midpoint so the mascot visibly arcs between states.
// ---------------------------------------------------------------------------

export const HOP_ORDER = ['CA', 'FL', 'KY']

export const STATE_POSITIONS = {
  CA: { x: 9.46, y: 53.83 },
  KY: { x: 72.6, y: 51.32 },
  FL: { x: 81.26, y: 82.43 },
}

const HOP_ARC_CONTROLS = {
  CA_FL: { x: 46, y: 40 },
  FL_KY: { x: 76, y: 52 },
  CA_KY: { x: 42, y: 29 },
}

export function getArcControl(fromState, toState) {
  const key = [fromState, toState].sort().join('_')
  return HOP_ARC_CONTROLS[key]
}

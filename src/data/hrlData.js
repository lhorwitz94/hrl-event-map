// ---------------------------------------------------------------------------
// HRL Event Map — seed data
//
// TODO(data freshness): thehrl.com currently lists venue + city + month/year
// only for each 2027 event — no day-level dates yet ("full schedule to be
// announced"). Re-pull from thehrl.com once the league publishes exact
// dates, and update the `date` field below — that's the only field that
// should need to change.
//
// Brand colors pulled directly from thehrl.com's inline styles (Squarespace
// site, checked 2026-09-08):
//   - cream/tan  #FFFAE8  (site background / light text-on-dark)
//   - dark brown #402D18  (dark text-on-light)
// thehrl.com doesn't use a third accent color anywhere in its CSS, so
// ACCENT_GOLD below is NOT sourced from their stylesheet — it's a saddle-gold
// drawn from the jockey silks/dust tones in their brand photography (see
// hrl-share-preview-image.jpg). Swap for an official accent hex if/when HRL
// publishes one.
// ---------------------------------------------------------------------------

export const COLORS = {
  tan: '#FFFAE8',
  brown: '#402D18',
  brownLight: '#5A4530',
  accentGold: '#C79A45', // TODO: replace with official HRL accent once sourced
  accentGoldLight: '#DDB768',
}

export const events = [
  {
    id: 'santa-anita',
    eventNumber: 1,
    state: 'CA',
    stateName: 'California',
    track: 'Santa Anita Park',
    city: 'Los Angeles, CA',
    date: 'February 2027',
    trackSite: 'https://www.santaanita.com/',
    highlightColor: COLORS.accentGold,
  },
  {
    id: 'gulfstream-park',
    eventNumber: 2,
    state: 'FL',
    stateName: 'Florida',
    track: 'Gulfstream Park',
    city: 'Miami, FL',
    date: 'March 2027',
    trackSite: 'https://www.gulfstreampark.com/',
    highlightColor: COLORS.accentGold,
  },
  {
    id: 'keeneland',
    eventNumber: 3,
    state: 'KY',
    stateName: 'Kentucky',
    track: 'Keeneland',
    city: 'Lexington, KY',
    date: 'Date TBD',
    trackSite: 'https://www.keeneland.com/',
    highlightColor: COLORS.accentGold,
  },
]

export function getEventByStateName(stateName) {
  return events.find((e) => e.stateName === stateName)
}

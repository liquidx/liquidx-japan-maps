
import * as turf from '@turf/turf'

export const parseTrainLines = async (response, wardsGeojson) => {
  let geojson = await response.json()
  return filterTrainLines(geojson, wardsGeojson)
}

export const filterTrainLines = async (linesGeojson, wardsGeojson) => {
  let lines = linesGeojson.features
    .filter((f) => f.geometry.type == 'LineString')
    .filter(f => {
      let contained = false;
      for (let ward of wardsGeojson.features) {
        if (turf.booleanIntersects(ward, f)) {
          contained = true;
          break;
        }
      }
      return contained;
    })
    .map((f) => {
      //console.log(f.geometry.coordinates)
      let companyName = f.properties.N02_004
      let lineName = f.properties.N02_003

      console.log(f.properties.N02_003)
      // let line = turf.lineString(f.geometry.coordinates)
      // let properties = f.properties
      // let ward = turf.nearestPointOnLine(wardsGeojson, line)
      // properties.ward = ward.properties.ward_ja
      // return turf.lineString(f.geometry.coordinates, properties)
    })
  console.log(lines.length)
  return turf.featureCollection(lines)
}
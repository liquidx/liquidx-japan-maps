import fs from 'fs';
import { Command } from 'commander';
import { filterTrainLines } from './src/lib/data-national-land.js'
import xml2js from 'xml2js'
import * as turf from '@turf/turf'

const gmlToGeojson = async (gml) => {
  const xmlParser = new xml2js.Parser()
  const root = await xmlParser.parseStringPromise(gml)

  const polygons = []
  root['ksj:Dataset']['gml:Curve'].forEach(curve => {
    curve['gml:segments'][0]['gml:LineStringSegment'].forEach(segment => {
      // const points = segment['gml:posList'][0]
      //   .split('\n')
      //   .map(pos => pos.split(' ').map(p => parseFloat(p)))
      const points = segment['gml:posList'][0]
        .split('\r\n')
        .filter(p => p.trim() !== '')
        .map(p => p.trim().split(' ').map(parseFloat))
        .map(p => [p[1], p[0]])
      console.log(points[0], points.at(-1))
      const polygon = turf.polygon([points])
      polygons.push(polygon)
    })
  })
  // let child = root.childNodes()
  // console.log(child[0]);
  // .text().split('\n').map((coord) => {
  //   const [x, y] = coord.split(' ')
  //   return [parseFloat(x), parseFloat(y)]
  // })

  return turf.featureCollection(polygons)
}


const main = () => {
  const program = new Command();

  program.command('convert-gml <gml>')
    .requiredOption('--output <outputPath>', 'output path')
    .action(async (gmlPath, options) => {
      const gml = fs.readFileSync(gmlPath)
      const geojson = await gmlToGeojson(gml)
      fs.writeFileSync(options.output, JSON.stringify(geojson, null, 2));
    })

  program.command('filter-train-lines <segmentsPath> <wardsPath>')
    .requiredOption('--output <outputPath>', 'output path')
    .action((segmentsPath, wardsPath, options) => {
      const segments = JSON.parse(fs.readFileSync(segmentsPath, 'utf8'))
      const wards = JSON.parse(fs.readFileSync(wardsPath, 'utf8'))
      const tokyoTrainLines = filterTrainLines(segments, wards)
      fs.writeFileSync(options.output, JSON.stringify(tokyoTrainLines, null, 2));
    })

  program.command('separate-train-lines <segmentsPath>')
    .requiredOption('--output <outputPath>', 'output path')
    .action((segmentsPath, options) => {
      const segments = JSON.parse(fs.readFileSync(segmentsPath, 'utf8'))
      let lines = {}
      for (let segment of segments.features) {
        const line = segment.properties.N02_003
        const company = segment.properties.N02_004
        const name = `${company}--${line}`
        if (lines[name] === undefined) {
          lines[name] = []
        }
        lines[name].push(segment)
      }

      for (let line in lines) {
        console.log(line)
        let lineFeatureCollection = {
          type: 'FeatureCollection',
          name: line,
          features: lines[line]
        }
        fs.writeFileSync(`${options.output}/${line}.geojson`, JSON.stringify(lineFeatureCollection));
      }

      const index = Object.keys(lines)
      fs.writeFileSync(`${options.output}/index.json`, JSON.stringify(index, null, 2));
    })
  program.parse();
}

main();

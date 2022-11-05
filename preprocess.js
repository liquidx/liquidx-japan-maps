import fs from 'fs';
import { Command } from 'commander';
import { filterTrainLines } from './src/lib/data-national-land.js'

const main = () => {
  const program = new Command();
  program.command('filter-train-lines <segmentsPath> <wardsPath>')
    .requiredOption('--output <outputPath>', 'output path')
    .action((segmentsPath, wardsPath, options) => {
      const segments = JSON.parse(fs.readFileSync(segmentsPath, 'utf8'))
      const wards = JSON.parse(fs.readFileSync(wardsPath, 'utf8'))
      const tokyoTrainLines = filterTrainLines(segments, wards)
      fs.writeFileSync(options.outputPath, JSON.stringify(tokyoTrainLines, null, 2));
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

// @ts-nocheck

import { error } from '@sveltejs/kit';
import { parseTokyoStations, parseTokyoAreas, groupAreasByWard } from '../../../lib/data-tokyo.js';
import { parseTrainLines } from '../../../lib/data-national-land.js';

/** @type {import('../../../../.svelte-kit/types/src/routes/map/$types').PageLoad} */
export async function load({ fetch, params }) {
  switch (params.slug) {
    case 'points': {
      const stations = await fetch('/tokyo-stations.csv').then(res => parseTokyoStations(res))
      const outline = await fetch('/japan-data/tokyo-mainland.geojson').then((res) => res.json())
      const areas = await fetch('/japan-data/tokyo-areas.geojson').then(res => parseTokyoAreas(res))
      const areasByWard = groupAreasByWard(outline, areas)
      return { stations, outline, areas, areasByWard }
    }
    case 'lines': {
      const japanBoundingBox = await fetch('/japan-data/japan-boundingbox.geojson').then((res) => res.json())
      const trainLineNames = await fetch('/japan-data/train-lines/index.json').then((res) => res.json())
      const trainLines = {}
      for (let name of trainLineNames) {
        trainLines[name] = await fetch(`/data/train-lines/${name}.geojson`).then((res) => res.json())
      }
      return { japanBoundingBox, trainLines }
    }
    case 'polygons': {
      const outline = await fetch('/japan-data/tokyo-mainland.geojson').then((res) => res.json())
      const areas = await fetch('/japan-data/tokyo-areas.geojson').then(res => parseTokyoAreas(res))
      return { outline, areas }
    }
    case 'green': {
      const greenAreas = await fetch('/japan-data/tokyo-green.geojson').then((res) => res.json())
      const moreGreenArea = await fetch('/japan-data/A45-19_13.geojson').then((res) => res.json())
      // merge areas
      //const japanGreenAreas = await fetch('/japan-data/japan-green.geojson').then((res) => res.json())
      greenAreas.features = greenAreas.features.concat(moreGreenArea.features)
      const outline = await fetch('/japan-data/tokyo-mainland.geojson').then((res) => res.json())
      const points = await fetch('/japan-data/tokyo-parks.geojson').then((res) => res.json())
      return { outline, areas: greenAreas, points }

    }
  }

  throw error(404, 'Not found');
}
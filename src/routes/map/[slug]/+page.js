// @ts-nocheck

import { error } from '@sveltejs/kit';
import { parseTokyoStations, parseTokyoAreas, groupAreasByWard } from '../../../lib/data-tokyo.js';
import { parseTrainLines } from '../../../lib/data-national-land.js';

/** @type {import('../../../../.svelte-kit/types/src/routes/map/$types').PageLoad} */
export async function load({ fetch, params }) {
  switch (params.slug) {
    case 'points': {
      const stations = await fetch('/tokyo-stations.csv').then(res => parseTokyoStations(res))
      const outline = await fetch('/tokyo-mainland.geojson').then((res) => res.json())
      const areas = await fetch('/tokyo-areas.geojson').then(res => parseTokyoAreas(res))
      const areasByWard = groupAreasByWard(outline, areas)
      return { stations, outline, areas, areasByWard }
    }
    case 'lines': {
      const japanBoundingBox = await fetch('/japan-boundingbox.geojson').then((res) => res.json())
      const trainLineNames = await fetch('/data/train-lines/index.json').then((res) => res.json())
      const trainLines = {}
      for (let name of trainLineNames) {
        trainLines[name] = await fetch(`/data/train-lines/${name}.geojson`).then((res) => res.json())
      }
      return { japanBoundingBox, trainLines }
    }
    case 'polygons': {
      const outline = await fetch('/tokyo-mainland.geojson').then((res) => res.json())
      const areas = await fetch('/tokyo-areas.geojson').then(res => parseTokyoAreas(res))
      return { outline, areas }
    }
    case 'green': {
      const greenAreas = await fetch('/tokyo-green.geojson').then((res) => res.json())
      const outline = await fetch('/tokyo-mainland.geojson').then((res) => res.json())
      return { outline, areas: greenAreas }

    }
  }

  throw error(404, 'Not found');
}
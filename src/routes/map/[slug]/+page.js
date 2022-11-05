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
      const outline = await fetch('/tokyo-mainland.geojson').then((res) => res.json())
      const trainlines = await fetch('/N02-21_RailroadSection.geojson').then(res => parseTrainLines(res, outline))
      return {}
    }
  }

  throw error(404, 'Not found');
}
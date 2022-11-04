import { csv } from 'd3';
import { csvParse } from 'd3-dsv';

const tokyoNonLandAreas = [
  "羽田沖水面及び中央防波堤外側付近", // Oita
  "‐", // Minato
  "多摩川河川敷（下流）",
  "水面調査区" // Chuo
]

const tokyoIslands = [
  "",
  "小笠原村",
  "大島町",
  "神津島村",
  "青ヶ島村",
  "八丈町",
  "新島村",
  "御蔵島村",
  "三宅村",
  "利島村"
]

const groupAreasByWard = (tokyoOutline, tokyoAreas) => {
  let tokyoWardsCities = tokyoOutline.features.map((f) => f.properties.ward_ja);
  let groups = {};
  for (let name of tokyoWardsCities) {
    groups[name] = {
      type: "FeatureCollection",
      features: tokyoAreas.features
        .filter((f) => f.properties.CITY_NAME == name)
        .filter((f) => f.properties.S_NAME.trim().length > 0)
        .filter((f) => !tokyoNonLandAreas.includes(f.properties.S_NAME))
    };
  }
  return groups;
}

const filterNonMainlandAreas = (tokyoAreas) => {
  let features = tokyoAreas.features
    .filter((f) => !tokyoIslands.includes(f.properties.CITY_NAME))
    .filter((f) => f.properties.S_NAME.trim().length > 0)
    .filter((f) => !tokyoNonLandAreas.includes(f.properties.S_NAME));
  return {
    type: "FeatureCollection",
    features: features
  };
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const stations = await fetch('/tokyo-stations.csv')
    .then((res) => res.text())
    .then(res => csvParse(res))
    .then(res => res.filter((d) => d.Lat && d.Lng && d["Inside Tokyo"] != "0"))

  const outline = await fetch('/tokyo-mainland.geojson')
    .then((res) => res.json())

  const areas = await fetch('/tokyo-areas.geojson')
    .then((res) => res.json())
    .then((areas) => filterNonMainlandAreas(areas))

  const areasByWard = groupAreasByWard(outline, areas)

  return { stations, outline, areas, areasByWard }
}
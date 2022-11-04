<script>
	// @ts-nocheck

	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';

	import { page } from '$app/stores';

	let stations = [];
	let areas = { features: [] };
	let outline = { features: [] };
	let areasByWard = { wards: [] };

	let colorSchemeName = 'interpolateRainbow';
	let width = 800;
	let height = 600;
	let scale = 1;

	let mapContainer = null;

	onMount(() => {
		stations = $page.data.stations;
		areas = $page.data.areas;
		outline = $page.data.outline;
		areasByWard = $page.data.areasByWard;

		console.log($page.data);

		let map = createMap(outline, stations, areas, areasByWard);
		mapContainer.appendChild(map.node());
	});

	onDestroy(() => {
		if (mapContainer && mapContainer.children) {
			mapContainer.children.forEach((e) => mapContainer.removeChild(e));
		}
	});

	/**
	 * @param {{append: (arg0: string) => {(): any;new (): any;append: {(arg0: string): {(): any;new (): any;attr: {(arg0: string, arg1: string): {(): any;new (): any;attr: {(arg0: string, arg1: any): {(): any;new (): any;attr: {(arg0: string, arg1: number): {(): any;new (): any;attr: {(arg0: string, arg1: any): void;new (): any;};};new (): any;};};new (): any;};};new (): any;};};new (): any;};};}} mapLayer
	 * @param {{features: never[];}} outline
	 * @param {(arg0: { features: never[]; }) => any} path
	 * @param {{ append: (arg0: string) => { (): any; new (): any; append: { (arg0: string): { (): any; new (): any; attr: { (arg0: string, arg1: string): { (): any; new (): any; attr: { (arg0: string, arg1: any): { (): any; new (): any; attr: { (arg0: string, arg1: number): { (): any; new (): any; attr: { (arg0: string, arg1: any): void; new (): any; }; }; new (): any; }; }; new (): any; }; }; new (): any; }; }; new (): any; }; }; }} layer
	 */
	function drawWardsCities(path, layer, outline, strokeColor) {
		layer
			.append('g')
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', strokeColor)
			.attr('stroke-width', 0.5)
			.attr('d', path(outline));
	}

	function drawArea(path, layer, feature, strokeColor, fillColor, dotColor, dotRadius) {
		const center = path.centroid(feature);

		// layer
		// 	.append('g')
		// 	.append('path')
		// 	.attr('fill', fillColor)
		// 	.attr('stroke', strokeColor)
		// 	.attr('stroke-width', 0.2)
		// 	.attr('d', path(feature));

		layer
			.append('circle')
			.attr('fill', dotColor)
			.attr('cx', center[0])
			.attr('cy', center[1])
			.attr('r', dotRadius);
	}

	function createMap(tokyoOutline, tokyoStations, tokyoAreas, tokyoAreasByWard) {
		const projection = d3.geoMercator().fitSize([width, height], tokyoOutline);
		const path = d3.geoPath(projection);

		const colorRange = d3[colorSchemeName];

		const stationFillColor = d3.color(colorRange(1));
		const cityLineColor = d3.color(colorRange(0));
		const areaPointColor = d3.color(colorRange(0));
		const areaPointRadius = 1.0;
		const stationPointRadius = 1.0;

		const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
		const mapLayer = svg.append('g');
		const stationsLayer = mapLayer.append('g');

		mapLayer.attr('transform', `scale(${scale}, ${scale})`);

		const areaColor = 'rgba(0, 0, 0, 1)';

		drawWardsCities(path, mapLayer, tokyoOutline, cityLineColor);

		const random = d3.randomUniform(0.5, 1.0);

		const wardCities = Object.keys(tokyoAreasByWard);
		let i = 0;
		for (let ward of wardCities) {
			let featureCollection = tokyoAreasByWard[ward];
			let features = featureCollection.features;
			const areaFillColor = colorRange(parseFloat(i) / wardCities.length);
			for (let feature of features) {
				drawArea(
					path,
					mapLayer,
					feature,
					areaColor,
					areaFillColor,
					areaPointColor,
					areaPointRadius
				);
			}
			i += 1;
		}

		let stationExtentLng = d3.extent(tokyoStations, (d) => d.Lng);
		let stationExtentLat = d3.extent(tokyoStations, (d) => d.Lat);
		let stationLng = d3.scaleSequential().domain(stationExtentLng).range([0, 1]);

		for (const station of tokyoStations) {
			const center = projection([station.Lng, station.Lat]);
			const fillColor = colorRange(stationLng(station.Lng));
			stationsLayer
				.append('circle')
				.attr('fill', fillColor)
				.attr('stroke', stationFillColor)
				.attr('stroke-width', 0.2)
				.attr('cx', center[0])
				.attr('cy', center[1])
				.attr('r', stationPointRadius);
		}

		return svg;
	}
</script>

<svelte:head>
	<title>Map</title>
	<meta name="description" content="Render Map" />
</svelte:head>

<div class="p-4">
	<div>Areas: {areas.features.length}</div>
	<div class="map" bind:this={mapContainer} />
</div>

<script>
	// @ts-nocheck

	import { onDestroy } from 'svelte';
	import * as d3 from 'd3';

	export let stations = [];
	export let areas = { features: [] };
	export let outline = { features: [] };
	export let areasByWard = { wards: [] };
	export let width = 800;
	export let height = 600;

	let colorSchemeName = 'interpolateRainbow';
	let scale = 1;

	let mapContainer = null;

	$: redrawMap(mapContainer, outline, stations, areas, areasByWard);

	onDestroy(() => {
		if (mapContainer && mapContainer.children) {
			mapContainer.innerHTML = '';
		}
	});

	/**
	 * @param {{append: (arg0: string) => {(): any;new (): any;append: {(arg0: string): {(): any;new (): any;attr: {(arg0: string, arg1: string): {(): any;new (): any;attr: {(arg0: string, arg1: any): {(): any;new (): any;attr: {(arg0: string, arg1: number): {(): any;new (): any;attr: {(arg0: string, arg1: any): void;new (): any;};};new (): any;};};new (): any;};};new (): any;};};new (): any;};};}} mapLayer
	 * @param {{features: never[];}} outline
	 * @param {(arg0: { features: never[]; }) => any} path
	 * @param {{ append: (arg0: string) => { (): any; new (): any; append: { (arg0: string): { (): any; new (): any; attr: { (arg0: string, arg1: string): { (): any; new (): any; attr: { (arg0: string, arg1: any): { (): any; new (): any; attr: { (arg0: string, arg1: number): { (): any; new (): any; attr: { (arg0: string, arg1: any): void; new (): any; }; }; new (): any; }; }; new (): any; }; }; new (): any; }; }; new (): any; }; }; }} layer
	 */
	function drawWards(path, layer, outline, strokeColor, strokeWidth) {
		layer
			.append('g')
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', strokeColor)
			.attr('stroke-width', strokeWidth)
			.attr('d', path(outline));
	}

	function drawArea(path, layer, feature, strokeColor, fillColor, dotColor, dotRadius) {
		const center = path.centroid(feature);

		layer
			.append('g')
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', strokeColor)
			.attr('stroke-width', 0.2)
			.attr('d', path(feature));

		layer
			.append('circle')
			.attr('fill', dotColor)
			.attr('cx', center[0])
			.attr('cy', center[1])
			.attr('r', dotRadius);
	}

	function redrawMap(parent, tokyoOutline, tokyoStations, tokyoAreas, tokyoAreasByWard) {
		// TODO: I have no idea why this is being executed on node?
		try {
			if (!document) {
				console.log('Not in DOM');
				return;
			}
		} catch (error) {
			console.log('Not in DOM');
			return;
		}

		// Check if any of the data is empty
		if (
			!tokyoOutline.features ||
			tokyoOutline.features.length === 0 ||
			tokyoStations.length === 0 ||
			!tokyoAreas.features ||
			tokyoAreas.features.length === 0
		) {
			return;
		}

		if (!parent) {
			console.log('no map container');
			return;
		}

		const projection = d3.geoMercator().fitSize([width, height], tokyoOutline);
		const path = d3.geoPath(projection);

		const colorRange = d3[colorSchemeName];

		const stationStrokeColor = d3.color('lightgrey'); //d3.color(colorRange(1));
		const wardStrokeColor = d3.color('white');
		wardStrokeColor.opacity = 0.5;
		const wardStrokeWidth = 0.4;
		const areaColor = d3.color(colorRange(1));
		areaColor.opacity = 0.7;
		const areaPointColor = d3.color(colorRange(0));
		const areaPointRadius = 1.0;
		const stationPointRadius = 1.0;

		const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
		const mapLayer = svg.append('g');
		const stationsLayer = mapLayer.append('g');

		mapLayer.attr('transform', `scale(${scale}, ${scale})`);

		drawWards(path, mapLayer, tokyoOutline, wardStrokeColor, wardStrokeWidth);

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
		let stationLng = d3.scaleSequential().domain(stationExtentLng).range([0.5, 1]);

		for (const station of tokyoStations) {
			const center = projection([station.Lng, station.Lat]);
			//const fillColor = colorRange(stationLng(station.Lng));
			const fillColor = d3.color('white');
			const lineCount = station.Lines ? parseInt(station.Lines, 0) : 0;
			stationsLayer
				.append('circle')
				.attr('fill', fillColor)
				.attr('stroke', stationStrokeColor)
				.attr('stroke-width', 0.2)
				.attr('cx', center[0])
				.attr('cy', center[1])
				.attr('r', stationPointRadius * lineCount);
		}

		parent.innerHTML = '';
		parent.appendChild(svg.node());
		return svg;
	}
</script>

<div
	class="p-4 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-800 via-violet-900 to-purple-900"
>
	<div class="map" bind:this={mapContainer} />
</div>

<script>
	// @ts-nocheck

	import { onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import * as turf from '@turf/turf';

	export let trainLines = {};
	export let japanBoundingBox = {};
	export let width = 800;
	export let height = 600;

	let colorSchemeName = 'interpolateRainbow';
	let scale = 1;

	let mapContainer = null;

	$: redrawMap(mapContainer, trainLines, japanBoundingBox);

	onDestroy(() => {
		if (mapContainer && mapContainer.children) {
			mapContainer.innerHTML = '';
		}
	});

	function drawLine(layer, lineFeature, lineColor, thickness, width, height, path) {
		layer
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', lineColor)
			.attr('stroke-width', thickness)
			.attr('d', path(lineFeature));
	}

	function redrawMap(parent, trainLines, japanBoundingBox) {
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
		if (!trainLines || Object.values(trainLines).length === 0) {
			return;
		}

		if (!parent) {
			console.log('no map container');
			return;
		}

		// d3 projection with geoMercator with minLat maxLat minLng maxLng
		const allLines = {
			type: 'FeatureCollection',
			features: d3.merge(Object.values(trainLines).map((line) => line.features))
		};
		const projection = d3.geoMercator().fitSize([width, height], allLines);
		const path = d3.geoPath(projection);

		const colorRange = d3[colorSchemeName];
		const lineColor = d3.color('lightgrey'); //d3.color(colorRange(1));

		const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
		const mapLayer = svg.append('g');

		console.log(turf.bbox(japanBoundingBox));
		let i = 0;
		for (const line in trainLines) {
			//const fillColor = colorRange(stationLng(station.Lng));
			const lineFeature = trainLines[line];
			let color = lineColor;
			let thickness = 1;
			if (line.match('新幹線')) {
				color = d3.color('red');
				thickness = 4;
			}
			drawLine(mapLayer, lineFeature, color, thickness, width, height, path);

			if (i >= 10) {
				break;
			}
		}

		parent.innerHTML = '';
		parent.appendChild(svg.node());
		return svg;
	}
</script>

<div class="p-4 bg-gradient-to-bl from-gray-800 to-gray-700">
	<div class="map" bind:this={mapContainer} />
</div>

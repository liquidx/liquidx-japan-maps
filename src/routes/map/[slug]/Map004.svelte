<script>
	// @ts-nocheck

	import { onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import * as turf from '@turf/turf';

	export let areas = { features: [] };
	export let outline = { features: [] };
	export let points = { features: [] };
	export let width = 800;
	export let height = 600;

	//let colorSchemeName = 'interpolateRainbow';
	let colorSchemeName = 'interpolateWarm';
	let mapContainer = null;

	$: redrawMap(mapContainer, outline, areas, points);

	onDestroy(() => {
		if (mapContainer && mapContainer.children) {
			mapContainer.innerHTML = '';
		}
	});

	function drawArea(path, layer, feature, strokeColor, fillColor) {
		layer
			.append('g')
			.append('path')
			.attr('fill', fillColor)
			.attr('stroke', strokeColor)
			.attr('stroke-width', 0.5)
			.attr('d', path(feature));
	}

	function redrawMap(parent, outline, areas, points) {
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
		if (!outline) {
			return;
		}

		if (!parent) {
			console.log('no map container');
			return;
		}

		console.log('areas', areas.features);
		console.log(points);

		const projection = d3.geoMercator().fitSize([width, height], outline);
		const path = d3.geoPath(projection);

		//const areaStrokeColor = d3.color('white');
		const areaFillColor = 'rgba(255, 255, 255, 0.1)'; // 'none';
		const fillScheme = d3[colorSchemeName];
		//		const tokyoCenter = turf.point([139.75271043070964, 35.684749323891424]);

		const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
		const mapLayer = svg.append('g');

		const random = d3.randomUniform(0.4, 0.8);
		if (areas.features) {
			for (let area of areas.features) {
				const areaStrokeColor = 'none';
				const areaFillColor = d3.color('darkgreen').hex();
				// const center = turf.center(area);
				// const distance = turf.distance(tokyoCenter, center);
				// const frac = 0.5 - distance / 100;
				// const areaFillColor = fillScheme(frac);
				drawArea(
					path,
					mapLayer,
					turf.rewind(area, { reverse: true }),
					areaStrokeColor,
					areaFillColor
				);
			}
		}

		if (points.features) {
			const areaFillColor = d3.color('darkgreen').hex();
			for (let point of points.features) {
				mapLayer
					.append('circle')
					.attr('cx', projection(point.geometry.coordinates)[0])
					.attr('cy', projection(point.geometry.coordinates)[1])
					.attr('r', 2)
					.attr('fill', areaFillColor);
			}
		}

		// Draw outline
		mapLayer
			.append('g')
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'white')
			.attr('stroke-width', 1.0)
			.attr('d', path(outline));

		parent.innerHTML = '';
		parent.appendChild(svg.node());
		return svg;
	}
</script>

<div
	class="p-4 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-600 via-gray-900 to-gray-700"
>
	<div class="map" bind:this={mapContainer} />
</div>

<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import Map001 from './Map001.svelte';
	import { page } from '$app/stores';

	let stations = [];
	let areas = { features: [] };
	let outline = { features: [] };
	let areasByWard = { wards: [] };
	let width = 1600;
	let height = 1200;

	let colorSchemeName = 'interpolateRainbow';
	let scale = 1;

	onMount(() => {
		stations = $page.data.stations;
		areas = $page.data.areas;
		outline = $page.data.outline;
		areasByWard = $page.data.areasByWard;

		console.log($page.data);
	});
</script>

<svelte:head>
	<title>Map</title>
	<meta name="description" content="Render Map" />
</svelte:head>

<div class="p-4">
	<div>Areas: {areas.features.length}</div>
	<div class="relative">
		<Map001 {stations} {areas} {outline} {areasByWard} {width} {height} />
		<div class="absolute bottom-0 left-0 opacity-50">
			<div class="font-bold text-7xl text-gray-300 p-16">Stations of Tokyo</div>
		</div>
	</div>
</div>

<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import Map001 from './Map001.svelte';
	import { page } from '$app/stores';

	let stations = [];
	let areas = { features: [] };
	let outline = { features: [] };
	let areasByWard = { wards: [] };
	let width = 800;
	let height = 600;

	let colorSchemeName = 'interpolateRainbow';
	let scale = 1;

	let mapContainer = null;

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
	<div class="w-[800px]">
		<Map001 {stations} {areas} {outline} {areasByWard} {width} {height} />
		<div class="map" bind:this={mapContainer} />
	</div>
</div>

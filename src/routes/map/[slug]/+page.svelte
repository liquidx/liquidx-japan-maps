<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import Map001 from './Map001.svelte';
	import Map002 from './Map002.svelte';
	import Map003 from './Map003.svelte';
	import Map004 from './Map004.svelte';
	import { page } from '$app/stores';

	let stations = [];
	let areas = { features: [] };
	let outline = { features: [] };
	let areasByWard = { wards: [] };
	let japanBoundingBox = {};
	let trainLines = {};
	let width = 1600;
	let height = 1200;

	onMount(() => {
		if ($page.data.stations) {
			stations = $page.data.stations;
		}
		if ($page.data.areas) {
			areas = $page.data.areas;
		}
		if ($page.data.outline) {
			outline = $page.data.outline;
		}
		if ($page.data.areasByWard) {
			areasByWard = $page.data.areasByWard;
		}
		if ($page.data.trainLines) {
			trainLines = $page.data.trainLines;
		}
		if ($page.data.japanBoundingBox) {
			japanBoundingBox = $page.data.japanBoundingBox;
		}
	});
</script>

<svelte:head>
	<title>Map</title>
	<meta name="description" content="Render Map" />
</svelte:head>

<div class="p-4">
	<div class="relative">
		{#if $page.params.slug == 'points'}
			<Map001 {stations} {areas} {outline} {areasByWard} {width} {height} />
			<div class="absolute bottom-0 left-0 opacity-50">
				<div class="font-bold text-7xl text-gray-300 p-16">Stations of Tokyo</div>
			</div>
		{:else if $page.params.slug == 'lines'}
			<Map002 {trainLines} {japanBoundingBox} {width} {height} />
			<div class="absolute bottom-0 left-0 opacity-50">
				<div class="font-light text-5xl text-gray-300 p-16">Lines of Japan</div>
			</div>
		{:else if $page.params.slug == 'polygons'}
			<Map003 {areas} {outline} {width} {height} />
			<div class="absolute bottom-0 left-0 opacity-50">
				<div class="font-bold text-xl text-gray-300 p-16">Polygons of Tokyo</div>
			</div>
		{:else if $page.params.slug == 'green'}
			<Map004 {areas} {outline} {width} {height} />
			<div class="absolute bottom-0 left-0 opacity-50">
				<div class="font-bold text-xl text-gray-300 p-16">Green of Tokyo</div>
			</div>
		{/if}
	</div>
</div>

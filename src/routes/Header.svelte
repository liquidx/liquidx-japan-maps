<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header class="p-4 bg-gray-300 min-h-screen text-sm">
	<div class="text-sm font-bold">Maps</div>
	<ul>
		<li><a href="/map/points/" class="underline">Points</a></li>
		<li><a href="/map/lines/" class="underline">Lines</a></li>
		<li><a href="/map/polygons/" class="underline">Polygons</a></li>
		<li><a href="/map/green/" class="underline">Green</a></li>
	</ul>
</header>

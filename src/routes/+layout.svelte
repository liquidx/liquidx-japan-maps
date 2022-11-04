<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app grid grid-cols-8 bg-gray-200 min-h-screen min-w-screen">
	<div class="col-span-2 lg:col-span-1">
		<Header />
	</div>

	<main class="cols-span-6 lg:col-span-7">
		<slot />
	</main>
</div>

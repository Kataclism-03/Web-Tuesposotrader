<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/base.css';
	import '../styles/layout.css';
	import '../styles/animations.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

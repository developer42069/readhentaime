<script lang="ts">
	import { onMount } from 'svelte';
	import { trackAdImpression } from '$lib/gtm';

	onMount(() => {
		// Prevent duplicate script injections if layout re-renders
		if (document.getElementById('juicyads-popunder')) return;

		const script = document.createElement('script');
		script.id = 'juicyads-popunder';
		script.src =
			'https://js.juicyads.com/jp.php?c=3494w233w244u4r2p26453e434&u=https%3A%2F%2Freadhentai.me%2F';
		script.type = 'text/javascript';
		document.body.appendChild(script);

		// Track ad impression
		trackAdImpression('juicyads', 'popunder', '3494w233w244u4r2p26453e434');
	});
</script>

<!-- Optional: small invisible wrapper -->
<div style="display:none;"></div>

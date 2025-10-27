<script lang="ts">
	import { onMount } from 'svelte';
	import { trackAdImpression, trackAdClick } from '$lib/gtm';

	onMount(() => {
		// Load JuicyAds main script if not already loaded
		if (!document.getElementById('juicyads-main-script')) {
			const mainScript = document.createElement('script');
			mainScript.id = 'juicyads-main-script';
			mainScript.src = 'https://poweredby.jads.co/js/jads.js';
			mainScript.type = 'text/javascript';
			mainScript.setAttribute('data-cfasync', 'false');
			mainScript.async = true;
			document.head.appendChild(mainScript);

			// Initialize adsbyjuicy after script loads
			mainScript.onload = () => {
				if (typeof window !== 'undefined') {
					(window as any).adsbyjuicy = (window as any).adsbyjuicy || [];
					(window as any).adsbyjuicy.push({ adzone: 1103943 });
				}
			};
		} else {
			// Script already loaded, just push the ad zone
			if (typeof window !== 'undefined' && (window as any).adsbyjuicy) {
				(window as any).adsbyjuicy.push({ adzone: 1103943 });
			}
		}

		// Track ad impression
		trackAdImpression('juicyads', 'banner_300x250', '1103943');

		// Track ad clicks - listen for clicks on the ad element
		const adElement = document.getElementById('1103943');
		if (adElement) {
			adElement.addEventListener('click', () => {
				trackAdClick('juicyads', 'banner_300x250', '1103943');
			});
		}
	});
</script>

<!-- JuicyAds v3.0 Banner (300x250) -->
<ins id="1103943" data-width="300" data-height="250"></ins>

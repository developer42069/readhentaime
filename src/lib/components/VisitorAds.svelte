<script>
	import { browser } from '$app/environment'
	import AAdsMiddleBanner from './aads/AAdsMiddleBanner.svelte'
	// Temporarily disabled Exoclicks ads - replaced with JuicyAds
	// import InterstitialAd from './exoclicks/InterstitialAd.svelte'
	// import VideoSliderAd from './exoclicks/VideoSliderAd.svelte'
</script>

{#if browser}
	<!-- Top Banner -->
	<div class="container mx-auto px-4 py-2">
		<AAdsMiddleBanner />
	</div>

	<!-- ExoClick Interactive Ads - Temporarily disabled -->
	<!-- <InterstitialAd /> -->
	<!-- <VideoSliderAd /> -->
{/if}
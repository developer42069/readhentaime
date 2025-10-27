<script>
	// Keep your existing imports
	import { browser } from '$app/environment'
	import '../app.css'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { afterNavigate } from '$app/navigation'
	import { seo } from '$lib/seo'
	import MainNav from '$lib/components/MainNav.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import ConversionTracker from '$lib/components/exoclicks/ConversionTracker.svelte'
	import ConversionDebug from '$lib/components/exoclicks/ConversionDebug.svelte'
	// import AgeVerificationModal from '$lib/components/AgeVerificationModal.svelte'
	import AdBlockDetector from '$lib/components/AdBlockDetector.svelte'
	import { supabase } from '$lib/supabaseClient'
	import { initGA4, trackPageView, trackScrollDepth, trackTimeOnPage, trackEngagement } from '$lib/gtm'
	// ✅ Moved visitor ads to individual pages

	// Check if current user is admin using client-side supabase
	let isAdmin = false

	// GA4 and engagement tracking variables
	let pageStartTime = null
	let scrollThresholds = [25, 50, 75, 90, 100]
	let trackedScrollDepths = new Set()
	let pageViewCount = 0

	onMount(async () => {
		const { data: { user } } = await supabase.auth.getUser()
		isAdmin = user?.email === 'cheahboolim@gmail.com'

		// Initialize GA4
		initGA4('G-TY8614CPCL')

		// Track initial page view
		trackPageView({
			pathname: window.location.pathname,
			href: window.location.href,
			search: window.location.search
		}, document.title)

		// Track page view count in session
		pageViewCount = parseInt(sessionStorage.getItem('pageViewCount') || '0') + 1
		sessionStorage.setItem('pageViewCount', pageViewCount.toString())
		trackEngagement('page_views_session', pageViewCount)

		// Start time tracking
		pageStartTime = Date.now()

		// Setup scroll depth tracking
		const handleScroll = () => {
			const scrollPercent = Math.round(
				(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
			)

			scrollThresholds.forEach(threshold => {
				if (scrollPercent >= threshold && !trackedScrollDepths.has(threshold)) {
					trackedScrollDepths.add(threshold)
					trackScrollDepth(threshold)
				}
			})
		}

		window.addEventListener('scroll', handleScroll, { passive: true })

		// Track time on page when leaving
		const trackTimeBeforeUnload = () => {
			if (pageStartTime) {
				const timeSpent = Math.round((Date.now() - pageStartTime) / 1000)
				trackTimeOnPage(timeSpent)

				// Track engagement milestones
				if (timeSpent >= 120) trackEngagement('time_2min')
				if (timeSpent >= 300) trackEngagement('time_5min')
			}
		}

		window.addEventListener('beforeunload', trackTimeBeforeUnload)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('beforeunload', trackTimeBeforeUnload)
		}
	})

	// Track page views on navigation
	afterNavigate((navigation) => {
		if (browser && navigation.to) {
			trackPageView({
				pathname: navigation.to.url.pathname,
				href: navigation.to.url.href,
				search: navigation.to.url.search
			}, document.title)

			// Reset tracking for new page
			trackedScrollDepths.clear()
			pageStartTime = Date.now()

			// Update session page view count
			pageViewCount = parseInt(sessionStorage.getItem('pageViewCount') || '0') + 1
			sessionStorage.setItem('pageViewCount', pageViewCount.toString())
			trackEngagement('page_views_session', pageViewCount)
		}
	})
</script>

<svelte:head>
	<meta name="theme-color" content="#000000" />
	<meta name="msapplication-TileColor" content="#000000" />
	<link rel="manifest" href="/manifest.json" />

	<link
		rel="icon"
		type="image/png"
		sizes="16x16"
		href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/favicon-16x16.png"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="32x32"
		href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/favicon-32x32.png"
	/>
	<link rel="icon" href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/favicon.ico" sizes="any" />
	<link
		rel="apple-touch-icon"
		href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/apple-touch-icon.png"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="192x192"
		href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/android-chrome-192x192.png"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="512x512"
		href="{import.meta.env.PUBLIC_CDN_BASE_URL}/favicon/android-chrome-512x512.png"
	/>

	<!-- Google Analytics GA4 -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-TY8614CPCL"></script>
</svelte:head>

<div class="relative flex min-h-screen flex-col bg-background text-foreground antialiased">
	<MainNav />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
	
	<!-- Essential components only (no visitor ads) -->
	<ConversionTracker />
	{#if isAdmin}
		<ConversionDebug />
	{/if}
	<!-- <AgeVerificationModal /> -->
		<!--<AdBlockDetector />-->
</div>

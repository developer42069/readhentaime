import { browser } from '$app/environment';

// Initialize GA4
export function initGA4(measurementId) {
    if (browser && !window.ga4Initialized) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            page_location: window.location.href,
            page_title: document.title
        });
        window.ga4Initialized = true;
    }
}

// Track page views
export function trackPageView(url, title) {
    if (browser && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: url.pathname || window.location.pathname,
            page_title: title || document.title,
            page_location: url.href || window.location.href,
            page_search: url.search || window.location.search
        });
    }
}

// Track custom events
export function trackEvent(eventName, parameters = {}) {
    if (browser && window.gtag) {
        window.gtag('event', eventName, parameters);
    }
}

// Track ad impressions
export function trackAdImpression(adNetwork, adType, adZone = '') {
    trackEvent('ad_impression', {
        ad_network: adNetwork,
        ad_type: adType,
        ad_zone: adZone
    });
}

// Track ad clicks
export function trackAdClick(adNetwork, adType, adZone = '') {
    trackEvent('ad_click', {
        ad_network: adNetwork,
        ad_type: adType,
        ad_zone: adZone
    });
}

// Track user engagement
export function trackEngagement(engagementType, value = null) {
    const params = {
        engagement_type: engagementType
    };
    if (value !== null) {
        params.engagement_value = value;
    }
    trackEvent('user_engagement', params);
}

// Track content interactions
export function trackContentInteraction(interactionType, contentName = '', contentId = '') {
    trackEvent('content_interaction', {
        interaction_type: interactionType,
        content_name: contentName,
        content_id: contentId
    });
}

// Track scroll depth
export function trackScrollDepth(percentage) {
    trackEvent('scroll', {
        percent_scrolled: percentage
    });
}

// Track time on page
export function trackTimeOnPage(seconds) {
    trackEvent('time_on_page', {
        time_seconds: seconds
    });
}

// Legacy gtag function for backward compatibility
export function gtag(...args) {
    if (browser && window.gtag) {
        window.gtag(...args);
    }
}
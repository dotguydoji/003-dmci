/**
 * Core Analytics Manager
 * Handles Google Analytics initialization and consent checking
 * Use this file on ALL pages
 */

class AnalyticsManager {
    constructor() {
        this.gtag_id = 'G-5PZMV7DBVF';
        this.consent_key = 'user_cookie_consent';
        this.consent_timestamp_key = 'consent_timestamp';
        this.consent_expires_days = 365; // Consent expires after 1 year

        this.init();
    }

    init() {
        // Check if user has given consent and it's still valid
        const consent = this.getStoredConsent();
        if (consent === 'accepted' && this.isConsentValid()) {
            this.loadGoogleAnalytics();
        }
    }

    getStoredConsent() {
        return localStorage.getItem(this.consent_key);
    }

    isConsentValid() {
        const consentTimestamp = localStorage.getItem(this.consent_timestamp_key);
        if (!consentTimestamp) return false;

        const consentDate = new Date(parseInt(consentTimestamp));
        const expiryDate = new Date(consentDate.getTime() + (this.consent_expires_days * 24 * 60 * 60 * 1000));

        return new Date() <= expiryDate;
    }

    setConsent(consent) {
        localStorage.setItem(this.consent_key, consent);
        localStorage.setItem(this.consent_timestamp_key, Date.now().toString());

        if (consent === 'accepted') {
            this.loadGoogleAnalytics();
        }
    }

    loadGoogleAnalytics() {
        // Prevent loading multiple times
        if (window.gtag || document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
            return;
        }

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];

        // Define gtag function
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        // Set initial timestamp
        gtag('js', new Date());

        // Configure Google Analytics
        gtag('config', this.gtag_id, {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        });

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gtag_id}`;
        document.head.appendChild(script);

        console.log('Google Analytics loaded with consent');
    }

    // Check if consent banner should be shown (for homepage)
    shouldShowConsentBanner() {
        const consent = this.getStoredConsent();
        return !consent || !this.isConsentValid();
    }

    // Public methods for consent management (called from homepage)
    acceptConsent() {
        this.setConsent('accepted');
    }

    declineConsent() {
        this.setConsent('declined');
    }

    resetConsent() {
        localStorage.removeItem(this.consent_key);
        localStorage.removeItem(this.consent_timestamp_key);
        console.log('Cookie consent reset');
    }

    getConsentStatus() {
        return {
            consent: this.getStoredConsent(),
            timestamp: localStorage.getItem(this.consent_timestamp_key),
            isValid: this.isConsentValid()
        };
    }

    // Analytics event tracking (only works if consent given)
    trackEvent(eventName, parameters = {}) {
        if (this.getStoredConsent() === 'accepted' && window.gtag) {
            gtag('event', eventName, parameters);
        }
    }

    trackPageView(pagePath = null) {
        if (this.getStoredConsent() === 'accepted' && window.gtag) {
            const config = {};
            if (pagePath) {
                config.page_path = pagePath;
            }
            gtag('config', this.gtag_id, config);
        }
    }
}

// Initialize Analytics Manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.analyticsManager = new AnalyticsManager();
    });
} else {
    window.analyticsManager = new AnalyticsManager();
}

// Export for manual usage
window.AnalyticsManager = AnalyticsManager;
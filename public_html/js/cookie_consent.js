/**
 * Cookie Consent UI Controller
 * Use this file ONLY on your homepage
 * Requires: analytics.js to be loaded first
 */

class CookieConsentUI {
    constructor() {
        // Delay initialization to ensure analytics.js is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.init(), 100);
            });
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    init() {
        // Check if analytics manager is available
        if (!window.analyticsManager) {
            console.error('Analytics manager not found. Make sure analytics.js is loaded first.');
            return;
        }

        console.log('Cookie Consent UI initializing...');

        // Get consent status for debugging
        const consentStatus = window.analyticsManager.getConsentStatus();
        console.log('Current consent status:', consentStatus);
        console.log('Should show banner:', window.analyticsManager.shouldShowConsentBanner());

        // Always show banner if no consent exists or consent expired
        const shouldShow = window.analyticsManager.shouldShowConsentBanner();
        if (shouldShow) {
            console.log('Showing banner because consent needed');
            this.showConsentBanner();
        } else {
            console.log('Not showing banner - consent already given and valid');
        }

        this.addEventListeners();
    }

    // Public method to reinitialize (used by debug script)
    reinitialize() {
        this.init();
    }

    // Public method to reinitialize (used by debug script)
    reinitialize() {
        this.init();
    }

    showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (!banner) {
            console.error('Cookie consent banner element not found in DOM');
            return;
        }

        console.log('Showing consent banner...');
        console.log('Banner element found:', banner);
        console.log('Banner current display:', getComputedStyle(banner).display);
        console.log('Banner current transform:', getComputedStyle(banner).transform);

        // Ensure banner is visible and positioned correctly
        banner.style.display = 'block';
        banner.style.visibility = 'visible';

        // Force show with animation
        requestAnimationFrame(() => {
            banner.classList.add('show');
            console.log('Banner show class added');
        });

        // Fallback: if CSS animation doesn't work, force position
        setTimeout(() => {
            if (!banner.classList.contains('show')) {
                banner.style.transform = 'translateY(0)';
                console.log('Fallback: forced banner position');
            }
        }, 200);
    }

    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            // Remove from DOM after animation
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        const analyticsToggle = document.getElementById('analytics-toggle');

        if (modal && analyticsToggle) {
            // Set current analytics preference
            analyticsToggle.checked = window.analyticsManager.getStoredConsent() === 'accepted';

            // Show modal with animation
            modal.classList.add('show');
        }
    }

    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    addEventListeners() {
        // Accept button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                window.analyticsManager.acceptConsent();
                this.hideConsentBanner();
            });
        }

        // Decline button  
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                window.analyticsManager.declineConsent();
                this.hideConsentBanner();
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }

        // Settings modal buttons
        const cancelBtn = document.getElementById('settings-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideSettingsModal();
            });
        }

        const saveBtn = document.getElementById('settings-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const analyticsToggle = document.getElementById('analytics-toggle');
                const analyticsEnabled = analyticsToggle ? analyticsToggle.checked : false;

                if (analyticsEnabled) {
                    window.analyticsManager.acceptConsent();
                } else {
                    window.analyticsManager.declineConsent();
                }

                this.hideSettingsModal();
                this.hideConsentBanner();
            });
        }

        // Close modal when clicking backdrop
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettingsModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSettingsModal();
            }
        });
    }

    // Public method to manually show consent banner (for testing)
    showConsentBannerManually() {
        console.log('Manually showing consent banner...');
        this.showConsentBanner();
    }

    // Public method to force show banner (debugging)
    forceShowBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            console.log('Force showing banner...');
            banner.style.display = 'block';
            banner.style.visibility = 'visible';
            banner.style.transform = 'translateY(0)';
            banner.classList.add('show');
        }
    }

    // Debug method to check status
    debugStatus() {
        console.log('=== Cookie Consent Debug Info ===');
        console.log('Analytics Manager:', window.analyticsManager);
        console.log('Cookie Consent UI:', window.cookieConsentUI);

        if (window.analyticsManager) {
            const status = window.analyticsManager.getConsentStatus();
            console.log('Consent Status:', status);
            console.log('Should Show Banner:', window.analyticsManager.shouldShowConsentBanner());
        }

        const banner = document.getElementById('cookie-consent-banner');
        console.log('Banner Element:', banner);
        if (banner) {
            console.log('Banner Display:', getComputedStyle(banner).display);
            console.log('Banner Transform:', getComputedStyle(banner).transform);
            console.log('Banner Classes:', banner.className);
        }
    }
}

// Initialize Cookie Consent UI when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Additional delay to ensure analytics.js is fully initialized
        setTimeout(() => {
            console.log('Initializing Cookie Consent UI...');
            window.cookieConsentUI = new CookieConsentUI();

            // Add global debug functions for testing
            window.debugCookieConsent = () => window.cookieConsentUI.debugStatus();
            window.forceShowCookieBanner = () => window.cookieConsentUI.forceShowBanner();
            window.resetCookieConsent = () => {
                if (window.analyticsManager) {
                    window.analyticsManager.resetConsent();
                    window.cookieConsentUI.reinitialize();
                }
            };

            console.log('Debug functions available: debugCookieConsent(), forceShowCookieBanner(), resetCookieConsent()');
        }, 200);
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        console.log('Initializing Cookie Consent UI...');
        window.cookieConsentUI = new CookieConsentUI();

        // Add global debug functions for testing
        window.debugCookieConsent = () => window.cookieConsentUI.debugStatus();
        window.forceShowCookieBanner = () => window.cookieConsentUI.forceShowBanner();
        window.resetCookieConsent = () => {
            if (window.analyticsManager) {
                window.analyticsManager.resetConsent();
                window.cookieConsentUI.reinitialize();
            }
        };

        console.log('Debug functions available: debugCookieConsent(), forceShowCookieBanner(), resetCookieConsent()');
    }, 200);
}
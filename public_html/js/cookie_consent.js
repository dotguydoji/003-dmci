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


        // Get consent status for debugging
        const consentStatus = window.analyticsManager.getConsentStatus();

        // Always show banner if no consent exists or consent expired
        const shouldShow = window.analyticsManager.shouldShowConsentBanner();
        if (shouldShow) {
            this.showConsentBanner();
        } else {
        }

        this.addEventListeners();
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


        // Ensure banner is visible and positioned correctly
        banner.style.display = 'block';
        banner.style.visibility = 'visible';

        // Force show with animation
        requestAnimationFrame(() => {
            banner.classList.add('show');
        });

        // Fallback: if CSS animation doesn't work, force position
        setTimeout(() => {
            if (!banner.classList.contains('show')) {
                banner.style.transform = 'translateY(0)';
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
            modal.style.display = 'flex';
            modal.classList.add('show');

        }
    }

    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');

            // Force hide after animation completes
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);

        }
    }

    addEventListeners() {
        // Accept button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.analyticsManager.acceptConsent();
                this.hideConsentBanner();
            });
        }

        // Decline button  
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.analyticsManager.declineConsent();
                this.hideConsentBanner();
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSettingsModal();
            });
        }

        // Settings modal cancel button
        const cancelBtn = document.getElementById('settings-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideSettingsModal();
            });
        }

        // Settings modal save button
        const saveBtn = document.getElementById('settings-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const analyticsToggle = document.getElementById('analytics-toggle');
                const analyticsEnabled = analyticsToggle ? analyticsToggle.checked : false;


                if (analyticsEnabled) {
                    window.analyticsManager.acceptConsent();
                } else {
                    window.analyticsManager.declineConsent();
                }

                // Close the modal first
                this.hideSettingsModal();

                // Then hide the banner after a short delay
                setTimeout(() => {
                    this.hideConsentBanner();
                }, 100);
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
                const modal = document.getElementById('cookie-settings-modal');
                if (modal && modal.classList.contains('show')) {
                    this.hideSettingsModal();
                }
            }
        });
    }

    // Public method to manually show consent banner (for testing)
    showConsentBannerManually() {
        this.showConsentBanner();
    }

    // Public method to force show banner (debugging)
    forceShowBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.style.visibility = 'visible';
            banner.style.transform = 'translateY(0)';
            banner.classList.add('show');
        }
    }

    // Emergency method to force close modal
    forceCloseModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.style.opacity = '0';
        }
    }

    // Debug method to check status
    debugStatus() {

        if (window.analyticsManager) {
            const status = window.analyticsManager.getConsentStatus();
        }

        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
        }

        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
        }
    }
}

// Initialize Cookie Consent UI when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Additional delay to ensure analytics.js is fully initialized
        setTimeout(() => {
            window.cookieConsentUI = new CookieConsentUI();

            // Add global debug functions for testing
            window.debugCookieConsent = () => window.cookieConsentUI.debugStatus();
            window.forceShowCookieBanner = () => window.cookieConsentUI.forceShowBanner();
            window.forceCloseModal = () => window.cookieConsentUI.forceCloseModal();
            window.resetCookieConsent = () => {
                if (window.analyticsManager) {
                    window.analyticsManager.resetConsent();
                    window.cookieConsentUI.reinitialize();
                }
            };

        }, 200);
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        window.cookieConsentUI = new CookieConsentUI();

        // Add global debug functions for testing
        window.debugCookieConsent = () => window.cookieConsentUI.debugStatus();
        window.forceShowCookieBanner = () => window.cookieConsentUI.forceShowBanner();
        window.forceCloseModal = () => window.cookieConsentUI.forceCloseModal();
        window.resetCookieConsent = () => {
            if (window.analyticsManager) {
                window.analyticsManager.resetConsent();
                window.cookieConsentUI.reinitialize();
            }
        };

    }, 200);
}
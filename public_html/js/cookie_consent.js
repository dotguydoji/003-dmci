/**
 * Cookie Consent UI Controller
 * Use this file ONLY on your homepage
 * Requires: analytics.js to be loaded first
 */
class CookieConsentUI {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.init(), 100);
            });
        } else {
            setTimeout(() => this.init(), 100);
        }
    }
    init() {
        if (!window.analyticsManager) {
            console.error('Analytics manager not found. Make sure analytics.js is loaded first.');
            return;
        }
        const consentStatus = window.analyticsManager.getConsentStatus();
        const shouldShow = window.analyticsManager.shouldShowConsentBanner();
        if (shouldShow) {
            this.showConsentBanner();
        } else {
        }
        this.addEventListeners();
    }
    reinitialize() {
        this.init();
    }
    showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (!banner) {
            console.error('Cookie consent banner element not found in DOM');
            return;
        }
        banner.style.display = 'block';
        banner.style.visibility = 'visible';
        requestAnimationFrame(() => {
            banner.classList.add('show');
        });
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
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }
    showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        const analyticsToggle = document.getElementById('analytics-toggle');
        if (modal && analyticsToggle) {
            analyticsToggle.checked = window.analyticsManager.getStoredConsent() === 'accepted';
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }
    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    addEventListeners() {
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.analyticsManager.acceptConsent();
                this.hideConsentBanner();
            });
        }
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.analyticsManager.declineConsent();
                this.hideConsentBanner();
            });
        }
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSettingsModal();
            });
        }
        const cancelBtn = document.getElementById('settings-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideSettingsModal();
            });
        }
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
                this.hideSettingsModal();
                setTimeout(() => {
                    this.hideConsentBanner();
                }, 100);
            });
        }
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettingsModal();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('cookie-settings-modal');
                if (modal && modal.classList.contains('show')) {
                    this.hideSettingsModal();
                }
            }
        });
    }
    showConsentBannerManually() {
        this.showConsentBanner();
    }
    forceShowBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.style.visibility = 'visible';
            banner.style.transform = 'translateY(0)';
            banner.classList.add('show');
        }
    }
    forceCloseModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.style.opacity = '0';
        }
    }
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.cookieConsentUI = new CookieConsentUI();
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
    setTimeout(() => {
        window.cookieConsentUI = new CookieConsentUI();
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
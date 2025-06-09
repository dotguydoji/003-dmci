/**
 * Property Inquiry Form JavaScript
 * Dedicated script for the new property inquiry form
 * Synced with existing Netlify serverless function and validation patterns
 * 
 * Form ID: propertyInquiryForm
 * Author: Claude AI
 * Last Updated: June 2025
 */

document.addEventListener('DOMContentLoaded', function () {
    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🎯 ELEMENT SELECTORS - Get all form elements
    // ═══════════════════════════════════════════════════════════════════════════════════

    const form = document.getElementById('propertyInquiryForm');
    const submitButton = document.getElementById('formSubmitButton');
    const loadingSpinner = document.getElementById('buttonLoadingSpinner');
    const successMessage = document.getElementById('formSuccessMessage');
    const errorMessage = document.getElementById('formErrorMessage');

    // Form inputs
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const phoneInput = document.getElementById('clientPhone');
    const locationInput = document.getElementById('desiredLocation');
    const propertyTypeSelect = document.getElementById('typeOfProperty');
    const budgetSelect = document.getElementById('budgetRange');
    const messageTextarea = document.getElementById('additionalMessage');
    const recaptchaElement = document.querySelector('.g-recaptcha');

    // ═══════════════════════════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURATION & VALIDATION PATTERNS
    // ═══════════════════════════════════════════════════════════════════════════════════

    const config = {
        // Rate limiting - 1 minute between submissions
        minTimeBetweenSubmits: 60000,

        // Validation patterns (matching existing site patterns)
        patterns: {
            email: /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
            phone: /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/,
            name: /^[a-zA-ZÀ-ÿ\s\-'\.]{2,50}$/,
            location: /^[a-zA-Z0-9\s,.\-]{2,100}$/
        },

        // API endpoints
        apiUrl: {
            development: 'http://localhost:8888/.netlify/functions/sendEmail',
            production: '/.netlify/functions/sendEmail'
        },

        // Input length limits
        maxLengths: {
            name: 50,
            email: 100,
            phone: 20,
            location: 100,
            message: 1000
        }
    };

    // Track last submission time for rate limiting
    let lastSubmitTime = 0;

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🛡️ UTILITY FUNCTIONS - Input sanitization and validation
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * Sanitize user input to prevent XSS and clean data
     * @param {string} input - Raw input string
     * @param {number} maxLength - Maximum allowed length
     * @returns {string} - Sanitized input
     */
    function sanitizeInput(input, maxLength = 1000) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/<script.*?>.*?<\/script>/gi, '') // Remove script tags
            .trim() // Remove whitespace
            .substring(0, maxLength); // Limit length
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    function isValidEmail(email) {
        return config.patterns.email.test(email);
    }

    /**
     * Validate phone number format (Philippines + international)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid
     */
    function isValidPhone(phone) {
        return config.patterns.phone.test(phone);
    }

    /**
     * Validate name format
     * @param {string} name - Name to validate
     * @returns {boolean} - True if valid
     */
    function isValidName(name) {
        return config.patterns.name.test(name);
    }

    /**
     * Validate location format
     * @param {string} location - Location to validate
     * @returns {boolean} - True if valid
     */
    function isValidLocation(location) {
        return config.patterns.location.test(location);
    }

    /**
     * Get the appropriate API URL based on environment
     * @returns {string} - API endpoint URL
     */
    function getApiUrl() {
        const isDevelopment = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
        return isDevelopment ? config.apiUrl.development : config.apiUrl.production;
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🎭 UI STATE MANAGEMENT - Loading, success, error states
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * Set loading state for form submission
     * @param {boolean} isLoading - Whether form is in loading state
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            loadingSpinner.style.display = 'block';
            submitButton.style.pointerEvents = 'none';

            // Disable all form inputs during submission
            toggleFormInputs(true);
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            loadingSpinner.style.display = 'none';
            submitButton.style.pointerEvents = 'auto';

            // Re-enable form inputs
            toggleFormInputs(false);
        }
    }

    /**
     * Toggle form inputs enabled/disabled state
     * @param {boolean} disabled - Whether to disable inputs
     */
    function toggleFormInputs(disabled) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = disabled;
        });
    }

    /**
     * Show success message and handle post-submission state
     */
    function showSuccess() {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        // Add success animation
        successMessage.style.animation = 'fadeInUp 0.5s ease forwards';

        // Change button to success state
        submitButton.innerHTML = '✓ Message Sent!';
        submitButton.style.background = '#28a745';
        submitButton.disabled = true;

        // Reset form after 3 seconds
        setTimeout(() => {
            resetForm();
        }, 3000);
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';

        // Add error animation
        errorMessage.style.animation = 'fadeInUp 0.5s ease forwards';

        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    /**
     * Reset form to initial state
     */
    function resetForm() {
        form.reset();
        setLoadingState(false);
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Reset button text and style
        submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
        submitButton.style.background = '#ff6b35';

        // Reset reCAPTCHA if present
        if (typeof grecaptcha !== 'undefined' && recaptchaElement) {
            try {
                grecaptcha.reset();
            } catch (e) {
                console.log('reCAPTCHA reset not available');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🔍 FORM VALIDATION - Comprehensive field validation
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * Validate all form fields
     * @returns {Object} - Validation result with isValid boolean and errors array
     */
    function validateForm() {
        const errors = [];

        // Get and sanitize form values
        const formData = {
            name: sanitizeInput(nameInput.value, config.maxLengths.name),
            email: sanitizeInput(emailInput.value, config.maxLengths.email),
            phone: sanitizeInput(phoneInput.value, config.maxLengths.phone),
            location: sanitizeInput(locationInput.value, config.maxLengths.location),
            propertyType: propertyTypeSelect.value,
            budget: budgetSelect.value,
            message: sanitizeInput(messageTextarea.value, config.maxLengths.message)
        };

        // Required field validation
        if (!formData.name) {
            errors.push('Full name is required');
        } else if (!isValidName(formData.name)) {
            errors.push('Please enter a valid name (2-50 characters, letters only)');
        }

        if (!formData.email) {
            errors.push('Email address is required');
        } else if (!isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!formData.phone) {
            errors.push('Phone number is required');
        } else if (!isValidPhone(formData.phone)) {
            errors.push('Please enter a valid phone number (e.g., 09123456789 or +639123456789)');
        }

        if (!formData.location) {
            errors.push('Desired location is required');
        } else if (!isValidLocation(formData.location)) {
            errors.push('Please enter a valid location (2-100 characters)');
        }

        if (!formData.propertyType) {
            errors.push('Please select a property type');
        }

        if (!formData.budget) {
            errors.push('Please select a budget range');
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            data: formData
        };
    }

    /**
     * Add real-time validation feedback to inputs
     */
    function addRealTimeValidation() {
        // Name validation
        nameInput.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !isValidName(value)) {
                this.style.borderColor = '#e74c3c';
                this.title = 'Please enter a valid name (2-50 characters, letters only)';
            } else {
                this.style.borderColor = '';
                this.title = '';
            }
        });

        // Email validation
        emailInput.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !isValidEmail(value)) {
                this.style.borderColor = '#e74c3c';
                this.title = 'Please enter a valid email address';
            } else {
                this.style.borderColor = '';
                this.title = '';
            }
        });

        // Phone validation
        phoneInput.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !isValidPhone(value)) {
                this.style.borderColor = '#e74c3c';
                this.title = 'Please enter a valid phone number';
            } else {
                this.style.borderColor = '';
                this.title = '';
            }
        });

        // Location validation
        locationInput.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !isValidLocation(value)) {
                this.style.borderColor = '#e74c3c';
                this.title = 'Please enter a valid location';
            } else {
                this.style.borderColor = '';
                this.title = '';
            }
        });

        // Clear error styling on focus
        [nameInput, emailInput, phoneInput, locationInput].forEach(input => {
            input.addEventListener('focus', function () {
                this.style.borderColor = '';
                this.title = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 📤 FORM SUBMISSION - Main form submission logic
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async function handleFormSubmission(event) {
        event.preventDefault();

        // Check rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < config.minTimeBetweenSubmits) {
            const remainingTime = Math.ceil((config.minTimeBetweenSubmits - (now - lastSubmitTime)) / 1000);
            showError(`Please wait ${remainingTime} seconds before submitting again.`);
            return;
        }

        // Validate form
        const validation = validateForm();
        if (!validation.isValid) {
            showError(validation.errors[0]); // Show first error
            return;
        }

        // Get reCAPTCHA token if available
        let recaptchaToken = null;
        if (typeof grecaptcha !== 'undefined' && recaptchaElement) {
            try {
                recaptchaToken = grecaptcha.getResponse();
                if (!recaptchaToken) {
                    showError('Please complete the reCAPTCHA verification.');
                    return;
                }
            } catch (e) {
                console.log('reCAPTCHA not available:', e);
            }
        }

        // Set loading state
        setLoadingState(true);

        try {
            // Prepare submission data
            const submissionData = {
                ...validation.data,
                recaptcha: recaptchaToken,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                source: 'property-inquiry-form'
            };

            // Submit to Netlify function
            const response = await fetch(getApiUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || responseData.details || 'Failed to submit form');
            }

            // Success!
            lastSubmitTime = now;
            showSuccess();

            // Optional: Track successful submission (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'property_inquiry_form'
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);

            // Show user-friendly error message
            if (error.message.includes('reCAPTCHA')) {
                showError('reCAPTCHA verification failed. Please try again.');
            } else if (error.message.includes('rate limit')) {
                showError('Too many requests. Please wait a moment and try again.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                showError('Network error. Please check your connection and try again.');
            } else {
                showError('Unable to submit form. Please try again or contact us directly.');
            }

        } finally {
            setLoadingState(false);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION - Set up event listeners and form behavior
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the form functionality
     */
    function initializeForm() {
        // Check if form exists
        if (!form) {
            console.warn('Property inquiry form not found');
            return;
        }

        // Ensure all required elements exist
        const requiredElements = [submitButton, loadingSpinner, successMessage, errorMessage];
        const missingElements = requiredElements.filter(el => !el);

        if (missingElements.length > 0) {
            console.error('Missing required form elements:', missingElements);
            return;
        }

        // Hide messages initially
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        loadingSpinner.style.display = 'none';

        // Add form submission handler
        form.addEventListener('submit', handleFormSubmission);

        // Add real-time validation
        addRealTimeValidation();

        // Add keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            // Submit form with Ctrl+Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (document.activeElement && form.contains(document.activeElement)) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });

        // Auto-resize textarea
        if (messageTextarea) {
            messageTextarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }

        // Form analytics tracking (optional)
        form.addEventListener('focusin', function (e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_start', {
                    'event_category': 'engagement',
                    'event_label': 'property_inquiry_form'
                });
            }
        }, { once: true }); // Only track first focus

        console.log('Property inquiry form initialized successfully');
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🎬 STARTUP - Initialize everything when DOM is ready
    // ═══════════════════════════════════════════════════════════════════════════════════

    // Initialize the form
    initializeForm();

    // Expose form utilities for external use (optional)
    window.PropertyInquiryForm = {
        reset: resetForm,
        validate: validateForm,
        setLoading: setLoadingState,
        showError: showError,
        showSuccess: showSuccess
    };
});

/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 🔧 ADDITIONAL ENHANCEMENTS (Optional features)
 * ═══════════════════════════════════════════════════════════════════════════════════
 */

// Auto-save form data to localStorage (privacy-conscious)
function enableAutoSave() {
    const STORAGE_KEY = 'dmci_property_inquiry_draft';
    const form = document.getElementById('propertyInquiryForm');

    if (!form || !localStorage) return;

    // Load saved data on page load
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input && data[key]) {
                    input.value = data[key];
                }
            });
        }
    } catch (e) {
        console.log('Could not load saved form data');
    }

    // Save data on input change
    form.addEventListener('input', function () {
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.log('Could not save form data');
        }
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', function () {
        setTimeout(() => {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                console.log('Could not clear saved form data');
            }
        }, 1000);
    });
}

// Initialize auto-save if localStorage is available
if (typeof Storage !== 'undefined') {
    enableAutoSave();
}
/**
 * Complete Property Inquiry Form JavaScript with Enterprise reCAPTCHA v3
 * Based on grecaptcha.enterprise.execute() pattern
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Form script loading...');

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🎯 ELEMENT SELECTORS
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

    // reCAPTCHA configuration
    const RECAPTCHA_SITE_KEY = '6LcD-ForAAAAAAGLN9bmO4uFB71gGCEYrC_IXbCe';

    console.log('Form found:', !!form);
    console.log('Submit button found:', !!submitButton);

    // ═══════════════════════════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════════════

    const config = {
        minTimeBetweenSubmits: 60000,
        patterns: {
            email: /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
            phone: /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/,
            name: /^[a-zA-ZÀ-ÿ\s\-'\.]{2,50}$/,
            location: /^.{2,100}$/
        },
        maxLengths: {
            name: 100,
            email: 100,
            phone: 20,
            location: 200,
            message: 1000
        }
    };

    let lastSubmitTime = 0;

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🛡️ VALIDATION HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════════

    function sanitizeInput(input, maxLength = 1000) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>]/g, '')
            .replace(/<script.*?>.*?<\/script>/gi, '')
            .trim()
            .substring(0, maxLength);
    }

    function isValidEmail(email) {
        return config.patterns.email.test(email);
    }

    function isValidPhone(phone) {
        return config.patterns.phone.test(phone);
    }

    function isValidName(name) {
        return config.patterns.name.test(name);
    }

    function isValidLocation(location) {
        return config.patterns.location.test(location);
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🎨 UI STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════════

    function setLoadingState(isLoading) {
        if (!submitButton) return;

        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            if (loadingSpinner) {
                loadingSpinner.style.display = 'inline-block';
            }
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        }
    }

    function showSuccess(message = 'Thank you! We\'ll contact you shortly.') {
        console.log('Showing success message');
        hideMessages();

        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (submitButton) {
            submitButton.innerHTML = '✓ Message Sent!';
            submitButton.style.background = '#28a745';
            setTimeout(() => resetForm(), 3000);
        }
    }

    function showError(message) {
        console.log('Showing error message:', message);
        hideMessages();

        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => hideMessages(), 8000);
        }
    }

    function hideMessages() {
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
    }

    function resetForm() {
        console.log('Resetting form');

        if (form) form.reset();
        setLoadingState(false);
        hideMessages();

        if (submitButton) {
            submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
            submitButton.style.background = '#ff6b35';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🔍 FORM VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════════════

    function validateForm() {
        const errors = [];

        const formData = {
            name: sanitizeInput(nameInput?.value || '', config.maxLengths.name),
            email: sanitizeInput(emailInput?.value || '', config.maxLengths.email),
            phone: sanitizeInput(phoneInput?.value || '', config.maxLengths.phone),
            location: sanitizeInput(locationInput?.value || '', config.maxLengths.location),
            propertyType: propertyTypeSelect?.value || '',
            budget: budgetSelect?.value || '',
            message: sanitizeInput(messageTextarea?.value || '', config.maxLengths.message)
        };

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
            errors.push('Please enter a valid phone number');
        }

        if (!formData.location) {
            errors.push('Desired location is required');
        } else if (!isValidLocation(formData.location)) {
            errors.push('Please enter a valid location');
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

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 📤 FORM SUBMISSION with Enterprise reCAPTCHA v3
    // ═══════════════════════════════════════════════════════════════════════════════════

    async function handleFormSubmission(event) {
        console.log('Form submission triggered');

        // Prevent default form submission
        event.preventDefault();
        event.stopPropagation();

        hideMessages();

        // Check rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < config.minTimeBetweenSubmits) {
            const remainingTime = Math.ceil((config.minTimeBetweenSubmits - (now - lastSubmitTime)) / 1000);
            showError(`Please wait ${remainingTime} seconds before submitting again.`);
            return false;
        }

        // Validate form
        const validation = validateForm();
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return false;
        }

        setLoadingState(true);

        try {
            // Execute Enterprise reCAPTCHA v3
            console.log('Executing Enterprise reCAPTCHA v3...');

            await grecaptcha.enterprise.ready(async () => {
                try {
                    const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
                        action: 'SUBMIT_FORM'
                    });

                    console.log('Enterprise reCAPTCHA token obtained:', token ? 'Success' : 'Failed');

                    if (!token) {
                        throw new Error('reCAPTCHA token generation failed');
                    }

                    // Submit form with token
                    await submitFormData(validation.data, token);

                } catch (recaptchaError) {
                    console.error('Enterprise reCAPTCHA error:', recaptchaError);
                    showError('reCAPTCHA verification failed. Please try again.');
                    setLoadingState(false);
                }
            });

        } catch (error) {
            console.error('Form submission error:', error);
            showError('Unable to submit form. Please try again.');
            setLoadingState(false);
        }

        return false;
    }

    // Submit form data to server
    async function submitFormData(formData, recaptchaToken) {
        try {
            const submissionData = {
                ...formData,
                recaptcha: recaptchaToken,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                source: 'property-inquiry-form'
            };

            console.log('Submitting to Netlify function...');

            const response = await fetch('/.netlify/functions/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to submit form');
            }

            // Success!
            lastSubmitTime = Date.now();
            showSuccess();

            // Track successful submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'property_inquiry_form'
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);

            let errorMessage = 'Unable to submit form. Please try again.';

            if (error.message.includes('reCAPTCHA')) {
                errorMessage = 'reCAPTCHA verification failed. Please try again.';
            } else if (error.message.includes('rate limit')) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            showError(errorMessage);

        } finally {
            setLoadingState(false);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════════════

    function initializeForm() {
        console.log('Initializing form...');

        if (!form) {
            console.error('Form not found! Looking for ID: propertyInquiryForm');
            return;
        }

        if (!submitButton) {
            console.error('Submit button not found! Looking for ID: formSubmitButton');
            return;
        }

        // Hide messages initially
        hideMessages();
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        // Add form submit event listener
        form.addEventListener('submit', handleFormSubmission);

        // Add click listener to submit button as backup
        submitButton.addEventListener('click', function (event) {
            if (submitButton.type !== 'submit') {
                event.preventDefault();
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                form.dispatchEvent(submitEvent);
            }
        });

        console.log('Form initialized successfully');
    }

    // Initialize the form
    initializeForm();

    // Wait for Enterprise reCAPTCHA to load
    function checkEnterpriseRecaptcha() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise && grecaptcha.enterprise.ready) {
            console.log('Enterprise reCAPTCHA v3 loaded successfully');
        } else {
            console.log('Waiting for Enterprise reCAPTCHA to load...');
            setTimeout(checkEnterpriseRecaptcha, 1000);
        }
    }

    checkEnterpriseRecaptcha();

    // Debug utilities
    window.FormDebug = {
        form: form,
        submitButton: submitButton,
        validate: validateForm,
        reset: resetForm,
        showError: showError,
        showSuccess: showSuccess,
        testEnterpriseRecaptcha: async () => {
            console.log('Testing Enterprise reCAPTCHA...');
            try {
                await grecaptcha.enterprise.ready(async () => {
                    const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
                        action: 'TEST'
                    });
                    console.log('Enterprise reCAPTCHA test token:', token);
                    return token;
                });
            } catch (e) {
                console.error('Enterprise reCAPTCHA test failed:', e);
                return null;
            }
        }
    };

    console.log('Enterprise reCAPTCHA form script loaded successfully');
});
/**
 * Complete Property Inquiry Form JavaScript with Enterprise reCAPTCHA v3
 * Based on grecaptcha.enterprise.execute() pattern
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('propertyInquiryForm');
    const submitButton = document.getElementById('formSubmitButton');
    const loadingSpinner = document.getElementById('buttonLoadingSpinner');
    const successMessage = document.getElementById('formSuccessMessage');
    const errorMessage = document.getElementById('formErrorMessage');
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const phoneInput = document.getElementById('clientPhone');
    const locationInput = document.getElementById('desiredLocation');
    const propertyTypeSelect = document.getElementById('typeOfProperty');
    const budgetSelect = document.getElementById('budgetRange');
    const messageTextarea = document.getElementById('additionalMessage');
    const RECAPTCHA_SITE_KEY = '6LcD-ForAAAAAAGLN9bmO4uFB71gGCEYrC_IXbCe';
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
        if (form) form.reset();
        setLoadingState(false);
        hideMessages();
        if (submitButton) {
            submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
            submitButton.style.background = '#ff6b35';
        }
    }
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
    async function handleFormSubmission(event) {
        event.preventDefault();
        event.stopPropagation();
        hideMessages();
        const now = Date.now();
        if (now - lastSubmitTime < config.minTimeBetweenSubmits) {
            const remainingTime = Math.ceil((config.minTimeBetweenSubmits - (now - lastSubmitTime)) / 1000);
            showError(`Please wait ${remainingTime} seconds before submitting again.`);
            return false;
        }
        const validation = validateForm();
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return false;
        }
        setLoadingState(true);
        try {
            await grecaptcha.enterprise.ready(async () => {
                try {
                    const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
                        action: 'SUBMIT_FORM'
                    });
                    if (!token) {
                        throw new Error('reCAPTCHA token generation failed');
                    }
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
    async function submitFormData(formData, recaptchaToken) {
        try {
            const submissionData = {
                ...formData,
                recaptcha: recaptchaToken,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                source: 'property-inquiry-form'
            };
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
            lastSubmitTime = Date.now();
            showSuccess();
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
    function initializeForm() {
        if (!form) {
            console.error('Form not found! Looking for ID: propertyInquiryForm');
            return;
        }
        if (!submitButton) {
            console.error('Submit button not found! Looking for ID: formSubmitButton');
            return;
        }
        hideMessages();
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        form.addEventListener('submit', handleFormSubmission);
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
    }
    initializeForm();
    function checkEnterpriseRecaptcha() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise && grecaptcha.enterprise.ready) {
        } else {
            setTimeout(checkEnterpriseRecaptcha, 1000);
        }
    }
    checkEnterpriseRecaptcha();
    window.FormDebug = {
        form: form,
        submitButton: submitButton,
        validate: validateForm,
        reset: resetForm,
        showError: showError,
        showSuccess: showSuccess,
        testEnterpriseRecaptcha: async () => {
            try {
                await grecaptcha.enterprise.ready(async () => {
                    const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
                        action: 'TEST'
                    });
                    return token;
                });
            } catch (e) {
                console.error('Enterprise reCAPTCHA test failed:', e);
                return null;
            }
        }
    };
});
/**
 * Fixed Property Inquiry Form JavaScript
 * Prevents page reload/jump and ensures proper form submission
 * Based on your existing code with fixes applied
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Form script loading...');
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
    const recaptchaElement = document.querySelector('.g-recaptcha');
    console.log('Form found:', !!form);
    console.log('Submit button found:', !!submitButton);
    console.log('Form ID:', form?.id);
    const config = {
        // Rate limiting - 1 minute between submissions
        minTimeBetweenSubmits: 60000,
        // Validation patterns
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
    function getApiUrl() {
        const isDevelopment = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
        return isDevelopment ? config.apiUrl.development : config.apiUrl.production;
    }
    function setLoadingState(isLoading) {
        console.log('Setting loading state:', isLoading);
        if (!submitButton) {
            console.error('Submit button not found!');
            return;
        }
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.style.pointerEvents = 'none';
            if (loadingSpinner) {
                loadingSpinner.style.display = 'inline-block';
            }
            const originalText = submitButton.textContent;
            submitButton.setAttribute('data-original-text', originalText);
            submitButton.innerHTML = 'Sending... <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
        } else {
            submitButton.disabled = false;
            submitButton.style.pointerEvents = 'auto';
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            const originalText = submitButton.getAttribute('data-original-text');
            if (originalText) {
                submitButton.textContent = originalText;
            } else {
                submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
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
            setTimeout(() => {
                resetForm();
            }, 3000);
        }
    }
    function showError(message) {
        console.log('Showing error message:', message);
        hideMessages();
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                hideMessages();
            }, 8000);
        }
    }
    function hideMessages() {
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
    }
    function resetForm() {
        console.log('Resetting form');
        if (form) {
            form.reset();
        }
        setLoadingState(false);
        hideMessages();
        if (submitButton) {
            submitButton.innerHTML = 'Send Message <div id="buttonLoadingSpinner" class="loading-indicator"></div>';
            submitButton.style.background = '#ff6b35';
        }
        if (typeof grecaptcha !== 'undefined' && recaptchaElement) {
            try {
                grecaptcha.reset();
            } catch (e) {
                console.log('reCAPTCHA reset not available');
            }
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
    async function handleFormSubmission(event) {
        console.log('Form submission triggered');
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
        let recaptchaToken = null;
        if (typeof grecaptcha !== 'undefined' && recaptchaElement) {
            try {
                recaptchaToken = grecaptcha.getResponse();
                if (!recaptchaToken) {
                    showError('Please complete the reCAPTCHA verification.');
                    return false;
                }
            } catch (e) {
                console.log('reCAPTCHA not available:', e);
            }
        }
        setLoadingState(true);
        try {
            const submissionData = {
                ...validation.data,
                recaptcha: recaptchaToken,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                source: 'property-inquiry-form'
            };
            console.log('Submitting to:', getApiUrl());
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
            lastSubmitTime = now;
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
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            showError(errorMessage);
        } finally {
            setLoadingState(false);
        }
        return false;
    }
    function initializeForm() {
        console.log('Initializing form...');
        if (!form) {
            console.error('Property inquiry form not found! Looking for ID: propertyInquiryForm');
            const forms = document.querySelectorAll('form');
            console.log('Available forms:', Array.from(forms).map(f => f.id || f.className));
            return;
        }
        if (!submitButton) {
            console.error('Submit button not found! Looking for ID: formSubmitButton');
            return;
        }
        console.log('Form elements found successfully');
        hideMessages();
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        form.removeEventListener('submit', handleFormSubmission);
        form.addEventListener('submit', handleFormSubmission);
        submitButton.removeEventListener('click', handleButtonClick);
        submitButton.addEventListener('click', handleButtonClick);
        addRealTimeValidation();
        console.log('Form initialized successfully');
    }
    function handleButtonClick(event) {
        console.log('Submit button clicked');
        event.preventDefault();
        event.stopPropagation();
        const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
        });
        form.dispatchEvent(submitEvent);
        return false;
    }
    function addRealTimeValidation() {
        if (!nameInput || !emailInput || !phoneInput || !locationInput) return;
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
        [nameInput, emailInput, phoneInput, locationInput].forEach(input => {
            input.addEventListener('focus', function () {
                this.style.borderColor = '';
                this.title = '';
            });
        });
        console.log('Real-time validation added');
    }
    setTimeout(() => {
        initializeForm();
    }, 100);
    initializeForm();
    window.FormDebug = {
        form: form,
        submitButton: submitButton,
        validate: validateForm,
        reset: resetForm,
        showError: showError,
        showSuccess: showSuccess,
        testSubmit: () => {
            console.log('Testing form submission...');
            const event = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(event);
        }
    };
    console.log('Form script loaded successfully');
});
window.addEventListener('beforeunload', function (event) {
    const formSubmitButton = document.getElementById('formSubmitButton');
    if (formSubmitButton && formSubmitButton.disabled) {
        event.preventDefault();
        event.returnValue = 'Form is being submitted. Are you sure you want to leave?';
        return event.returnValue;
    }
});
document.addEventListener('submit', function (event) {
    const target = event.target;
    if (target && target.id === 'propertyInquiryForm') {
        console.log('Form submit event intercepted');
        return;
    }
});
console.log('Form submission prevention script loaded');
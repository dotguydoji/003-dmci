document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("clientForm");
    const submitButton = document.getElementById("submitButton");
    const spinner = document.getElementById("loadingSpinner");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Add rate limiting
    const rateLimitData = {
        lastSubmitTime: 0,
        submitsInLastHour: 0
    };

    // Fixed validation patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s\-'\.]{2,50}$/,
        email: /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
        phone: /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/,
        location: /^[a-zA-Z0-9\s,.\-]{2,100}$/,
        propertyType: /^(residential|commercial|luxury|investment)$/,
        budget: /^(100-300k|300-500k|500-750k|1m\+)$/,
        message: /^[\w\s.,!?()\-]{0,1000}$/,
    };

    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    // Determine API endpoint based on environment
    const apiUrl = isDevelopment
        ? 'http://localhost:8888/.netlify/functions/sendEmail'
        : '/.netlify/functions/sendEmail';

    function checkRateLimit() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);

        if (rateLimitData.lastSubmitTime < oneHourAgo) {
            rateLimitData.submitsInLastHour = 0;
        }

        if (rateLimitData.submitsInLastHour >= 5) {
            return false;
        }

        rateLimitData.submitsInLastHour++;
        rateLimitData.lastSubmitTime = now;
        return true;
    }

    function sanitizeInput(input, type) {
        if (!input) return "";

        input = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        input = input.trim();

        // Avoid double encoding/decoding which can cause issues
        input = input.replace(/[<>]/g, "");
        input = input.replace(/<script.*?>.*?<\/script>/gi, "");

        if (type === "message") {
            input = input.substring(0, 1000);
        }

        return input;
    }

    function validateField(field, value) {
        const pattern = patterns[field];
        if (!pattern) return true;

        const element = document.getElementById(field);
        if (!value && element && element.hasAttribute("required")) {
            return false;
        }

        if (!value) return true;
        return pattern.test(value);
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!checkRateLimit()) {
            errorMessage.textContent = "Too many submissions. Please try again later.";
            errorMessage.style.display = "block";
            return;
        }

        if (submitButton.disabled) return;

        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse && !isDevelopment) {
            errorMessage.textContent = "Please complete the reCAPTCHA verification";
            errorMessage.style.display = "block";
            return;
        }

        // Reset form state
        submitButton.disabled = true;
        spinner.style.display = "block";
        successMessage.style.display = "none";
        errorMessage.style.display = "none";

        // Remove any previous error highlights
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));

        try {
            const templateParams = {};
            let isValid = true;

            // Validate and collect all form fields
            ["name", "email", "phone", "location", "propertyType", "budget", "message"].forEach((field) => {
                const input = document.getElementById(field);
                if (!input) return;

                let value = sanitizeInput(input.value, field);

                if (!validateField(field, value)) {
                    isValid = false;
                    input.classList.add("error");
                    console.warn(`Invalid field: ${field}`);
                } else {
                    input.classList.remove("error");
                }

                templateParams[field] = value;
            });

            if (!isValid) {
                throw new Error("Please check the highlighted fields and try again.");
            }

            // Add reCAPTCHA token
            templateParams.recaptcha = recaptchaResponse;

            console.log("Sending form data to API:", apiUrl);

            // Send data to the serverless function
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateParams)
            });

            // Get response as JSON
            const responseData = await response.json();
            console.log("API response:", response.status, responseData);

            if (!response.ok) {
                throw new Error(responseData.error || responseData.details || "Failed to send message. Please try again later.");
            }

            // Success! Clear form and show success message
            successMessage.style.display = "block";
            form.reset();

            // Reset reCAPTCHA
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }

        } catch (error) {
            console.error("Form submission error:", error);

            // Set appropriate error message
            let errorMsg = error.message || "Failed to send message. Please try again later.";

            errorMessage.textContent = errorMsg;
            errorMessage.style.display = "block";

            // Reset reCAPTCHA
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        } finally {
            // Reset UI state
            spinner.style.display = "none";
            submitButton.disabled = false;
        }
    });

    // Real-time validation
    form.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("input", function () {
            const value = sanitizeInput(this.value, this.id);
            if (validateField(this.id, value)) {
                this.classList.remove("error");
            } else {
                this.classList.add("error");
            }
        });
    });
});
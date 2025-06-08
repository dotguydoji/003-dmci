document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const quickContactBtn = document.getElementById('quick-contact-button');
    const quickContactPopup = document.getElementById('quick-contact-popup');
    const closeQuickContactBtn = document.getElementById('close-quick-contact');
    const contactForm = document.getElementById('quick-contact-form');
    const contactNumber = document.getElementById('contact-number');
    const successMessage = document.getElementById('quick-success-message');
    const errorMessage = document.getElementById('quick-error-message');
    const platformRadios = document.querySelectorAll('input[name="platform"]');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Ensure success and error messages are hidden on page load
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Rate limiting
    let lastSubmitTime = 0;
    const minTimeBetweenSubmits = 60000; // 1 minute

    // Toggle form visibility with improved toggle functionality
    quickContactBtn.addEventListener('click', function () {
        // Check if popup is currently visible
        const isVisible = quickContactPopup.style.display === 'block';

        if (isVisible) {
            // Close the popup
            quickContactPopup.style.display = 'none';
            resetForm();
        } else {
            // Open the popup
            quickContactPopup.style.display = 'block';
            // Make sure messages are hidden when popup opens
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }
    });

    closeQuickContactBtn.addEventListener('click', function () {
        quickContactPopup.style.display = 'none';
        resetForm();
    });

    // Form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Add loading state to button
        submitButton.innerHTML = '<span class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
        submitButton.disabled = true;
        submitButton.classList.add('submitting');

        // Check rate limit
        const now = Date.now();
        if (now - lastSubmitTime < minTimeBetweenSubmits) {
            showError('Please wait a moment before submitting again.');
            resetSubmitButton();
            return;
        }

        // Validate phone number
        const phoneRegex = /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/;
        const number = contactNumber.value.trim();

        if (!phoneRegex.test(number)) {
            showError('Please enter a valid phone number.');
            resetSubmitButton();
            return;
        }

        // Get selected platform
        const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;

        try {
            // Use the same serverless function as your main form
            const apiUrl = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1'
                ? 'http://localhost:8888/.netlify/functions/sendEmail'
                : '/.netlify/functions/sendEmail';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'QUICK ASSISTANCE REQUEST',
                    email: 'quickcontact@dmcihomescondominium.com', // This is for routing purposes
                    phone: number,
                    location: 'Quick Contact Form',
                    propertyType: 'QUICK ASSISTANCE REQUEST',
                    budget: 'QUICK ASSISTANCE REQUEST',
                    message: `Client requested quick assistance via ${selectedPlatform.toUpperCase()}. Phone number: ${number}`
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || responseData.details || 'Failed to send message');
            }

            // Show success message with platform-specific information
            const platformName = selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
            showSuccess(platformName);
            lastSubmitTime = now;

            // Animate the submit button to show completion
            submitButton.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitButton.style.backgroundColor = '#28a745';
            submitButton.classList.remove('submitting');
            submitButton.classList.add('success');

            // Disable form elements during success animation
            toggleFormElements(true);

            // Reset form after 4 seconds (enough time to see the animation)
            setTimeout(() => {
                quickContactPopup.style.display = 'none';
                resetForm();
            }, 4000);

        } catch (error) {
            console.error('Error sending contact number:', error);
            showError('Failed to send message. Please try again later.');
            resetSubmitButton();
        }
    });

    // Reset submit button to original state
    function resetSubmitButton() {
        submitButton.innerHTML = 'Submit';
        submitButton.disabled = false;
        submitButton.classList.remove('submitting', 'success');
        submitButton.style.backgroundColor = '';
    }

    // Helper functions
    function resetForm() {
        contactForm.reset();
        // Explicitly hide success and error messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        // Default back to WhatsApp selection
        document.querySelector('input[value="whatsapp"]').checked = true;
        // Reset button state
        resetSubmitButton();
        // Enable form elements
        toggleFormElements(false);
    }

    function showSuccess(platformName) {
        // Update success message text
        const successDesc = successMessage.querySelector('.success-desc');
        if (successDesc) {
            successDesc.textContent = `We'll contact you shortly via ${platformName}.`;
        }
        successMessage.style.display = 'flex';
        errorMessage.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function toggleFormElements(disabled) {
        // Disable/enable all form elements during success animation
        const formElements = contactForm.querySelectorAll('input, button, select');
        formElements.forEach(element => {
            element.disabled = disabled;
        });
    }

    // Close form when clicking outside - but don't reset if just clicking elsewhere
    document.addEventListener('click', function (e) {
        if (!quickContactPopup.contains(e.target) && e.target !== quickContactBtn) {
            quickContactPopup.style.display = 'none';
            resetForm();
        }
    });

    // Add visual feedback for platform selection
    platformRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            // This triggers a reflow to apply the :has selector styles
            this.closest('label').classList.toggle('active');
        });
    });
});
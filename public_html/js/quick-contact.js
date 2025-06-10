document.addEventListener('DOMContentLoaded', function () {
    const quickContactBtn = document.getElementById('quick-contact-button');
    const quickContactPopup = document.getElementById('quick-contact-popup');
    const closeQuickContactBtn = document.getElementById('close-quick-contact');
    const contactForm = document.getElementById('quick-contact-form');
    const contactNumber = document.getElementById('contact-number');
    const successMessage = document.getElementById('quick-success-message');
    const errorMessage = document.getElementById('quick-error-message');
    const platformRadios = document.querySelectorAll('input[name="platform"]');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    let lastSubmitTime = 0;
    const minTimeBetweenSubmits = 60000;
    quickContactBtn.addEventListener('click', function () {
        const isVisible = quickContactPopup.style.display === 'block';
        if (isVisible) {
            quickContactPopup.style.display = 'none';
            resetForm();
        } else {
            quickContactPopup.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }
    });
    closeQuickContactBtn.addEventListener('click', function () {
        quickContactPopup.style.display = 'none';
        resetForm();
    });
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        submitButton.innerHTML = '<span class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
        submitButton.disabled = true;
        submitButton.classList.add('submitting');
        const now = Date.now();
        if (now - lastSubmitTime < minTimeBetweenSubmits) {
            showError('Please wait a moment before submitting again.');
            resetSubmitButton();
            return;
        }
        const phoneRegex = /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/;
        const number = contactNumber.value.trim();
        if (!phoneRegex.test(number)) {
            showError('Please enter a valid phone number.');
            resetSubmitButton();
            return;
        }
        const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
        try {
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
                    email: 'quickcontact@dmcihomescondominium.com',
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
            const platformName = selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
            showSuccess(platformName);
            lastSubmitTime = now;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitButton.style.backgroundColor = '#28a745';
            submitButton.classList.remove('submitting');
            submitButton.classList.add('success');
            toggleFormElements(true);
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
    function resetSubmitButton() {
        submitButton.innerHTML = 'Submit';
        submitButton.disabled = false;
        submitButton.classList.remove('submitting', 'success');
        submitButton.style.backgroundColor = '';
    }
    function resetForm() {
        contactForm.reset();
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        document.querySelector('input[value="whatsapp"]').checked = true;
        resetSubmitButton();
        toggleFormElements(false);
    }
    function showSuccess(platformName) {
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
        const formElements = contactForm.querySelectorAll('input, button, select');
        formElements.forEach(element => {
            element.disabled = disabled;
        });
    }
    document.addEventListener('click', function (e) {
        if (!quickContactPopup.contains(e.target) && e.target !== quickContactBtn) {
            quickContactPopup.style.display = 'none';
            resetForm();
        }
    });
    platformRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            this.closest('label').classList.toggle('active');
        });
    });
});
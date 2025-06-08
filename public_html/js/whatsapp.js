// Validate elements exist before accessing
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
    }
    return element;
}

// Core elements
const whatsappButton = getElement('whatsapp-button');
const chatbox = getElement('whatsapp-chatbox');
const closeChat = getElement('close-chat');
const sendMessage = getElement('send-message');
const chatInput = getElement('chat-input');

// Guard clause for missing elements
if (!whatsappButton || !chatbox || !closeChat || !sendMessage || !chatInput) {
    console.error('Required WhatsApp elements not found');
}

// Security configuration
const config = {
    phone: '639751243000',
    minMessageLength: 2,
    rateLimit: 3000,
    maxMessageLength: 500
};

// Rate limiting
let lastMessageTime = 0;

// Utility functions
function validatePhoneNumber(phone) {
    return /^\+?[1-9]\d{7,14}$/.test(phone);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
        .substring(0, config.maxMessageLength);
}

function sendToWhatsApp(message) {
    const currentTime = Date.now();

    if (currentTime - lastMessageTime < config.rateLimit) {
        console.warn('Rate limit exceeded. Please wait before sending another message.');
        return false;
    }

    if (!validatePhoneNumber(config.phone)) {
        console.error('Invalid phone number configuration');
        return false;
    }

    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length < config.minMessageLength) {
        console.warn('Message too short or empty after sanitization');
        return false;
    }

    try {
        window.open(
            `https://wa.me/${config.phone}?text=${encodeURIComponent(sanitizedMessage)}`,
            '_blank',
            'noopener,noreferrer'
        );
        lastMessageTime = currentTime;
        return true;
    } catch (error) {
        console.error('Failed to send message:', error);
        return false;
    }
}

// Event Listeners with toggle functionality
whatsappButton.addEventListener('click', () => {
    try {
        // Check if chatbox is currently visible
        const isVisible = chatbox.style.display === 'flex';

        if (isVisible) {
            // Close the chat
            chatbox.style.display = 'none';
            // Keep the button visible and in its original position
        } else {
            // Open the chat
            chatbox.style.display = 'flex';
            // Keep the button visible and in its original position - DON'T HIDE IT
        }
    } catch (error) {
        console.error('Error toggling chat visibility:', error);
    }
});

closeChat.addEventListener('click', () => {
    try {
        chatbox.style.display = 'none';
        // Keep the WhatsApp button visible - DON'T CHANGE ITS DISPLAY
    } catch (error) {
        console.error('Error closing chat:', error);
    }
});

sendMessage.addEventListener('click', () => {
    try {
        const message = chatInput.value;
        if (sendToWhatsApp(message)) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent';
            messageDiv.textContent = sanitizeInput(message);

            const chatBody = getElement('chat-body');
            chatBody.appendChild(messageDiv);
            chatInput.value = '';
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

chatInput.addEventListener('keypress', (e) => {
    try {
        if (e.key === 'Enter') {
            sendMessage.click();
        }
    } catch (error) {
        console.error('Error handling keypress:', error);
    }
});
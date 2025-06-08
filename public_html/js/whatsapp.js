// Config object for easier management and validation
const config = {
    phone: "6399297044108",
    maxMessageLength: 1000,
    minMessageLength: 1,
    messageRateLimit: 5000, // ms between messages
    sanitizationRules: /[<>]/g // Remove potentially harmful HTML characters
};

// Rate limiting implementation
let lastMessageTime = 0;

// Input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(config.sanitizationRules, '')
        .trim()
        .slice(0, config.maxMessageLength);
}

// Validate phone number format
function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
}

// Get elements with error handling
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id '${id}' not found`);
    return element;
}

// Initialize elements safely
let chatbox, whatsappButton, closeChat, chatInput, sendMessage;

try {
    chatbox = getElement('whatsapp-chatbox');
    whatsappButton = getElement('whatsapp-button');
    closeChat = getElement('close-chat');
    chatInput = getElement('chat-input');
    sendMessage = getElement('send-message');
} catch (error) {
    console.error('Failed to initialize WhatsApp chat:', error);
    throw error;
}

// Rate-limited message sender
function sendToWhatsApp(message) {
    const currentTime = Date.now();

    if (currentTime - lastMessageTime < config.messageRateLimit) {
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

// Event Listeners with error boundaries
whatsappButton.addEventListener('click', () => {
    try {
        chatbox.style.display = 'flex';
        whatsappButton.style.display = 'none';
    } catch (error) {
        console.error('Error toggling chat visibility:', error);
    }
});

closeChat.addEventListener('click', () => {
    try {
        chatbox.style.display = 'none';
        whatsappButton.style.display = 'flex';
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
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
    } return element;
}
const whatsappButton = getElement('whatsapp-button');
const chatbox = getElement('whatsapp-chatbox');
const closeChat = getElement('close-chat');
const sendMessage = getElement('send-message');
const chatInput = getElement('chat-input');
if (!whatsappButton || !chatbox || !closeChat || !sendMessage || !chatInput) {
    console.error('Required WhatsApp elements not found');
}
const config = {
    phone: '6399297044108',
    minMessageLength: 2,
    rateLimit: 3000,
    maxMessageLength: 500
};
let lastMessageTime = 0;
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
whatsappButton.addEventListener('click', () => {
    try {
        const isVisible = chatbox.style.display === 'flex';
        if (isVisible) {
            chatbox.style.display = 'none';
        } else {
            chatbox.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error toggling chat visibility:', error);
    }
});
closeChat.addEventListener('click', () => {
    try {
        chatbox.style.display = 'none';
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
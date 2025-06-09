const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
const isValidPhone = (phone) => {
    const phoneRegex = /^(\+?[0-9]{10,15}$)|(^09[0-9]{9}$)/;
    return phoneRegex.test(phone);
};
const sanitizeInput = (input, maxLength = 1000) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '')
        .replace(/<script.*?>.*?<\/script>/gi, '')
        .trim()
        .substring(0, maxLength);
};
const createEmailHTML = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff;">
            <h2 style="color: #007bff; margin-top: 0;">New Real Estate Inquiry</h2>
        </div>
        <div style="margin-top: 20px;">
            <strong>Client Name:</strong><br>
            ${data.name}<br><br>
            <strong>Email Address:</strong><br>
            ${data.email}<br><br>
            <strong>Phone Number:</strong><br>
            ${data.phone}<br><br>
            <strong>Location:</strong><br>
            ${data.location}<br><br>
            <strong>Property Type:</strong><br>
            ${data.propertyType}<br><br>
            <strong>Budget Range:</strong><br>
            ${data.budget}<br><br>
            <strong>Message:</strong><br>
            ${data.message || 'No message provided'}<br><br>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <small style="color: #666;">
                Submission Time: ${new Date().toISOString()}<br>
                Form ID: real-estate-inquiry<br>
                Verification: ${data.recaptcha ? 'Verified' : 'Not verified'}
            </small>
        </div>
    </div>
    `;
};
exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight request successful' })
        };
    }
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
            headers: { ...headers, 'Allow': 'POST' }
        };
    }
    console.log('Received form submission request');
    try {
        let data;
        try {
            data = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON format' })
            };
        }
        if (!data.name || !data.email || !data.phone || !data.location || !data.propertyType || !data.budget) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        if (!isValidEmail(data.email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }
        if (!isValidPhone(data.phone)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid phone format' })
            };
        }
        if (data.recaptcha && process.env.RECAPTCHA_SECRET_KEY) {
            try {
                console.log('Verifying reCAPTCHA...');
                const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptcha}`;
                const recaptchaVerification = await axios.post(
                    recaptchaUrl,
                    {},
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                );
                if (!recaptchaVerification.data.success) {
                    console.error('reCAPTCHA verification failed:', recaptchaVerification.data);
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'reCAPTCHA verification failed' })
                    };
                }
                console.log('reCAPTCHA verification successful');
            } catch (error) {
                console.error('reCAPTCHA verification error:', error.message);
            }
        }
        const sanitizedData = {
            name: sanitizeInput(data.name, 100),
            email: sanitizeInput(data.email, 100),
            phone: sanitizeInput(data.phone, 20),
            location: sanitizeInput(data.location, 200),
            propertyType: sanitizeInput(data.propertyType, 50),
            budget: sanitizeInput(data.budget, 50),
            message: sanitizeInput(data.message || '', 1000),
            recaptcha: data.recaptcha ? true : false
        };
        console.log('Preparing to send email with Nodemailer');
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Missing email credentials in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error',
                    details: 'Missing email credentials'
                })
            };
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
            replyTo: sanitizedData.email,
            subject: `Property Inquiry from ${sanitizedData.name}`,
            html: createEmailHTML(sanitizedData),
            text: `New Property Inquiry:\n
Name: ${sanitizedData.name}\n
Email: ${sanitizedData.email}\n
Phone: ${sanitizedData.phone}\n
Location: ${sanitizedData.location}\n
Property Type: ${sanitizedData.propertyType}\n
Budget: ${sanitizedData.budget}\n
Message: ${sanitizedData.message}\n`
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Email sent successfully',
                    id: info.messageId
                })
            };
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Failed to send email through provider',
                    details: emailError.message
                })
            };
        }
    } catch (error) {
        console.error('General error in sendEmail function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to process request',
                details: error.message
            })
        };
    }
};
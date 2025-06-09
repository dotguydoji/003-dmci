/**
 * DMCI Homes Schema.js - Ultra-Safe Version
 * Minimal, secure structured data management
 */

const DMCISchema = {
    config: {
        baseUrl: 'https://www.dmcicondoliving.com',
        agentName: 'Rossana B.',
        agentPhone: '+63-XXX-XXX-XXXX',
        agentEmail: 'contact@dmcicondoliving.com',
        companyName: 'DMCI Homes'
    },

    // Generate property schema (returns object, doesn't inject)
    createPropertySchema: function (propertyData) {
        return {
            "@context": "https://schema.org",
            "@type": "Residence",
            "name": propertyData.name || "DMCI Homes Property",
            "description": propertyData.description || "Premium condominium by DMCI Homes",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": propertyData.city || "Metro Manila",
                "addressCountry": "PH"
            },
            "offers": {
                "@type": "Offer",
                "seller": {
                    "@type": "RealEstateAgent",
                    "name": this.config.agentName,
                    "telephone": this.config.agentPhone
                }
            }
        };
    },

    // Safe injection method with validation
    safeInject: function (schema, id) {
        // Validate input
        if (!schema || typeof schema !== 'object') {
            console.warn('Invalid schema data');
            return false;
        }

        // Check if we can safely modify DOM
        if (typeof document === 'undefined' || !document.head) {
            console.warn('Cannot access document head');
            return false;
        }

        try {
            // Remove existing
            const existing = document.getElementById(id);
            if (existing) existing.remove();

            // Create new
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            script.textContent = JSON.stringify(schema);

            document.head.appendChild(script);
            return true;
        } catch (error) {
            console.error('Schema injection failed:', error);
            return false;
        }
    }
};

// Expose minimal API
window.DMCISchema = DMCISchema;

// Simple page detection without history override
document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    // Only inject on property pages
    if (path.includes('/pages/')) {
        const propertyName = path.split('/').pop().replace('.html', '');
        const schema = DMCISchema.createPropertySchema({
            name: propertyName + " Residences",
            city: "Metro Manila"
        });
        DMCISchema.safeInject(schema, 'property-schema');
    }
});
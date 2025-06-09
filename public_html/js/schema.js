// Safe Schema.org JSON-LD for Property Specialist Agent Website
// This represents an individual real estate agent/specialist, NOT the official DMCI corporation

const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": "#rossana-property-specialist",
            "name": "Rossana B.",
            "alternateName": "Rossna B.",
            "jobTitle": "DMCI Homes Property Specialist",
            "description": "Professional real estate agent specializing in DMCI Homes premium properties, luxury condominiums, and landscaped residences in the Philippines.",
            "knowsAbout": [
                "DMCI Homes Properties",
                "Luxury Condominiums",
                "Real Estate Investment",
                "Property Consultation",
                "Urban Living Solutions"
            ],
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Real Estate Agent",
                "occupationLocation": {
                    "@type": "Place",
                    "name": "Philippines"
                }
            },
            "worksFor": {
                "@type": "Organization",
                "name": "DMCI Homes",
                "description": "Premier real estate developer in the Philippines"
            }
        },
        {
            "@type": "WebSite",
            "@id": "#website",
            "url": "https://www.dmcicondoliving.com",
            "name": "DMCI Homes - Rossana B. Property Specialist",
            "description": "Explore premium real estate offerings by DMCI Homes featuring luxury condominiums, landscaped residences, and modern urban living through professional property specialist services.",
            "inLanguage": ["en", "tl"],
            "author": {
                "@id": "#rossana-property-specialist"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.dmcicondoliving.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@type": "Service",
            "@id": "#property-services",
            "serviceType": "Real Estate Consultation Services",
            "name": "DMCI Homes Property Specialist Services",
            "description": "Professional property consultation services for DMCI Homes luxury condominiums and residential properties.",
            "provider": {
                "@id": "#rossana-property-specialist"
            },
            "areaServed": {
                "@type": "Country",
                "name": "Philippines"
            },
            "serviceOutput": [
                "Property Consultation",
                "Investment Guidance",
                "Property Viewing Arrangements",
                "Purchase Assistance"
            ],
            "category": "Real Estate Services"
        },
        {
            "@type": "WebPage",
            "@id": "#homepage",
            "url": "https://www.dmcicondoliving.com/index.html",
            "name": "DMCI HOMES - Premium Real Estate",
            "description": "Explore premium real estate offerings by DMCI Homes featuring luxury condominiums, landscaped residences, and modern urban living.",
            "isPartOf": {
                "@id": "#website"
            },
            "about": {
                "@id": "#property-services"
            },
            "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://www.dmcicondoliving.com/images/og-homepage.jpg",
                "description": "DMCI Homes Premium Real Estate"
            }
        },
        {
            "@type": "BreadcrumbList",
            "@id": "#breadcrumbs",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "WebPage",
                        "name": "Home",
                        "url": "https://www.dmcicondoliving.com/index.html"
                    }
                }
            ]
        },
        {
            "@type": "Organization",
            "@id": "#website-organization",
            "name": "DMCI Homes Property Specialist - Rossana B.",
            "description": "Professional property specialist services for DMCI Homes premium real estate properties.",
            "url": "https://www.dmcicondoliving.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.dmcicondoliving.com/images/favicon.ico"
            },
            "sameAs": [],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Property Consultation",
                "availableLanguage": ["English", "Filipino"]
            },
            "employee": {
                "@id": "#rossana-property-specialist"
            }
        }
    ]
};

// Function to safely inject schema
function injectSchema() {
    try {
        // Check if schema already exists
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            console.log('Schema already exists, skipping injection');
            return;
        }

        // Create and inject schema script
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaData, null, 2);

        // Insert in head
        document.head.appendChild(script);
        console.log('Schema.org markup successfully injected');

    } catch (error) {
        console.error('Error injecting schema:', error);
    }
}

// Safe execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSchema);
} else {
    injectSchema();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { schemaData, injectSchema };
}
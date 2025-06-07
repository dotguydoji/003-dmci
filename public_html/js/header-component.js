// header-component.js - Reusable header component with integrated search functionality

document.addEventListener('DOMContentLoaded', function () {
    // Create and insert the header HTML
    const headerHTML = `
        <header class="header">
            <nav class="nav-container">
                <div class="logo">
                    <img src="/images/dmci-logo.png" alt="DMCI Homes Logo" />
                </div>

                <ul class="nav-links">
                    <li><a href="/index.html#home">Home</a></li>
                    <li><a href="/pages/browsemore.html">Locations</a></li>
                    <li><a href="/index.html#highlights">Highlights</a></li>
                    <li><a href="https://sid.dmcihomes.com/OnlineCRF/Main.aspx?ac=NO35033" target="_blank">Register</a></li>
                    <li><a href="/index.html#section6">Contact Us</a></li>
                </ul>

                <!-- Mobile Menu Toggle -->
                <div class="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <!-- Functional Search (positioned on the right) -->
                <div class="search-container">
                    <form id="search" class="search-form">
                        <div class="container-input">
                            <input id="search-bar" type="text" placeholder="Search Location" name="text" class="input">
                            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                                <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
                            </svg>
                        </div>
                    </form>
                    <div id="results" class="results-dropdown"></div>
                </div>
            </nav>
        </header>
    `;

    // Find the custom header element and replace its content
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.outerHTML = headerHTML;
    }

    // Initialize search functionality after header is inserted
    initializeSearch();

    // Initialize mobile menu functionality
    initializeMobileMenu();
});

// Search functionality (integrated from hanap.js)
function initializeSearch() {
    const files = [
        // Manila/Makati/Ortigas:
        { name: "Two Central", path: "/pages/two.html" },
        { name: "Trellis Towers", path: "/pages/trellis.html" },
        { name: "One Spatial", path: "/pages/one.html" },
        { name: "Flair Towers", path: "/pages/flair.html" },
        { name: "Brio Tower", path: "/pages/brio.html" },
        { name: "One Archers Place", path: "/pages/archers.html" },
        { name: "Perla Ortigas", path: "/pages/perla.html" },
        { name: "Magnolia Place II", path: "/pages/magnolia.html" },
        { name: "One Shangrila Place", path: "/pages/shangrila.html" },

        // Pasig:
        { name: "Lumiere Residences", path: "/pages/lumiere.html" },
        { name: "Mirea Residences", path: "/pages/mirea.html" },
        { name: "Sheridan Towers", path: "/pages/sheridan.html" },
        { name: "Brixton Place", path: "/pages/brixton.html" },
        { name: "Allegra Garden Place", path: "/pages/allegra.html" },
        { name: "Prisma Residences", path: "/pages/prisma.html" },
        { name: "Fairlane Residences", path: "/pages/fairlane.html" },
        { name: "Levina Place", path: "/pages/levina.html" },
        { name: "The Valeron Tower", path: "/pages/valeron.html" },

        // Taguig:
        { name: "Mahogany Place III", path: "/pages/mahogany.html" },
        { name: "The Birchwood", path: "/pages/birchwood.html" },
        { name: "Maple Place", path: "/pages/maple.html" },
        { name: "Ivory Wood", path: "/pages/ivory.html" },
        { name: "Verawood Residences", path: "/pages/verawood.html" },
        { name: "Mulberry Place", path: "/pages/mulberry.html" },
        { name: "Cypress Towers", path: "/pages/cypress.html" },
        { name: "Alder Residences", path: "/pages/alder.html" },

        // Caloocan:
        { name: "The Calinea Tower", path: "/pages/calinea.html" },

        // Las Pinas:
        { name: "Sonora Garden Residences", path: "/pages/sonora.html" },
        { name: "Maricielo Villas", path: "/pages/maricielo.html" },

        // Paranaque:
        { name: "Siena Park Residences", path: "/pages/siena.html" },
        { name: "Oak Harbor Residences", path: "/pages/oak.html" },
        { name: "Asteria Residences", path: "/pages/asteria.html" },
        { name: "The Atherton", path: "/pages/atherton.html" },
        { name: "Arista Place", path: "/pages/arista.html" },
        { name: "Calathea Place", path: "/pages/calathea.html" },

        // Muntinlupa:
        { name: "Rhapsody Residences", path: "/pages/rhapsody.html" },

        // Cavite:
        { name: "Alea Residences", path: "/pages/alea.html" },

        // Baguio:
        { name: "Outlook Ridge Residences", path: "/pages/outlook.html" },
        { name: "Bristle Ridge", path: "/pages/bristle.html" },

        // Boracay:
        { name: "Alta Vista De Boracay", path: "/pages/alta.html" },

        // Davao:
        { name: "Verdon Parc", path: "/pages/verdon.html" },

        // Benguet:
        { name: "Moncello Crest", path: "/pages/moncello.html" },

        // Batangas: 
        { name: "Solmera Coast", path: "/pages/solmera.html" },

        // Cebu:
        { name: "Kalea Heights", path: "/pages/kalea.html" },
    ];

    const searchBar = document.getElementById("search-bar");
    const resultsContainer = document.getElementById("results");
    let selectedIndex = -1;
    let visibleResults = [];

    if (!searchBar || !resultsContainer) {
        console.error("Search elements not found");
        return;
    }

    // Attach event listeners
    searchBar.addEventListener("input", validateInput);
    searchBar.addEventListener("keydown", handleKeyNavigation);
    disableCopyPaste(searchBar);
    disableAutocomplete(searchBar);

    function validateInput(event) {
        let input = event.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 16).trim();
        if (!/^[a-zA-Z\s]*$/.test(input)) input = "";
        event.target.value = input;
        searchFiles(input);
        selectedIndex = -1; // Reset selection when input changes
    }

    function handleKeyNavigation(event) {
        const items = resultsContainer.getElementsByClassName("dropdown-item");

        if (resultsContainer.style.display === "none") return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
                break;

            case "ArrowUp":
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection(items);
                break;

            case "Enter":
                event.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    const selectedItem = items[selectedIndex];
                    if (selectedItem.href) {
                        window.location.href = selectedItem.href;
                    }
                }
                break;

            case "Escape":
                event.preventDefault();
                resultsContainer.style.display = "none";
                selectedIndex = -1;
                break;
        }
    }

    function updateSelection(items) {
        Array.from(items).forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add("selected");
                // Ensure the selected item is visible in the dropdown
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("selected");
            }
        });
    }

    function searchFiles(query) {
        if (query.trim() === "") {
            resultsContainer.innerHTML = "";
            resultsContainer.style.display = "none";
            visibleResults = [];
            return;
        }

        visibleResults = files.filter(file =>
            file.name.toLowerCase().includes(query.toLowerCase())
        );

        resultsContainer.innerHTML = visibleResults.length > 0
            ? visibleResults.map(file =>
                DOMPurify.sanitize(`<a href="${file.path}" class="dropdown-item">${file.name}</a>`)
            ).join("")
            : "<div class='dropdown-item'>No files found.</div>";

        resultsContainer.style.display = "block";
        selectedIndex = -1; // Reset selection when search results change
    }

    function disableCopyPaste(inputElement) {
        inputElement.addEventListener("copy", e => e.preventDefault());
        inputElement.addEventListener("cut", e => e.preventDefault());
        inputElement.addEventListener("paste", e => e.preventDefault());
    }

    function disableAutocomplete(inputElement) {
        inputElement.setAttribute("autocomplete", "off");
    }

    // Close results when clicking outside the search bar or results
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = "none";
            selectedIndex = -1;
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const files = [
        { name: "Manila", path: "/pages/browsemore.html#manila" },
        { name: "Makati City", path: "/pages/browsemore.html#makati" },
        { name: "Pasay City", path: "/pages/browsemore.html#pasay" },
        { name: "Quezon City", path: "/pages/browsemore.html#quezon" },
        { name: "Mandaluyong City", path: "/pages/browsemore.html#mandaluyong" },
        { name: "Pasig City", path: "/pages/browsemore.html#pasig" },
        { name: "Taguig City", path: "/pages/browsemore.html#taguig" },
        { name: "Caloocan City", path: "/pages/browsemore.html#caloocan" },
        { name: "Las Piñas", path: "/pages/browsemore.html#laspinas" },
        { name: "Parañaque City", path: "/pages/browsemore.html#paranaque" },
        { name: "Muntinlupa City", path: "/pages/browsemore.html#muntinlupa" },
        { name: "Cavite", path: "/pages/browsemore.html#cavite" },
        { name: "Baguio City", path: "/pages/browsemore.html#baguio" },
        { name: "Boracay", path: "/pages/browsemore.html#boracay" },
        { name: "Davao City", path: "/pages/browsemore.html#davao" },
        { name: "Benguet", path: "/pages/browsemore.html#benguet" },
        { name: "Batangas", path: "/pages/browsemore.html#batangas" },
        { name: "Cebu", path: "/pages/browsemore.html#cebu" },


        // Manila:
        { name: "Sorrel Residences", path: "/pages/sorrel.html" },
        { name: "The Camden Place", path: "/pages/camden.html" },
        { name: "Torre De Manila", path: "/pages/torre.html" },
        { name: "Illumina Residences Manila", path: "/pages/illumina.html" },


        // Makati:
        { name: "Fortis Residences", path: "/pages/fortis.html" },
        { name: "Brio Tower", path: "/pages/brio.html" },


        // Pasay:
        { name: "Fairway Terraces", path: "/pages/fairway.html" },
        { name: "La Verti Residences", path: "/pages/laverti.html" },
        { name: "The Aston Place", path: "/pages/aston.html" },
        { name: "Anissa Heights", path: "/pages/anissa.html" },


        // Quezon:
        { name: "The Oriana", path: "/pages/oriana.html" },
        { name: "The Crestmont", path: "/pages/crestmont.html" },
        { name: "Infina Towers", path: "/pages/infina.html" },
        { name: "The Erin Heights", path: "/pages/erin.html" },
        { name: "Stellar Place", path: "/pages/stellar.html" },
        { name: "One Castilla Place", path: "/pages/castilla.html" },
        { name: "Zinnia Towers", path: "/pages/zinnia.html" },
        { name: "The Orabella", path: "/pages/orabella.html" },
        { name: "Cameron Residences", path: "/pages/cameron.html" },
        { name: "Viera Residences", path: "/pages/viera.html" },
        { name: "The Celandine", path: "/pages/celandine.html" },
        { name: "Accolade Place", path: "/pages/accolade.html" },
        { name: "Magnolia Place", path: "/pages/magnolia.html" },
        { name: "One Delta Terraces", path: "/pages/delta.html" },
        { name: "The Redwoods", path: "/pages/redwoods.html" },


        // Mandaluyong:
        { name: "Kai Garden Residences", path: "/pages/kai.html" },
        { name: "Tivoli Garden Residences", path: "/pages/tivoli.html" },
        { name: "Flair Towers", path: "/pages/flair.html" },
        { name: "Sage Residences", path: "/pages/sage.html" },
        { name: "Dansalan Gardens Condominiums", path: "/pages/dansalan.html" },


        // Pasig:
        { name: "Lumiere Residences", path: "/pages/lumiere.html" },
        { name: "Satori Residences", path: "/pages/satori.html" },
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


});


// Fixed Search JavaScript - Resolves Double Focus Issue
// This code should be added to your index-search.js or similar search file

document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const resultsContainer = document.getElementById("results");
    let selectedIndex = -1;
    let visibleResults = [];
    let isKeyboardNavActive = false; // Track if keyboard navigation is being used

    // Your existing files array - replace with your actual data
    const files = [
        { name: "Pasay City", path: "/pages/laverti.html" },
        { name: "Pasig City", path: "/pages/crestmont.html" },
        { name: "Las Piñas", path: "/pages/cypress.html" },
        { name: "Batangas", path: "/pages/sheridan.html" },
        { name: "Sorrel Residences", path: "/pages/sorrel.html" },
        { name: "Illumina Residences Manila", path: "/pages/illumina.html" },
        { name: "Fortis Residences", path: "/pages/fortis.html" }
    ];

    if (!searchBar || !resultsContainer) return;

    // Initialize search functionality
    searchBar.addEventListener("input", validateInput);
    searchBar.addEventListener("keydown", handleKeyNavigation);

    // Handle mouse events to detect when mouse interaction should override keyboard
    resultsContainer.addEventListener("mouseenter", function () {
        // When mouse enters dropdown, disable keyboard-style navigation
        isKeyboardNavActive = false;
    });

    resultsContainer.addEventListener("mouseleave", function () {
        // When mouse leaves dropdown, allow keyboard navigation to take precedence again
        // but don't automatically set isKeyboardNavActive to true
    });

    // Add mouse event listeners to dropdown items when they're created
    function addMouseListeners() {
        const items = resultsContainer.getElementsByClassName("dropdown-item");
        Array.from(items).forEach((item, index) => {
            // Remove any existing listeners to avoid duplicates
            item.removeEventListener("mouseenter", handleMouseEnter);
            item.removeEventListener("mouseleave", handleMouseLeave);

            // Add new listeners
            item.addEventListener("mouseenter", function () {
                handleMouseEnter(index);
            });

            item.addEventListener("mouseleave", handleMouseLeave);
        });
    }

    function handleMouseEnter(index) {
        if (!isKeyboardNavActive) {
            // Clear keyboard selection when mouse takes over
            clearSelection();
            selectedIndex = index;
            updateSelection();
        }
    }

    function handleMouseLeave() {
        if (!isKeyboardNavActive) {
            // Clear selection when mouse leaves
            selectedIndex = -1;
            clearSelection();
        }
    }

    function validateInput(event) {
        let input = event.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 16).trim();
        if (!/^[a-zA-Z\s]*$/.test(input)) input = "";
        event.target.value = input;
        searchFiles(input);
        selectedIndex = -1; // Reset selection when input changes
        isKeyboardNavActive = false; // Reset keyboard navigation
    }

    function handleKeyNavigation(event) {
        const items = resultsContainer.getElementsByClassName("dropdown-item");

        if (resultsContainer.style.display === "none" || items.length === 0) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                isKeyboardNavActive = true; // Enable keyboard navigation
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection();
                break;

            case "ArrowUp":
                event.preventDefault();
                isKeyboardNavActive = true; // Enable keyboard navigation
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection();
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
                isKeyboardNavActive = false;
                break;
        }
    }

    function updateSelection() {
        const items = resultsContainer.getElementsByClassName("dropdown-item");
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

    function clearSelection() {
        const items = resultsContainer.getElementsByClassName("dropdown-item");
        Array.from(items).forEach((item) => {
            item.classList.remove("selected");
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
        isKeyboardNavActive = false; // Reset keyboard navigation

        // Add mouse listeners to new items
        addMouseListeners();
    }

    function disableCopyPaste(inputElement) {
        inputElement.addEventListener("copy", e => e.preventDefault());
        inputElement.addEventListener("cut", e => e.preventDefault());
        inputElement.addEventListener("paste", e => e.preventDefault());
    }

    function disableAutocomplete(inputElement) {
        inputElement.setAttribute("autocomplete", "off");
    }

    // Initialize security features
    disableCopyPaste(searchBar);
    disableAutocomplete(searchBar);

    // Close results when clicking outside the search bar or results
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = "none";
            selectedIndex = -1;
            isKeyboardNavActive = false;
        }
    });
});
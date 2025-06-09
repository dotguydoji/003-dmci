document.addEventListener('DOMContentLoaded', function () {
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
                    <li><a href="https:
                    <li><a href="/index.html#contact">Contact Us</a></li>
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
                            <input id="search-bar" type="text" placeholder="Location" name="text" class="input">
                            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http:
                                <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
                            </svg>
                        </div>
                    </form>
                    <div id="results" class="results-dropdown"></div>
                </div>
            </nav>
        </header>
    `;
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.outerHTML = headerHTML;
    }
    initializeSearch();
    initializeMobileMenu();
});
function initializeSearch() {
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
        { name: "Sorrel Residences", path: "/pages/sorrel.html" },
        { name: "The Camden Place", path: "/pages/camden.html" },
        { name: "Torre De Manila", path: "/pages/torre.html" },
        { name: "Illumina Residences Manila", path: "/pages/illumina.html" },
        { name: "Fortis Residences", path: "/pages/fortis.html" },
        { name: "Brio Tower", path: "/pages/brio.html" },
        { name: "Fairway Terraces", path: "/pages/fairway.html" },
        { name: "La Verti Residences", path: "/pages/laverti.html" },
        { name: "Air Residences", path: "/pages/air.html" },
        { name: "Beacon Residences", path: "/pages/beacon.html" },
        { name: "Levina Place", path: "/pages/levina.html" },
        { name: "Princeton Residences", path: "/pages/princeton.html" },
        { name: "Callisto Grand Residences", path: "/pages/callisto.html" },
        { name: "Viera Residences", path: "/pages/viera.html" },
        { name: "Boni Avenue", path: "/pages/boni.html" },
        { name: "Sheridan Towers", path: "/pages/sheridan.html" },
        { name: "Prisma Residences", path: "/pages/prisma.html" },
        { name: "Flair Towers", path: "/pages/flair.html" },
        { name: "Zinnia Towers", path: "/pages/zinnia.html" },
        { name: "Rhapsody Residences", path: "/pages/rhapsody.html" },
        { name: "Erin Heights", path: "/pages/erin.html" },
        { name: "Milano Residences", path: "/pages/milano.html" },
        { name: "Lumière Residences", path: "/pages/lumiere.html" },
        { name: "Shore 3 Residences", path: "/pages/shore3.html" },
        { name: "Chimes Greenhills", path: "/pages/chimes.html" },
        { name: "Rhapsody Residences", path: "/pages/rhapsody.html" },
        { name: "Allegra Garden Place", path: "/pages/allegra.html" },
        { name: "Mint Residences", path: "/pages/mint.html" },
        { name: "Empress Residences", path: "/pages/empress.html" },
        { name: "Accolade Place", path: "/pages/accolade.html" },
        { name: "Idesia Dasmarinas", path: "/pages/idesia.html" },
        { name: "Ponderosa Ridge", path: "/pages/ponderosa.html" },
        { name: "Aeron Condominium", path: "/pages/aeron.html" },
        { name: "Mahogany Place III", path: "/pages/mahogany.html" },
        { name: "Asteria Residences", path: "/pages/asteria.html" },
        { name: "Arista Place", path: "/pages/arista.html" },
        { name: "West Side Lofts", path: "/pages/westside.html" }
    ];
    let visibleResults = [];
    let selectedIndex = -1;
    let isKeyboardNavActive = false;
    const searchBar = document.getElementById("search-bar");
    const resultsContainer = document.getElementById("results");
    if (!searchBar || !resultsContainer) {
        console.error("Search elements not found");
        return;
    }
    searchBar.addEventListener("input", validateInput);
    searchBar.addEventListener("keydown", handleKeyNavigation);
    searchBar.addEventListener("focus", () => {
        if (searchBar.value.trim() !== "" && visibleResults.length > 0) {
            resultsContainer.style.display = "block";
        }
    });
    disableCopyPaste(searchBar);
    disableAutocomplete(searchBar);
    resultsContainer.addEventListener("mouseenter", function () {
        isKeyboardNavActive = false;
    });
    resultsContainer.addEventListener("mouseleave", function () {
    });
    function addMouseListeners() {
        const items = resultsContainer.getElementsByClassName("dropdown-item");
        Array.from(items).forEach((item, index) => {
            item.removeEventListener("mouseenter", handleMouseEnter);
            item.removeEventListener("mouseleave", handleMouseLeave);
            item.addEventListener("mouseenter", function () {
                handleMouseEnter(index);
            });
            item.addEventListener("mouseleave", handleMouseLeave);
        });
    }
    function handleMouseEnter(index) {
        if (!isKeyboardNavActive) {
            clearSelection();
            selectedIndex = index;
            updateSelection();
        }
    }
    function handleMouseLeave() {
        if (!isKeyboardNavActive) {
            selectedIndex = -1;
            clearSelection();
        }
    }
    function validateInput(event) {
        let input = event.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 16).trim();
        if (!/^[a-zA-Z\s]*$/.test(input)) input = "";
        event.target.value = input;
        searchFiles(input);
        selectedIndex = -1;
        isKeyboardNavActive = false;
    }
    function handleKeyNavigation(event) {
        const items = resultsContainer.getElementsByClassName("dropdown-item");
        if (resultsContainer.style.display === "none" || items.length === 0) return;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                isKeyboardNavActive = true;
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection();
                break;
            case "ArrowUp":
                event.preventDefault();
                isKeyboardNavActive = true;
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
        selectedIndex = -1;
        isKeyboardNavActive = false;
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
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = "none";
            selectedIndex = -1;
            isKeyboardNavActive = false;
        }
    });
}
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}
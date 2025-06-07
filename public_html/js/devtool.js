// Disable right-click context menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

// Disable text selection with mouse
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
});

// Disable drag events
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I (Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+C (Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }

    // Ctrl+S (Save)
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }

    // Ctrl+A (Select All)
    if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
    }

    // Ctrl+P (Print)
    if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
    }
});

// Disable print screen
document.addEventListener('keyup', function (e) {
    if (e.keyCode === 44) {
        e.preventDefault();
        return false;
    }
});

// Detect if DevTools is open (basic detection)
let devtools = {
    open: false,
    orientation: null
};

const threshold = 160;

setInterval(function () {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            devtools.open = true;
            // You can add action here like redirect or alert
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:24px;">Developer tools detected. Please close to continue.</div>';
        }
    } else {
        devtools.open = false;
    }
}, 500);

// Additional protection - disable common shortcuts
document.addEventListener('keydown', function (e) {
    // Disable Ctrl+Shift+K (Firefox Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+Shift+E (Firefox Network)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 69) {
        e.preventDefault();
        return false;
    }
});

// Disable mouse selection
document.onselectstart = function () {
    return false;
};

document.onmousedown = function () {
    return false;
};

// Additional drag prevention
document.ondragstart = function () {
    return false;
};

// Disable image saving
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
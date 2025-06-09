document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
});
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
});
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
    }
});
document.addEventListener('keyup', function (e) {
    if (e.keyCode === 44) {
        e.preventDefault();
        return false;
    }
});
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
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:24px;">Developer tools detected. Please close to continue.</div>';
        }
    } else {
        devtools.open = false;
    }
}, 500);
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 69) {
        e.preventDefault();
        return false;
    }
});
document.onselectstart = function () {
    return false;
};
document.onmousedown = function () {
    return false;
};
document.ondragstart = function () {
    return false;
};
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
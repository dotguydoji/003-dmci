(function () {
    'use strict';
    const footerHTML = `
        <footer style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #ffffff;
            padding: 20px 0;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
            margin-top: auto;
        ">
            <div style="
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            ">
                <div style="
                    font-size: 14px;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin-bottom: 8px;
                ">
                    Copyright © 2025 DMCI HOMES. All rights reserved.
                </div>
                <div style="
                    font-size: 12px;
                    line-height: 1.5;
                    opacity: 0.7;
                    max-width: 800px;
                    margin: 0 auto;
                ">
                    Materials like Images/Photos used here are for marketing purposes only. No copyright infringement intended. 
                      D M C I H O M E S . C O M 
                    is the official website.
                </div>
            </div>
        </footer>
    `;
    function loadFooter() {
        const footerContainers = [
            document.getElementById('dmci-footer'),
            document.getElementById('footer'),
            document.querySelector('.dmci-footer'),
            document.querySelector('.footer-container')
        ].filter(el => el !== null);
        footerContainers.forEach(container => {
            if (container && !container.innerHTML.trim()) {
                container.innerHTML = footerHTML;
            }
        });
        if (footerContainers.length === 0) {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(loadFooter, 0);
    }
})();
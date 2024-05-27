// Handling messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const message = request.message;
    switch (message) {
        case 'show':
            showMinimap()
            break;

        case 'refresh':
            refreshMinimap()
            break;

        case 'hide':
            hideMinimap()
            break;
        default:
            break;
    }
});


// Create elements
let extensionContainer = document.createElement('div');
extensionContainer.id = 'extension-container';
let optionContainer = document.createElement('div');
optionContainer.id = 'option-container';
let toggleButton = document.createElement('button');
toggleButton.id = 'toggle-minimap-button';
toggleButton.innerText = 'Toggle Minimap'
let refreshButton = document.createElement('button');
refreshButton.id = 'refresh-minimap-button';
refreshButton.innerText = 'Refresh Minimap';
hideElement(refreshButton);
optionContainer.appendChild(refreshButton);
optionContainer.appendChild(toggleButton);
extensionContainer.appendChild(optionContainer);

let sourceElements, sourceScrollContainer;
let minimap = document.createElement('div');
minimap.id = 'minimap'
hideElement(minimap);
let targetElements = document.createElement('div')
targetElements.id = 'target-elements'
targetElements.inert = true;
let scrollBar = document.createElement('div');
scrollBar.id = 'scroll-bar';

minimap.appendChild(targetElements);
minimap.appendChild(scrollBar);

extensionContainer.appendChild(minimap)
document.body.appendChild(extensionContainer);


// Functions
function getSourceElements() {
    // cant directly target due to uniquely identified class names
    // so gotta hack it
    sourceElements = document.querySelector('[data-testid^="conversation-turn-"]').parentNode
}

function getSourceScrollContainer() {
    // Used to retrieve information about scroll position
    sourceScrollContainer = sourceElements.parentNode.parentNode;
}

function updateScrollBar() {
    if (sourceScrollContainer) {
        const scrollBarTop = (sourceScrollContainer.scrollTop / sourceScrollContainer.scrollHeight) * (sourceElements.offsetHeight * 0.1);
        scrollBar.style.top = `${scrollBarTop}px`;
    }
}

function updateMinimapScroll() {
    if (sourceScrollContainer) {
        const scrollBarTop = (sourceScrollContainer.scrollTop / sourceScrollContainer.scrollHeight) * (sourceElements.offsetHeight * 0.1);
        const u = sourceScrollContainer.scrollTop + (0.5 * sourceScrollContainer.offsetHeight)
        const v = sourceScrollContainer.scrollHeight
        const a = scrollBarTop + (0.05 * scrollBar.offsetHeight)
        const y = minimap.offsetHeight

        let minimapScrollTop = a - (y * u / v)
        minimap.scrollTo(0, minimapScrollTop);
    }
}

function updateMinimap() {
    getSourceElements()
    getSourceScrollContainer();
    updateMinimapScroll()
    updateScrollBar()
}

function hideElement(element) {
    element.style.display = 'none';
}

function showElement(element) {
    element.style.display = 'initial';
}

function showMinimap() {
    showElement(minimap);
    showElement(refreshButton);
}

function hideMinimap() {
    hideElement(minimap);
    hideElement(refreshButton);
}

function refreshMinimap() {
    getSourceElements()
    getSourceScrollContainer();
    targetElements.innerHTML = sourceElements.outerHTML;
    updateMinimap();
    if (sourceScrollContainer) {
        sourceScrollContainer.addEventListener('scroll', updateMinimap);
    }
};

toggleButton.addEventListener('click', () => {
    if (minimap.style.display === 'none') {
        showMinimap()
    } else {
        hideMinimap()
    }
    refreshMinimap();
})
refreshButton.addEventListener('click', refreshMinimap)

// Scroll Div logic 
let mousedown = false;
window.addEventListener('mouseup', () => mousedown = false)
scrollBar.addEventListener('mousedown', (e) => {
    mousedown = true
    handleScrollBarMove(e.clientY)
})
minimap.addEventListener('mousemove', (e) => {
    if (mousedown) {
        handleScrollBarMove(e.clientY)
    }
})
minimap.addEventListener('click', (e) => handleScrollBarMove(e.clientY))

function handleScrollBarMove(mousePos) {
    if (sourceScrollContainer) {
        const scale = sourceScrollContainer.scrollHeight / (sourceElements.offsetHeight * 0.1);
        const offset = scrollBar.offsetHeight * 0.5 * 0.1;
        const sourceScrollAmount = (mousePos - minimap.getBoundingClientRect().top + minimap.scrollTop - offset) * scale;
        sourceScrollContainer.scrollTo(0, sourceScrollAmount)
    }
}
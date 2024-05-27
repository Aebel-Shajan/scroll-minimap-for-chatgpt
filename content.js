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
optionContainer.appendChild(toggleButton);
extensionContainer.appendChild(optionContainer);

let sourceElements, sourceScrollContainer;
let minimap = document.createElement('div');
minimap.id = 'minimap'
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
        const scrollBarTop = (sourceScrollContainer.scrollTop / sourceScrollContainer.scrollHeight) * minimap.scrollHeight;
        scrollBar.style.top = `${scrollBarTop}px`;
    }
}

function updateMinimapScroll() {
    if (sourceScrollContainer) {
        const scrollBarTop = (sourceScrollContainer.scrollTop / sourceScrollContainer.scrollHeight) * minimap.scrollHeight;
        const u = sourceScrollContainer.scrollTop + (0.5*sourceScrollContainer.offsetHeight)
        const v = sourceScrollContainer.scrollHeight
        const a = scrollBarTop + (0.05 * scrollBar.offsetHeight)
        const y = minimap.offsetHeight

        let minimapScrollTop = a - (y * u/v)
        minimap.scrollTo(0, minimapScrollTop);
    }
}

function updateMinimap() {
    updateMinimapScroll()
    updateScrollBar()
}

function showMinimap() {
    minimap.style.display = 'initial'
}

function hideMinimap() {
    minimap.style.display = 'none'
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
        const scale = sourceScrollContainer.scrollHeight / minimap.scrollHeight;
        const offset = scrollBar.offsetHeight * 0.5 * 0.1;
        const sourceScrollAmount = (mousePos - minimap.getBoundingClientRect().top + minimap.scrollTop - offset)*scale;
        sourceScrollContainer.scrollTo(0, sourceScrollAmount)
    }
}
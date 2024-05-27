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
let sourceElements, sourceScrollContainer;
let minimap = document.createElement('div');
minimap.id = 'minimap'
let targetElements = document.createElement('div')
targetElements.id = 'map-container'
targetElements.inert = true;
let scrollBar = document.createElement('div');
scrollBar.id = 'scroll-div';

minimap.appendChild(targetElements);
minimap.appendChild(scrollBar);
document.body.appendChild(minimap);


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
        scrollPos = (sourceScrollContainer.scrollTop / sourceScrollContainer.scrollHeight) * 0.1 * sourceElements.scrollHeight;
        scrollBar.style.top = `${scrollPos}px`;

        let targetElementsScroll = scrollPos - (scrollPos * (minimap.offsetHeight - 50) / (0.1 * sourceElements.scrollHeight));
        minimap.scrollTo(0, targetElementsScroll);
    }
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
    updateScrollBar();
    if (sourceScrollContainer) {
        sourceScrollContainer.addEventListener('scroll', updateScrollBar);
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
    const y = mousePos - minimap.getBoundingClientRect().top + minimap.scrollTop - 50;
    if (sourceScrollContainer) {
        const scrollPos = sourceScrollContainer.scrollHeight * y / minimap.scrollHeight
        sourceScrollContainer.scrollTo(0, scrollPos)
    }
}
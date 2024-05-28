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
    try {
    // cant directly target due to uniquely identified class names
    // so gotta hack it
    sourceElements = document.querySelector('[data-testid^="conversation-turn-"]').parentNode
    } catch {
        sourceElements = document.body.cloneNode(true)
        if (sourceElements.contains(extensionContainer)) {
            sourceElements.removeChild(extensionContainer)
        }
    }
}

function getSourceScrollContainer() {
    try {
        // Used to retrieve information about scroll position
        sourceScrollContainer = sourceElements.parentNode.parentNode;
    } catch {
        sourceScrollContainer = document.body.cloneNode(true)
        if (sourceElements.contains(extensionContainer)) {
            sourceElements.removeChild(extensionContainer)
        }
    }
}

function updateScrollBar() {
    if (sourceScrollContainer) {
        const scrollBarTop = sourceScrollContainer.scrollTop * 0.1;
        scrollBar.style.top = `${scrollBarTop}px`;
    }
}

function updateMinimapScroll() {
    if (sourceScrollContainer) {
        const u = sourceScrollContainer.scrollTop
        const v = sourceScrollContainer.scrollHeight
        const m_size = minimap.offsetHeight - (0.0499*sourceScrollContainer.offsetHeight) // this last bit at the end idk why i have to take away
        let minimapScrollTop = u * (0.1 - (m_size/v))
        minimap.scrollTo(0, minimapScrollTop);
    }
}

// color :rolls eyes:
function colorUserChat() {
    userChatElements = targetElements.querySelectorAll('[data-testid^="conversation-turn-"]').forEach((element, index) => {
        // odd indices are user chat messages. omg i am mega brain for figuring this out
        if (index % 2 == 0) {
            element.style.backgroundColor = '#00DFFF';
        }
    })
}

function updateMinimap() {
    getSourceElements()
    getSourceScrollContainer();
    targetElements.innerHTML = sourceElements.outerHTML;
    colorUserChat();
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
    refreshMinimap();
}

function hideMinimap() {
    hideElement(minimap);
    hideElement(refreshButton);
}

function refreshMinimap() {
    updateMinimap();
    if (sourceScrollContainer) {
        if (sourceScrollContainer.getAttribute('listener') !== 'true') {
            sourceScrollContainer.addEventListener('scroll', updateMinimap);
        }
    }
};

toggleButton.addEventListener('click', () => {
    if (minimap.style.display === 'none') {
        showMinimap()
    } else {
        hideMinimap()
    }
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const message = request.message;
    switch (message) {
        case 'activate':
            activateMinimap()
            break;

        case 'refresh':
            refreshMinimap()
            break;

        case 'close':
            closeMinimap()
            break;
        default:
            break;
    }
});

let minimap, viewBox, scrollBox;
function getMinimap() {
    minimap = document.querySelector("#minimap")
}

function getViewBox() {
    viewBox = document.querySelector('[data-testid^="conversation-turn-"]').parentNode
}

function getScrollBox() {
    scrollBox = viewBox.parentNode.parentNode;
}

function createMinimap() {
    minimap = document.createElement('div');
    minimap.id = 'minimap';
    document.body.appendChild(minimap);
}

function updateMinimap() {
    getViewBox()
    getMinimap()
    if (minimap){
        minimap.innerHTML = viewBox.outerHTML
        minimap.scrollTop = (window.scrollY / document.body.scrollHeight) * minimap.scrollHeight;
    }
};


function activateMinimap() {    
    getMinimap()
    getViewBox();
    if (!minimap) {
        createMinimap();
    }
    updateMinimap();
}

function refreshMinimap() {
    if (minimap) {
        updateMinimap()
    }
}

function closeMinimap() {
    if (minimap) {
        minimap.remove();
    }
}

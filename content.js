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

let viewBox, scrollBox;
let minimap = document.createElement('div');
minimap.id = 'minimap'
let mapContainer = document.createElement('div')
mapContainer.id = 'map-container'
let scrollDiv = document.createElement('div');
scrollDiv.id = 'scroll-div';

minimap.appendChild(mapContainer);
minimap.appendChild(scrollDiv);
document.body.appendChild(minimap);

function getViewBox() {
    viewBox = document.querySelector('[data-testid^="conversation-turn-"]').parentNode
}

function getScrollBox() {
    scrollBox = viewBox.parentNode.parentNode;
}

function showMinimap() {
    minimap.style.display = 'none'
}

function hideMinimap() {
    minimap.style.display = 'initial'
}

function refreshMinimap() {
    getViewBox()
    mapContainer.innerHTML = viewBox.outerHTML;
};
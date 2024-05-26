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
mapContainer.inert = true;
let scrollDiv = document.createElement('div');
scrollDiv.id = 'scroll-div';

minimap.appendChild(mapContainer);
minimap.appendChild(scrollDiv);
document.body.appendChild(minimap);

function getViewBox() {
    // cant directly target due to uniquely identified class names
    // so gotta hack it
    viewBox = document.querySelector('[data-testid^="conversation-turn-"]').parentNode 
}

function getScrollBox() {
    // Used to retrieve information about scroll position
    scrollBox = viewBox.parentNode.parentNode;
}

function updateScrollDiv() {
    getScrollBox();
    if (scrollBox) {
        scrollPos = (scrollBox.scrollTop / scrollBox.scrollHeight) * 0.1 * viewBox.scrollHeight;
        console.log(scrollPos);
        scrollDiv.style.top = `${scrollPos}px`;
    }
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
    updateScrollDiv();
};
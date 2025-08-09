Features the minimap should:
* Take as input the selector of the element to map
* If no selector is provided use the window.
* Have the same background as the document root
* Display an overview of the elementToMap in a canvas
* Correctly display everything in the right scale and dimensions
* Display which part of the elementToMap is visible to the user
* Have a slider which scrolls the elementToMap when dragged
* When the slider is at the top the element should be scrolled to the start, when the slider is at the bottom the element should be scrolled to the end.
* Draw/redraw the minimap when:
    * minimap opened and closed
    * elementToMap is resized
    * the contents in elemenToMap have changed
    * elementToMap is added/removed from dom
* Limit drawing of minimap canvas to every couple seconds instead of immediatly to reduce lag
* Observe the height of the scroll container and redraw as it changes/exceedes a threshold

let prevX = null;
let prevY = null;

function dispatchDragEvent(node, name, mouseevent) {
  const details = {
    x: mouseevent.x,
    y: mouseevent.y,
    clientX: mouseevent.clientX,
    clientY: mouseevent.clientY,
    layerX: mouseevent.layerX,
    layerY: mouseevent.layerY,
    offsetX: mouseevent.offsetX,
    offsetY: mouseevent.offsetY,
    pageX: mouseevent.pageX,
    pageY: mouseevent.pageY,
    screenX: mouseevent.screenX,
    screenY: mouseevent.screenY,
    movementX: mouseevent.x-prevX,
    movementY: mouseevent.y-prevY
  }
  node.dispatchEvent(new CustomEvent(name, {
    composed: true,
    bubbles: true,
    detail: details
  }))
}

export default function draggable(node) {
  const startCallback = (event) => {
    if (event.which === 1) {
      prevX = event.x;
      prevY = event.y;
      window.addEventListener('mousemove', dragCallback);
      window.addEventListener('mouseup', endCallback);
      dispatchDragEvent(node, 'draggingstart', event);
    }
  };

  const dragCallback = (event) => {
    event.preventDefault();
    dispatchDragEvent(node, 'dragging', event);
    prevX = event.x;
    prevY = event.y;
  };

  const endCallback = (event) => {
    window.removeEventListener('mousemove', dragCallback);
    window.removeEventListener('mouseup', endCallback);
    dispatchDragEvent(node, 'draggingend', event);
    prevX = null;
    prevY = null;
  };
  
  node.addEventListener('mousedown', startCallback);
}
function dispatchDragEvent(node, name, mouseevent, prevX, prevY) {
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
    movementX: mouseevent.x - prevX,
    movementY: mouseevent.y - prevY
  };
  node.dispatchEvent(new CustomEvent(name, {
    composed: true,
    bubbles: true,
    detail: details
  }));
}

export default function draggable(node) {
  let prevX = null;
  let prevY = null;

  const startCallback = (event) => {
    if (event.which === 1) {
      prevX = event.x;
      prevY = event.y;
      window.addEventListener('mousemove', dragCallback);
      window.addEventListener('mouseup', endCallback);
      dispatchDragEvent(node, 'draggingstart', event, prevX, prevY);
    }
  };

  const dragCallback = (event) => {
    event.preventDefault();
    prevX = event.x;
    prevY = event.y;
    dispatchDragEvent(node, 'dragging', event, prevX, prevY);
  };

  const endCallback = (event) => {
    window.removeEventListener('mousemove', dragCallback);
    window.removeEventListener('mouseup', endCallback);
    prevX = null;
    prevY = null;
    dispatchDragEvent(node, 'draggingend', event, prevX, prevY);
  };
  
  node.addEventListener('mousedown', startCallback);
}
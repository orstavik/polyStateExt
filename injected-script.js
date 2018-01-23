console.info("To debug the injected script StatePrinter, click here!");

window.addEventListener("state-history-changed", e =>
  window.dispatchEvent(new CustomEvent('state-changed-debug', {detail: JSON.stringify(e.detail[0])}))
);
window.addEventListener("state-history", e=> {
  for (let snap of e.detail.reverse())
    window.dispatchEvent(new CustomEvent('state-changed-debug', {detail: JSON.stringify(snap)}));
});
window.addEventListener('state-changed-debug', (e) => {
  chrome.runtime.sendMessage({
    name: 'new-client-state',
    payload: e.detail
  })
});
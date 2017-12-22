export default function throttle(callback, ms) {
    window._throttleTimeout = window._throttleTimeout || null;
    if (!window._throttleTimeout)
      window._throttleTimeout = setTimeout(() => {
        window._throttleTimeout = null;
        callback();
      }, ms);
  }
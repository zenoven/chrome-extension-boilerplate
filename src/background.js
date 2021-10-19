
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    let {
      requestHeaders,
      frameId,
      parentFrameId,
      tabId,
    } = details;
    // 只改 popup 中的 header
    console.log('hello')
    if (tabId === -1) return details;
    requestHeaders.forEach(function(header) {
      if (header.name.toLowerCase() == 'user-agent') {
          header.value = 'Spoofed UA';
      }
    });
    return {...details, requestHeaders};
  },
  {
    urls: ["<all_urls>"],
  },
  ["requestHeaders"]
);
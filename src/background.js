if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
const modifiedUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const initiatorReg = new RegExp(`chrome-extension:\/\/${chrome.runtime.id}`);

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    let {
      requestHeaders,
      initiator,
      tabId,
      frameId,
      parentFrameId,
    } = details;
    // 只改 popup 中的 header
    let blockingResponse = { requestHeaders };
    if (tabId !== -1) return blockingResponse;
    console.log('details:', details);
    // TODO: 暂时无法判断 request 是从当前 popup中发出的还是从其他 extension 中发出的，暂时都改写下 header
    // let fromCurrentExtension = initiatorReg.test(initiator);
    // if (!fromCurrentExtension) return blockingResponse;
    requestHeaders.forEach((header) => {
      if (header.name.toLowerCase() == 'user-agent') {
        header.value = modifiedUA;
        console.log('new header value:', header.value)
      }
      return header;
    });
    // 返回的是 blockingResponse
    return {requestHeaders};
  },
  {
    urls: ["<all_urls>"],
  },
  ["requestHeaders", "blocking"]
);
import { mobileUA } from 'lib/util';
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
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
    // TODO: 暂时无法判断 request 是从当前 popup中发出的还是从其他 extension 中发出的，暂时都改写下 header
    // let fromCurrentExtension = initiatorReg.test(initiator);
    // if (!fromCurrentExtension) return blockingResponse;
    requestHeaders.forEach((header) => {
      if (header.name.toLowerCase() == 'user-agent') {
        header.value = mobileUA;
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
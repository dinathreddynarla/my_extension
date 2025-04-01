
//Tab manager with metadata
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getMetadata") {
    const keywords: string = getMetaContent("keywords");
    const description: string = getMetaContent("description");
    const Keywords: string = getMetaContent("Keywords");
    const Description: string = getMetaContent("Description");
    sendResponse({ metadata: keywords + description + Keywords + Description });
    return true;
  }
});

//block Ads when message type is toogle_blocker
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_BLOCKER") {
    console.log(message.enabled);
    if (message.enabled) {
      removeAds();
      new MutationObserver(() => removeAds()).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
});

const adSelectors = [
  "iframe[src*='ads']",
  "iframe[src*='doubleclick']",
  "div[id*='ads']",
  "div[class*='ad-']",
  "div[data-ad]",
  "ins.adsbygoogle",
  "img[src*='ads']",
];

const removeAds = () => {
  chrome.storage.local.get("blockedCount", ({ blockedCount }) => {
    blockedCount = blockedCount || 0;

    adSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((ad) => {
        ad.remove();
        blockedCount++;
      });
    });

    chrome.storage.local.set({ blockedCount });
    chrome.runtime.sendMessage({ type: "UPDATE_COUNT", count: blockedCount });
  });
};

function getMetaContent(name: string): string {
    const metaTag: HTMLMetaElement | null = document.querySelector(
      `meta[name="${name}"]`
    );
    return metaTag?.content || "";
  };
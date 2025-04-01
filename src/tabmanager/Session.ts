export const saveSession = () => {
  chrome.tabs.query({}, (tabs) => {
    const session = tabs.map((tab) => {
      return { url: tab.url, pinned: tab.pinned };
    });
    chrome.storage.local.set({ savedSession: session });
  });
};

export const restoreSession = () => {
  chrome.storage.local.get("savedSession", (data) => {
    if (data.savedSession) {
      data.savedSession.forEach((tab: { url: string; pinned: boolean }) => {
        chrome.tabs.create({ url: tab.url, pinned: tab.pinned });
      });
    }
  });
};

// function to check valid urls or not (chrome pages-settings etc, files , pdfs)
export function isValidUrl(url: string): boolean {
  return (
    !url.startsWith("chrome://") &&
    !url.startsWith("edge://") &&
    !url.startsWith("file://") &&
    !url.endsWith(".pdf")
  );
}
// chrome accepted tab colors for tab manager
export function getRandomGroupColor(): chrome.tabGroups.ColorEnum {
  const colors: chrome.tabGroups.ColorEnum[] = [
    "grey",
    "blue",
    "red",
    "yellow",
    "green",
    "pink",
    "purple",
    "cyan",
    "orange",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// get tabs that are already present
export async function getCurrentWindowTabs() {
  return await chrome.tabs.query({ currentWindow: true });
}

//inject content script to existing tabs
export async function injectContentScripts(tabs: chrome.tabs.Tab[]) {
  await Promise.all(
    tabs.map(async (tab) => {
      if (tab.id && tab.url && isValidUrl(tab.url)) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
          });
          console.log(`Content script injected into tab ${tab.id}`);
        } catch (error) {
          console.error(`Failed to inject content script into tab ${tab.id}:`, error);
        }
      }
    })
  );
}

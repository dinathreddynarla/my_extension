import {
  categorizeTabs,
  groupTabsByCategory,
} from "./tabmanager/categorizeTabs";
import { restoreSession, saveSession } from "./tabmanager/Session";
import { getCurrentWindowTabs, injectContentScripts } from "./utils/utils";

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const tabs = await getCurrentWindowTabs();
    await injectContentScripts(tabs);
  } catch (error) {
    console.error("Error during script injection:", error);
  }
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "categorizeGroups") {
    (async () => {
      const tabs = await getCurrentWindowTabs();
      const tabIds = tabs.map(({ id }) => id).filter(Boolean) as number[];
      let categorizedTabs: Record<string, number[]> = {};

      if (tabIds.length) {
        try {
          categorizedTabs = await categorizeTabs(tabIds);
          await groupTabsByCategory(categorizedTabs);
          console.log("Categorized Tabs:", categorizedTabs);
        } catch (error) {
          console.error("Failed to categorize and group tabs:", error);
          return;
        }
      }
    })();
  }

  if (message.action === "saveSession") {
    saveSession();
  }
  if (message.action === "restoreSession") {
    restoreSession();
  }
  if (message.type === "TOGGLE_BLOCKER") {
    chrome.storage.local.set({ enabled: message.enabled });
    chrome.storage.local.set({ blockedCount: 0 });
    console.log(message.enabled);

    // Send message to all tabs
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: "TOGGLE_BLOCKER",
            enabled: message.enabled,
          });
        }
      });
    });
  }

  // Receive count update from content script
  if (message.type === "UPDATE_COUNT") {
    chrome.runtime.sendMessage({ type: "UPDATE_COUNT", count: message.count });
  }
});

// Ensure content script runs on newly opened tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get("enabled", ({ enabled }) => {
      if (enabled && tabId) {
        chrome.tabs.sendMessage(tabId, {
          type: "TOGGLE_BLOCKER",
          enabled: enabled,
        });
      }
    });
  }
});

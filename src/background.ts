import { resetTracker } from "./ProductivityTracker/productivityTracker";
import {
  categorizeTabs,
  groupTabsByCategory,
} from "./TabManager/categorizeTabs";
import { restoreSession, saveSession } from "./TabManager/Session";
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
chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case "categorizeGroups":
      try {
        const tabs = await getCurrentWindowTabs();
        const tabIds = tabs.map(({ id }) => id).filter(Boolean) as number[];
        let categorizedTabs: Record<string, number[]> = {};

        if (tabIds.length) {
          categorizedTabs = await categorizeTabs(tabIds);
          await groupTabsByCategory(categorizedTabs);
          console.log("Categorized Tabs:", categorizedTabs);
        }
      } catch (error) {
        console.error("Failed to categorize and group tabs:", error);
      }
      break;

    case "saveSession":
      saveSession();
      break;

    case "restoreSession":
      restoreSession();
      break;

    case "toggleBlocker":
      chrome.storage.local.set({ enabled: message.enabled });
      chrome.storage.local.set({ blockedCount: 0 });
      console.log(message.enabled);

      // Send message to all tabs
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              action: "toggleBlocker",
              enabled: message.enabled,
            });
          }
        });
      });
      break;

    case "updateCount":
      chrome.runtime.sendMessage({
        action: "updateCount",
        count: message.count,
      });
      break;

    case "resetTime":
      resetTracker();
      break;

    default:
      console.warn(`Unrecognized action: ${message.action}`);
      break;
  }
});

// Ensure content script runs on newly opened tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get("enabled", ({ enabled }) => {
      if (enabled && tabId) {
        chrome.tabs.sendMessage(tabId, {
          action: "toggleBlocker",
          enabled: enabled,
        });
      }
    });
  }
});

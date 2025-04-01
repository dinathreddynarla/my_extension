import { categorizeWebsite } from "./categorizeWebsite";
import { getRandomGroupColor } from "../utils/utils";


export async function categorizeTabs(tabIds: number[]): Promise<Record<string, number[]>> {
    const categorizedTabs: Record<string, number[]> = {};
    await Promise.all(
      tabIds.map(async (tabId) => {
        try {
          const response = await chrome.tabs.sendMessage(tabId, { action: "getMetadata" });
          if (response && response.metadata) {
            const category = categorizeWebsite(response.metadata);
            if (!categorizedTabs[category]) {
              categorizedTabs[category] = [];
            }
            categorizedTabs[category].push(tabId);
          }
        } catch (error) {
          console.error(`Error processing tab ${tabId}:`, error);
        }
      })
    );
    return categorizedTabs;
  }

export async function groupTabsByCategory(categorizedTabs: Record<string, number[]>): Promise<void> {
    const existingGroups = await chrome.tabGroups.query({});
    await Promise.all(
      Object.entries(categorizedTabs).map(async ([category, tabIds]) => {
        try {
          const existingGroup = existingGroups.find((group) => group.title === category);
          if (existingGroup) {
            await chrome.tabs.group({ tabIds, groupId: existingGroup.id });
            console.log(`Added tabs to existing group '${category}'`);
          } else {
            const groupId = await chrome.tabs.group({ tabIds });
            await chrome.tabGroups.update(groupId, { title: category, color: getRandomGroupColor() });
            console.log(`Grouped ${tabIds.length} tabs under '${category}'`);
          }
        } catch (error) {
          console.error(`Error grouping tabs for category '${category}':`, error);
        }
      })
    );
  }


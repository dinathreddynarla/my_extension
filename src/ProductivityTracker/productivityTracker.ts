import { getHostName } from "../utils/utils";

let activeHostName: string | null = null;
let startTime: number | null = null;
let siteTimes: Record<string, number> = {};

chrome.storage.local.get("siteTimes", (data)=>{
  if(data.siteTimes){
    siteTimes = data.siteTimes
  }
})
const updateTabDetails = async () => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (activeTab) {
    activeHostName = getHostName(activeTab.url);
    startTime = Date.now();
  }
};

const trackTime = () => {
  if (!activeHostName || !startTime) return;
  
  const timeSpent = Date.now() - startTime;
  console.log(timeSpent);
  
  siteTimes[activeHostName] = (siteTimes[activeHostName] || 0) + timeSpent;

  startTime = Date.now();
  chrome.storage.local.set({ siteTimes });
};

chrome.tabs.onActivated.addListener(() => {
  trackTime();
  updateTabDetails();
});

chrome.tabs.onUpdated.addListener(() => {
    trackTime();
    updateTabDetails();
});

export const resetTracker = () => {
  siteTimes = {};
  startTime = null;
  chrome.storage.local.set({ siteTimes });
  updateTabDetails()
};
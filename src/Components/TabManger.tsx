import React from "react";

const TabManger: React.FC = () => {
  const handleGroup = () => {
    chrome.runtime.sendMessage({ action: "categorizeGroups" });
  };
  const handleSaveSession = () => {
    chrome.runtime.sendMessage({ action: "saveSession" });
  };
  const handleRestoreSession = () => {
    chrome.runtime.sendMessage({ action: "restoreSession" });
  };
  return (
    <div className="extension">
      <h2>Tab Manger</h2>
      <button onClick={handleGroup}>Group Tabs</button>
      <button onClick={handleSaveSession}>Save Session</button>
      <button onClick={handleRestoreSession}>Restore Session</button>
    </div>
  );
};

export default TabManger;

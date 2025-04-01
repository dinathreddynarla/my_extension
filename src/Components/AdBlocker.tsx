import React, { useState, useEffect } from "react";

const Adblocker: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Get initial state
    chrome.storage.local.get(
      ["enabled", "blockedCount"],
      ({ enabled, blockedCount }) => {
        setEnabled(enabled ?? false);
        setCount(blockedCount ?? 0);
      }
    );

    // Listen for count updates
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "UPDATE_COUNT") {
        setCount(message.count);
      }
    });
  }, []);

  const toggleBlocker = () => {
    const newState = !enabled;
    setEnabled(newState);
    chrome.runtime.sendMessage({ type: "TOGGLE_BLOCKER", enabled: newState });
    console.log(count, newState);
    if (!newState) setCount(0);
  };

  return (
    <div className="extension">
      <h2>Ad Blocker</h2>
      <button onClick={toggleBlocker}>{enabled ? "Disable" : "Enable"}</button>
      <p style={{ fontSize: "1.5em" }}>Ads Blocked: {count}</p>
    </div>
  );
};

export default Adblocker;

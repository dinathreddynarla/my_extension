import React, { useState, useEffect } from "react";

const ProductivityTracker: React.FC = () => {
  const [webSiteTime, setWebSiteTime] = useState<Record<string, number>>({});

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
      if (response) {
        console.log(response)
        setWebSiteTime(response);
      }
    });
  }, []);

  const handleReset = () => {
    chrome.runtime.sendMessage({ action: "resetTime" });
    setWebSiteTime({});
  };

  return (
    <div className="extension">
      <h2>Productivity Tracker</h2>
      <table>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(webSiteTime).length > 0 ? (
            Object.entries(webSiteTime).map(([site, time]) => (
              <tr key={site}>
                <td>{site}</td>
                <td>{(time / 1000).toFixed(1)} secs</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleReset}>Reset Tracker</button>
    </div>
  );
};

export default ProductivityTracker;

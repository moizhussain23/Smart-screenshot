// Utility functions for screenshot capture

/**
 * Captures a screenshot of the current visible tab
 * @param {number} windowId - The window ID to capture
 * @returns {Promise<string>} - Data URL of the captured screenshot
 */
async function captureVisibleTab(windowId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(dataUrl);
      }
    });
  });
}

/**
 * Downloads a screenshot to the user's computer
 * @param {string} dataUrl - The screenshot data URL
 * @param {string} filename - The filename to save as
 */
function downloadScreenshot(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename || `screenshot-${Date.now()}.png`;
  link.click();
}

/**
 * Converts a data URL to a Blob
 * @param {string} dataUrl - The data URL to convert
 * @returns {Blob} - The resulting Blob
 */
function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

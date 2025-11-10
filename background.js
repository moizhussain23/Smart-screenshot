// Background service worker for Smart Screenshot Notes
// This runs in the background and handles extension lifecycle events

chrome.runtime.onInstalled.addListener(() => {
  console.log('Smart Screenshot Notes extension installed');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    // Handle screenshot capture requests
    console.log('Screenshot capture requested');
  }
  return true;
});

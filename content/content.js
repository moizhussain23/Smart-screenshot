// Content script for Smart Screenshot Notes
// This script runs in the context of web pages

console.log('Smart Screenshot Notes content script loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlightElement') {
    // Future feature: highlight elements on the page
    console.log('Highlight element requested');
  }
  return true;
});

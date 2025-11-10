// Popup script for Smart Screenshot Notes

document.getElementById("captureBtn").addEventListener("click", async () => {
  try {
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Capturing...";
    statusEl.className = "";
    
    // Query the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (screenshotUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Capture error:", chrome.runtime.lastError);
        statusEl.textContent = "Error capturing screenshot";
        statusEl.className = "error";
        return;
      }
      
      console.log("Screenshot captured:", screenshotUrl);
      statusEl.textContent = "Screenshot captured! ✓";
      statusEl.className = "success";
      
      // Store the screenshot URL temporarily for saving
      window.currentScreenshot = screenshotUrl;
    });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("status").textContent = "Error: " + error.message;
    document.getElementById("status").className = "error";
  }
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const note = document.getElementById("note").value;
  const statusEl = document.getElementById("status");
  
  if (!window.currentScreenshot) {
    statusEl.textContent = "Please capture a screenshot first";
    statusEl.className = "error";
    return;
  }
  
  try {
    // Get current tab info for context
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Create a screenshot entry
    const screenshotData = {
      url: tab.url,
      title: tab.title,
      note: note,
      screenshot: window.currentScreenshot,
      timestamp: new Date().toISOString()
    };
    
    // Get existing screenshots from storage
    const result = await chrome.storage.local.get(['screenshots']);
    const screenshots = result.screenshots || [];
    
    // Add new screenshot
    screenshots.push(screenshotData);
    
    // Save to storage
    await chrome.storage.local.set({ screenshots: screenshots });
    
    console.log("Screenshot saved:", screenshotData);
    statusEl.textContent = "Saved successfully! ✓";
    statusEl.className = "success";
    
    // Clear the note field
    document.getElementById("note").value = "";
    
    // Clear the current screenshot
    window.currentScreenshot = null;
    
  } catch (error) {
    console.error("Save error:", error);
    statusEl.textContent = "Error saving: " + error.message;
    statusEl.className = "error";
  }
});

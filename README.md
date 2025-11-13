# 📸 Smart Screenshot Notes - Chrome Extension

A Chrome extension that allows you to capture screenshots with context and notes directly from your browser.

## 🚀 Features

- **Quick Screenshot Capture**: Capture the current visible tab with one click
- **Add Notes**: Attach notes to your screenshots for better context
- **Local Storage**: All screenshots and notes are saved locally in your browser
- **Simple & Clean UI**: Modern, intuitive interface

## 📁 Project Structure

```
smart-screenshot-notes/
│
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup/
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Popup logic
│   └── popup.css         # Popup styles
├── content/
│   ├── content.js        # Content script (runs on web pages)
│   └── content.css       # Content styles
├── assets/
│   └── icon128.png       # Extension icon
└── utils/
    └── capture.js        # Screenshot utility functions
   - Click the extension icon in your toolbar
   - Click "📸 Capture Screenshot" to capture the current tab
   - Add a note in the text area
   - Click "💾 Save" to save the screenshot with your note
```
## 🛠️ Installation (Local Testing)

1. **Clone or download this repository**

2. **Open Chrome and navigate to:**
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `smart-screenshot-notes` folder

5. **Test the extension**
   - Click the extension icon in your toolbar
   - Click "📸 Capture Screenshot" to capture the current tab
   - Add a note in the text area
   - Click "💾 Save" to save the screenshot with your note
   
## 📝 How to Use

1. **Capture**: Click the extension icon and press "📸 Capture Screenshot"
2. **Annotate**: Add a note in the text area to provide context
3. **Save**: Click "💾 Save" to store the screenshot and note locally
4. **View**: Screenshots are saved in Chrome's local storage (future: add a gallery view)

## 🔧 Permissions

This extension requires the following permissions:
- `tabs`: To access tab information (URL, title)
- `storage`: To save screenshots and notes locally
- `activeTab`: To capture screenshots of the current tab
- `scripting`: For future features (element highlighting, etc.)
- `host_permissions`: To work on all websites

## 🤝 Contributing

This is an open-source project. Feel free to fork, modify, and submit pull requests!

---

**Note**: This extension is not published on the Chrome Web Store. To use it, you need to load it manually in Developer Mode as described above.

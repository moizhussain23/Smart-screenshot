# 🚀 Installation Guide

## Step 1: Create the Extension Icon

Since Chrome extensions require PNG icons, you need to create one:

### Option A: Use the Icon Generator (Easiest)
1. Open `assets/create-icon.html` in your browser
2. Click the "Download icon128.png" button
3. Save the file as `icon128.png` in the `assets/` folder

### Option B: Use Your Own Icon
- Create or download a 128x128 PNG image
- Save it as `assets/icon128.png`

### Option C: Use a Placeholder
- For quick testing, you can use any 128x128 PNG image
- Just name it `icon128.png` and place it in the `assets/` folder

---

## Step 2: Load the Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to: `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for the toggle in the top-right corner
   - Turn it ON

3. **Load Unpacked Extension**
   - Click the "Load unpacked" button
   - Navigate to your `smart-screenshot-notes` folder
   - Select the folder and click "Select Folder"

4. **Verify Installation**
   - You should see "Smart Screenshot Notes" in your extensions list
   - The extension icon should appear in your Chrome toolbar
   - If you don't see it, click the puzzle piece icon and pin it

---

## Step 3: Test the Extension

1. **Open any webpage** (e.g., google.com)

2. **Click the extension icon** in your toolbar

3. **Capture a screenshot**:
   - Click "📸 Capture Screenshot"
   - You should see "Screenshot captured! ✓"

4. **Add a note** (optional):
   - Type something in the text area
   - Example: "Homepage design reference"

5. **Save the screenshot**:
   - Click "💾 Save"
   - You should see "Saved successfully! ✓"

6. **Check the console** (for debugging):
   - Right-click the extension popup → Inspect
   - Check the Console tab for logs

---

## 🐛 Troubleshooting

### Extension won't load
- **Error**: "Manifest file is missing or unreadable"
  - Make sure `manifest.json` is in the root folder
  - Check that the JSON syntax is valid

### Icon not showing
- **Issue**: Extension loads but no icon appears
  - Make sure `icon128.png` exists in the `assets/` folder
  - Check that the file is a valid PNG image

### Screenshot not capturing
- **Issue**: "Error capturing screenshot"
  - Make sure you're on a regular webpage (not chrome:// pages)
  - Chrome security doesn't allow capturing on internal pages

### Permission errors
- **Issue**: Extension can't access tabs
  - Reload the extension: chrome://extensions/ → Click reload icon
  - Make sure all permissions are granted

---

## 📊 Viewing Saved Screenshots

Currently, screenshots are saved in Chrome's local storage. To view them:

1. **Open the extension popup**
2. **Right-click** → **Inspect**
3. **Go to Console tab**
4. **Type**: `chrome.storage.local.get(['screenshots'], (result) => console.log(result.screenshots))`
5. **Press Enter** to see all saved screenshots

### Future Feature
A gallery view will be added in the next phase to browse and manage screenshots easily!

---

## 🔄 Updating the Extension

After making code changes:

1. Go to `chrome://extensions/`
2. Find "Smart Screenshot Notes"
3. Click the reload icon (🔄)
4. Test your changes

---

## 📤 Preparing for GitHub

Before uploading to GitHub:

1. **Make sure you have**:
   - ✅ All source files
   - ✅ README.md
   - ✅ .gitignore
   - ✅ Icon file (icon128.png)

2. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Screenshot Notes extension"
   ```

3. **Create a GitHub repository**:
   - Go to github.com
   - Click "New repository"
   - Name it: `smart-screenshot-notes`
   - Don't initialize with README (you already have one)

4. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/smart-screenshot-notes.git
   git branch -M main
   git push -u origin main
   ```

---

## ✅ Next Steps

Once the extension is working:
- ✨ Add more features (gallery view, export, etc.)
- 📝 Update README with screenshots
- 🎨 Improve UI/UX
- 🚀 Share on GitHub for your portfolio!

---

**Need help?** Check the console logs or inspect the extension popup for error messages.

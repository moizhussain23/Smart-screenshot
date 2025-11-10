// Gallery page script for Smart Screenshot Notes

let allScreenshots = [];
let filteredScreenshots = [];

// Load screenshots when page loads
document.addEventListener('DOMContentLoaded', async () => {
  await loadScreenshots();
  setupEventListeners();
});

// Load screenshots from storage
async function loadScreenshots() {
  try {
    const result = await chrome.storage.local.get(['screenshots']);
    allScreenshots = result.screenshots || [];
    filteredScreenshots = [...allScreenshots];
    
    // Sort by timestamp (newest first)
    filteredScreenshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    displayScreenshots();
    updateStats();
  } catch (error) {
    console.error('Error loading screenshots:', error);
  }
}

// Display screenshots in gallery
function displayScreenshots() {
  const gallery = document.getElementById('gallery');
  const emptyState = document.getElementById('emptyState');
  
  if (filteredScreenshots.length === 0) {
    gallery.innerHTML = '';
    emptyState.classList.add('show');
    return;
  }
  
  emptyState.classList.remove('show');
  gallery.innerHTML = '';
  
  filteredScreenshots.forEach((screenshot, index) => {
    const card = createScreenshotCard(screenshot, index);
    gallery.appendChild(card);
  });
}

// Create a screenshot card element
function createScreenshotCard(screenshot, index) {
  const card = document.createElement('div');
  card.className = 'screenshot-card';
  
  const noteText = screenshot.note || 'No note added';
  const noteClass = screenshot.note ? '' : 'empty';
  const formattedDate = formatDate(screenshot.timestamp);
  
  card.innerHTML = `
    <img src="${screenshot.screenshot}" alt="Screenshot" class="screenshot-image" data-index="${index}">
    <div class="screenshot-info">
      <div class="screenshot-note ${noteClass}">${escapeHtml(noteText)}</div>
      <div class="screenshot-title">${escapeHtml(screenshot.title)}</div>
      <a href="${screenshot.url}" target="_blank" class="screenshot-url">${escapeHtml(screenshot.url)}</a>
      <div class="screenshot-date">${formattedDate}</div>
      <div class="screenshot-actions">
        <button class="btn-primary download-btn" data-index="${index}">📥 Download</button>
        <button class="btn-danger delete-btn" data-index="${index}">🗑️ Delete</button>
      </div>
    </div>
  `;
  
  return card;
}

// Format date to readable string
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Update statistics
function updateStats() {
  const totalCount = document.getElementById('totalCount');
  const todayCount = document.getElementById('todayCount');
  const weekCount = document.getElementById('weekCount');
  
  totalCount.textContent = allScreenshots.length;
  
  // Count today's screenshots
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayScreenshots = allScreenshots.filter(s => {
    const screenshotDate = new Date(s.timestamp);
    screenshotDate.setHours(0, 0, 0, 0);
    return screenshotDate.getTime() === today.getTime();
  });
  
  todayCount.textContent = todayScreenshots.length;
  
  // Count this week's screenshots
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  const weekScreenshots = allScreenshots.filter(s => {
    const screenshotDate = new Date(s.timestamp);
    return screenshotDate >= weekAgo;
  });
  
  weekCount.textContent = weekScreenshots.length;
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearch);
  
  // Sort functionality
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', handleSort);
  
  // Export all button
  const exportAllBtn = document.getElementById('exportAllBtn');
  exportAllBtn.addEventListener('click', handleExportAll);
  
  // Delete all button
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  deleteAllBtn.addEventListener('click', handleDeleteAll);
  
  // Gallery event delegation
  const gallery = document.getElementById('gallery');
  gallery.addEventListener('click', handleGalleryClick);
  
  // Modal close
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
  
  // Modal download
  const modalDownload = document.getElementById('modalDownload');
  modalDownload.addEventListener('click', handleModalDownload);
}

// Handle search
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    filteredScreenshots = [...allScreenshots];
  } else {
    filteredScreenshots = allScreenshots.filter(screenshot => {
      const note = (screenshot.note || '').toLowerCase();
      const url = (screenshot.url || '').toLowerCase();
      const title = (screenshot.title || '').toLowerCase();
      return note.includes(query) || url.includes(query) || title.includes(query);
    });
  }
  
  displayScreenshots();
}

// Handle delete all
async function handleDeleteAll() {
  if (allScreenshots.length === 0) return;
  
  const confirmed = confirm(`Are you sure you want to delete all ${allScreenshots.length} screenshot${allScreenshots.length > 1 ? 's' : ''}? This cannot be undone.`);
  
  if (confirmed) {
    try {
      await chrome.storage.local.set({ screenshots: [] });
      allScreenshots = [];
      filteredScreenshots = [];
      displayScreenshots();
      updateStats();
    } catch (error) {
      console.error('Error deleting all screenshots:', error);
      alert('Error deleting screenshots. Please try again.');
    }
  }
}

// Handle gallery clicks (event delegation)
function handleGalleryClick(e) {
  const target = e.target;
  
  // View full-size image
  if (target.classList.contains('screenshot-image')) {
    const index = parseInt(target.dataset.index);
    showModal(filteredScreenshots[index]);
  }
  
  // Download screenshot
  if (target.classList.contains('download-btn')) {
    const index = parseInt(target.dataset.index);
    downloadScreenshot(filteredScreenshots[index]);
  }
  
  // Delete screenshot
  if (target.classList.contains('delete-btn')) {
    const index = parseInt(target.dataset.index);
    deleteScreenshot(index);
  }
}

// Show modal with full-size image
function showModal(screenshot) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalNote = document.getElementById('modalNote');
  const modalUrl = document.getElementById('modalUrl');
  const modalDate = document.getElementById('modalDate');
  
  modalImg.src = screenshot.screenshot;
  modalTitle.textContent = screenshot.title;
  modalNote.textContent = screenshot.note || 'No note added';
  modalUrl.textContent = `URL: ${screenshot.url}`;
  modalDate.textContent = `Captured: ${formatDate(screenshot.timestamp)}`;
  
  modal.classList.add('show');
  modal.dataset.currentScreenshot = JSON.stringify(screenshot);
}

// Handle modal download
function handleModalDownload() {
  const modal = document.getElementById('modal');
  const screenshot = JSON.parse(modal.dataset.currentScreenshot);
  downloadScreenshot(screenshot);
}

// Download screenshot
function downloadScreenshot(screenshot) {
  const link = document.createElement('a');
  link.href = screenshot.screenshot;
  const filename = `screenshot-${new Date(screenshot.timestamp).getTime()}.png`;
  link.download = filename;
  link.click();
}

// Delete individual screenshot
async function deleteScreenshot(index) {
  const screenshot = filteredScreenshots[index];
  const confirmed = confirm('Are you sure you want to delete this screenshot?');
  
  if (confirmed) {
    try {
      // Find the screenshot in the original array
      const originalIndex = allScreenshots.findIndex(s => 
        s.timestamp === screenshot.timestamp && s.url === screenshot.url
      );
      
      if (originalIndex !== -1) {
        allScreenshots.splice(originalIndex, 1);
        await chrome.storage.local.set({ screenshots: allScreenshots });
        
        // Update filtered array
        filteredScreenshots.splice(index, 1);
        
        displayScreenshots();
        updateStats();
      }
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      alert('Error deleting screenshot. Please try again.');
    }
  }
}

// Handle sort
function handleSort(e) {
  const sortBy = e.target.value;
  
  switch(sortBy) {
    case 'newest':
      filteredScreenshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      break;
    case 'oldest':
      filteredScreenshots.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      break;
    case 'url':
      filteredScreenshots.sort((a, b) => a.url.localeCompare(b.url));
      break;
  }
  
  displayScreenshots();
}

// Handle export all
async function handleExportAll() {
  if (allScreenshots.length === 0) {
    alert('No screenshots to export!');
    return;
  }
  
  const confirmed = confirm(`Export all ${allScreenshots.length} screenshot${allScreenshots.length > 1 ? 's' : ''} as individual files?`);
  
  if (confirmed) {
    // Download each screenshot
    allScreenshots.forEach((screenshot, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = screenshot.screenshot;
        const timestamp = new Date(screenshot.timestamp).getTime();
        const filename = `screenshot-${timestamp}-${index + 1}.png`;
        link.download = filename;
        link.click();
      }, index * 200); // Stagger downloads to avoid browser blocking
    });
    
    // Also create a JSON file with all metadata
    setTimeout(() => {
      const metadata = allScreenshots.map(s => ({
        url: s.url,
        title: s.title,
        note: s.note,
        timestamp: s.timestamp
      }));
      
      const dataStr = JSON.stringify(metadata, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'screenshots-metadata.json';
      link.click();
      URL.revokeObjectURL(url);
    }, allScreenshots.length * 200 + 500);
    
    alert('Export started! Check your downloads folder.');
  }
}

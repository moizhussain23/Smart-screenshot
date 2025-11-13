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
  
  // Initialize icons for new content
  setTimeout(() => createIcons(), 100);
}

// Create a screenshot card element
function createScreenshotCard(screenshot, index) {
  const card = document.createElement('div');
  card.className = 'screenshot-card';
  
  const noteText = screenshot.note || '';
  const formattedDate = formatDate(screenshot.timestamp);
  const fileSize = formatFileSize(screenshot.size || 0);
  
  card.innerHTML = `
    <div class="screenshot-content">
      <div class="screenshot-image-container">
        <img src="${screenshot.screenshot}" alt="Screenshot" class="screenshot-image" data-index="${index}">
        <div class="screenshot-overlay"></div>
        <div class="screenshot-actions">
          <button class="screenshot-action-btn download-btn" data-index="${index}" title="Download">
            <i data-icon="download"></i>
          </button>
          <button class="screenshot-action-btn danger delete-btn" data-index="${index}" title="Delete">
            <i data-icon="trash-2"></i>
          </button>
        </div>
      </div>
      <div class="screenshot-info">
        <h3 class="screenshot-title">${escapeHtml(screenshot.title)}</h3>
        <div class="screenshot-meta">
          <div class="meta-item">
            <i data-icon="calendar"></i>
            <span>${formattedDate}</span>
          </div>
          <div class="meta-item">
            <i data-icon="hard-drive"></i>
            <span>${fileSize}</span>
          </div>
        </div>
        ${noteText ? `<div class="screenshot-note">${escapeHtml(noteText)}</div>` : ''}
      </div>
    </div>
  `;
  
  // Add click event to open modal
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.screenshot-actions')) {
      openModal(screenshot, index);
    }
  });
  
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

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Update statistics
function updateStats() {
  const totalCount = document.getElementById('totalCount');
  const todayCount = document.getElementById('todayCount');
  const weekCount = document.getElementById('weekCount');
  const totalSize = document.getElementById('totalSize');
  
  totalCount.textContent = allScreenshots.length;
  
  // Calculate total size
  const totalBytes = allScreenshots.reduce((acc, s) => acc + (s.size || 0), 0);
  totalSize.textContent = formatFileSize(totalBytes);
  
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
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Sort functionality
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', handleSort);
  
  // View toggle
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  gridViewBtn.addEventListener('click', () => setViewMode('grid'));
  listViewBtn.addEventListener('click', () => setViewMode('list'));
  
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
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', () => closeModal());
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeModal();
  });
  
  // Modal actions
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const modalDownload = document.getElementById('modalDownload');
  const modalDelete = document.getElementById('modalDelete');
  copyUrlBtn.addEventListener('click', handleCopyUrl);
  modalDownload.addEventListener('click', handleModalDownload);
  modalDelete.addEventListener('click', handleModalDelete);
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
  }
}

// Handle delete all
async function handleDeleteAll() {
  if (allScreenshots.length === 0) {
    alert('No screenshots to delete!');
    return;
  }
  
  const confirmed = confirm(`Are you sure you want to delete all ${allScreenshots.length} screenshot${allScreenshots.length > 1 ? 's' : ''}? This action cannot be undone.`);
  
  if (confirmed) {
    try {
      await chrome.storage.local.set({ screenshots: [] });
      allScreenshots = [];
      filteredScreenshots = [];
      displayScreenshots();
      updateStats();
      alert('All screenshots deleted successfully!');
    } catch (error) {
      console.error('Error deleting screenshots:', error);
      alert('Error deleting screenshots. Please try again.');
    }
  }
}

// Handle gallery clicks (event delegation)
function handleGalleryClick(e) {
  const downloadBtn = e.target.closest('.download-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  
  if (downloadBtn) {
    const index = parseInt(downloadBtn.dataset.index);
    handleDownload(index);
  } else if (deleteBtn) {
    const index = parseInt(deleteBtn.dataset.index);
    handleDelete(index);
  }
}

// Handle download
function handleDownload(index) {
  const screenshot = filteredScreenshots[index];
  if (screenshot) {
    const link = document.createElement('a');
    link.href = screenshot.screenshot;
    const timestamp = new Date(screenshot.timestamp).getTime();
    const filename = `screenshot-${timestamp}.png`;
    link.download = filename;
    link.click();
  }
}

// Handle delete
async function handleDelete(index) {
  const screenshot = filteredScreenshots[index];
  if (!screenshot) return;
  
  const confirmed = confirm('Are you sure you want to delete this screenshot?');
  if (!confirmed) return;
  
  try {
    // Remove from allScreenshots array
    const originalIndex = allScreenshots.findIndex(s => 
      s.timestamp === screenshot.timestamp && s.url === screenshot.url
    );
    
    if (originalIndex !== -1) {
      allScreenshots.splice(originalIndex, 1);
      
      // Save updated array to storage
      await chrome.storage.local.set({ screenshots: allScreenshots });
      
      // Update filtered array and display
      filteredScreenshots = filteredScreenshots.filter((_, i) => i !== index);
      displayScreenshots();
      updateStats();
      
      // Reinitialize Lucide icons for new content
      setTimeout(() => createIcons(), 100);
    }
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    alert('Error deleting screenshot. Please try again.');
  }
}

// Set view mode (grid or list)
function setViewMode(mode) {
  const gallery = document.getElementById('gallery');
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');
  
  if (mode === 'grid') {
    gallery.className = 'gallery grid-view';
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  } else {
    gallery.className = 'gallery list-view';
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  }
  
  // Reinitialize Lucide icons
  setTimeout(() => createIcons(), 100);
}

// Open modal
function openModal(screenshot, index) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalNote = document.getElementById('modalNote');
  const modalUrl = document.getElementById('modalUrl');
  const modalDate = document.getElementById('modalDate');
  const modalSize = document.getElementById('modalSize');
  
  modalImg.src = screenshot.screenshot;
  modalTitle.textContent = screenshot.title;
  modalNote.textContent = screenshot.note || 'No note added';
  modalUrl.textContent = screenshot.url;
  modalDate.textContent = formatDate(screenshot.timestamp);
  modalSize.textContent = formatFileSize(screenshot.size || 0);
  
  // Store current screenshot for modal actions
  modal.dataset.currentIndex = index;
  
  modal.classList.add('show');
  
  // Reinitialize Lucide icons
  setTimeout(() => createIcons(), 100);
}

// Close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
}

// Handle copy URL
async function handleCopyUrl() {
  try {
    const modal = document.getElementById('modal');
    const index = parseInt(modal.dataset.currentIndex);
    const screenshot = filteredScreenshots[index];
    
    if (!screenshot) return;
    
    // Copy URL to clipboard
    await navigator.clipboard.writeText(screenshot.url);
    
    // Show success feedback
    const copyBtn = document.getElementById('copyUrlBtn');
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i data-icon="check"></i>';
    copyBtn.style.background = 'var(--emerald-500)';
    copyBtn.style.color = 'white';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.background = 'var(--slate-200)';
      copyBtn.style.color = '';
      createIcons();
    }, 1500);
    
  } catch (error) {
    console.error('Failed to copy URL:', error);
    alert('Failed to copy URL to clipboard');
  }
}

// Handle modal download
function handleModalDownload() {
  const modal = document.getElementById('modal');
  const index = parseInt(modal.dataset.currentIndex);
  handleDownload(index);
}

// Handle modal delete
async function handleModalDelete() {
  const modal = document.getElementById('modal');
  const index = parseInt(modal.dataset.currentIndex);
  
  closeModal();
  await handleDelete(index);
}

// Initialize icons after content loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createIcons();
  }, 100);
});

function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function showMessage(message, type = 'error') {
  const container = document.getElementById('message-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  
  // Clear existing messages
  container.innerHTML = '';
  container.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

function showError(message) {
  showMessage(message, 'error');
}

function showSuccess(message) {
  showMessage(message, 'success');
}

// Tab functionality
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function createWebhookCard(hook, index) {
  const card = document.createElement('div');
  card.className = 'webhook-card';
  
  const header = document.createElement('div');
  header.className = 'webhook-header';
  
  const titleContainer = document.createElement('div');
  const title = document.createElement('h4');
  title.className = 'webhook-title';
  title.textContent = hook.name;
  
  const url = document.createElement('div');
  url.className = 'webhook-url';
  url.textContent = hook.url;
  
  titleContainer.appendChild(title);
  titleContainer.appendChild(url);
  
  // Meta badges
  const meta = document.createElement('div');
  meta.className = 'webhook-meta';
  
  if (hook.rateLimit && hook.rateLimit > 0) {
    const rateBadge = document.createElement('span');
    rateBadge.className = 'badge badge-rate-limit';
    rateBadge.textContent = `${hook.rateLimit}s limit`;
    meta.appendChild(rateBadge);
  }
  
  // Actions
  const actions = document.createElement('div');
  actions.className = 'webhook-actions';
  
  const testButton = document.createElement('button');
  testButton.className = 'btn btn-sm btn-secondary';
  testButton.innerHTML = '<i class="fa fa-vial"></i> Test';
  testButton.onclick = function () {
    testWebhook(index, testButton);
  };
  
  const editButton = document.createElement('button');
  editButton.className = 'btn btn-sm btn-secondary';
  editButton.innerHTML = '<i class="fa fa-edit"></i> Edit';
  editButton.onclick = function () {
    editWebhook(index);
  };
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-sm btn-danger';
  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
  deleteButton.onclick = function () {
    handleDeleteClick(deleteButton, index);
  };
  
  actions.appendChild(testButton);
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  
  header.appendChild(titleContainer);
  card.appendChild(header);
  if (meta.children.length > 0) {
    card.appendChild(meta);
  }
  card.appendChild(actions);
  
  return card;
}

function loadWebhooks() {
  chrome.storage.local.get('webhooks', function (data) {
    if (chrome.runtime.lastError) {
      console.error('Failed to load webhooks:', chrome.runtime.lastError);
      showError('Error loading webhooks. Please try again.');
      return;
    }

    const list = document.getElementById('webhookList');
    const emptyState = document.getElementById('empty-state');
    list.innerHTML = '';
    
    if (data.webhooks && data.webhooks.length > 0) {
      emptyState.classList.add('hidden');
      data.webhooks.forEach(function (hook, index) {
        const card = createWebhookCard(hook, index);
        list.appendChild(card);
      });
    } else {
      emptyState.classList.remove('hidden');
    }
  });
}

function handleDeleteClick(button, index) {
  if (button.classList.contains('confirm-delete')) {
    // If button already clicked once, perform the deletion
    deleteWebhook(index);
  } else {
    // First click, prompt for confirmation
    button.innerHTML = '<i class="fa fa-check"></i> Confirm?';
    button.classList.add('confirm-delete', 'btn-warning');
    button.classList.remove('btn-danger');
    
    // Revert if clicked elsewhere
    document.addEventListener('click', function eventListener(e) {
      if (!button.contains(e.target)) {
        button.innerHTML = '<i class="fa fa-trash"></i>';
        button.classList.remove('confirm-delete', 'btn-warning');
        button.classList.add('btn-danger');
        document.removeEventListener('click', eventListener);
      }
    }, { once: true });
  }
}

function editWebhook(index) {
  chrome.storage.local.get('webhooks', function (data) {
    const webhooks = data.webhooks;
    const webhook = webhooks[index];
    
    // Switch to webhooks tab if not already there
    switchTab('webhooks');
    
    // Show and expand form
    if (window.formToggleFunctions) {
      window.formToggleFunctions.showForm();
    }
    
    // Fill form
    document.getElementById('url').value = webhook.url;
    document.getElementById('name').value = webhook.name;
    document.getElementById('rateLimit').value = webhook.rateLimit || '';
    
    // Update form UI for editing
    document.getElementById('form-title').innerHTML = '<i class="fa fa-edit"></i> Edit Webhook';
    document.getElementById('save-btn-text').textContent = 'Update Webhook';
    document.getElementById('webhookForm').dataset.index = index;
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('webhook-form-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
}

function deleteWebhook(index) {
  chrome.storage.local.get('webhooks', function (data) {
    if (chrome.runtime.lastError) {
      console.error('Failed to fetch webhooks:', chrome.runtime.lastError);
      showError('Error fetching webhooks. Please try again.');
      return;
    }

    let webhooks = data.webhooks;
    const deletedWebhook = webhooks[index];
    webhooks.splice(index, 1);
    chrome.storage.local.set({ webhooks: webhooks }, function () {
      if (chrome.runtime.lastError) {
        console.error('Failed to delete webhook:', chrome.runtime.lastError);
        showError('Error deleting webhook. Please try again.');
        return;
      }
      console.log('Webhook deleted!');
      showSuccess(`Webhook "${deletedWebhook.name}" deleted successfully!`);
      loadWebhooks(); // Refresh list after deleting
    });
  });
}

function testWebhook(index, buttonElement) {
  chrome.storage.local.get('webhooks', function (data) {
    if (chrome.runtime.lastError) {
      console.error('Failed to fetch webhooks:', chrome.runtime.lastError);
      showError('Error fetching webhooks. Please try again.');
      return;
    }

    const webhook = data.webhooks[index];
    if (!webhook) {
      showError('Webhook not found.');
      return;
    }

    // Update button to show testing state
    const originalContent = buttonElement.innerHTML;
    buttonElement.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Testing`;
    buttonElement.disabled = true;

    const startTime = Date.now();
    const testPayload = {
      url: 'https://example.com/test',
      title: 'Test webhook from Chrome Extension',
      timestamp: new Date().toISOString(),
      type: 'test'
    };

    fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    }).then(response => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Reset button
      buttonElement.innerHTML = originalContent;
      buttonElement.disabled = false;

      if (response.ok) {
        buttonElement.innerHTML = `<i class="fa fa-check" style="color: var(--success-color);"></i> Success`;
        showSuccess(`${webhook.name} test successful (${responseTime}ms)`);
        setTimeout(() => {
          buttonElement.innerHTML = originalContent;
        }, 3000);
      } else {
        buttonElement.innerHTML = `<i class="fa fa-times" style="color: var(--danger-color);"></i> Failed`;
        showError(`${webhook.name} test failed: HTTP ${response.status} (${responseTime}ms)`);
        setTimeout(() => {
          buttonElement.innerHTML = originalContent;
        }, 3000);
      }
    }).catch(error => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Reset button
      buttonElement.innerHTML = `<i class="fa fa-times" style="color: var(--danger-color);"></i> Error`;
      buttonElement.disabled = false;

      showError(`${webhook.name} test error: ${error.message} (${responseTime}ms)`);
      setTimeout(() => {
        buttonElement.innerHTML = originalContent;
      }, 3000);
    });
  });
}

function clearForm() {
  document.getElementById('url').value = '';
  document.getElementById('name').value = '';
  document.getElementById('rateLimit').value = '';
  
  // Reset form UI
  document.getElementById('form-title').innerHTML = '<i class="fa fa-plus"></i> Add New Webhook';
  document.getElementById('save-btn-text').textContent = 'Save Webhook';
  delete document.getElementById('webhookForm').dataset.index;
}

// Settings management
function loadSettings() {
  chrome.storage.local.get({ settings: { notificationInterval: 5 } }, function (data) {
    if (chrome.runtime.lastError) {
      console.error('Failed to load settings:', chrome.runtime.lastError);
      return;
    }
    
    document.getElementById('notificationInterval').value = data.settings.notificationInterval;
  });
}

// Initialize tabs
function initializeTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });
}

// Simple form show/hide functionality
function initializeFormToggle() {
  const addButton = document.getElementById('add-webhook-trigger');
  const formSection = document.getElementById('webhook-form-section');
  const closeButton = document.getElementById('form-close-btn');
  
  function showForm() {
    addButton.style.display = 'none';
    formSection.style.display = 'block';
    
    // Focus first input
    setTimeout(() => {
      document.getElementById('url').focus();
    }, 100);
  }
  
  function hideForm() {
    addButton.style.display = 'flex';
    formSection.style.display = 'none';
    clearForm();
  }
  
  // Add webhook button click
  addButton.addEventListener('click', showForm);
  
  // Close button click
  closeButton.addEventListener('click', hideForm);
  
  // Store references for other functions
  window.formToggleFunctions = {
    showForm,
    hideForm,
    isFormVisible: () => formSection.style.display !== 'none'
  };
}

// No longer needed - using close button instead

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  initializeFormToggle();
  
  // Webhook form submission
  document.getElementById('webhookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const url = document.getElementById('url').value.trim();
    const name = document.getElementById('name').value.trim();

    if (!url || !name) {
      showError('Both URL and name are required.');
      return;
    }

    if (!validateURL(url)) {
      showError('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    const rateLimit = document.getElementById('rateLimit').value.trim();
    const rateLimitValue = rateLimit ? parseInt(rateLimit) : 0;

    if (rateLimit && (isNaN(rateLimitValue) || rateLimitValue < 0)) {
      showError('Rate limit must be a positive number (seconds).');
      return;
    }

    chrome.storage.local.get({ webhooks: [] }, function (data) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving webhooks:', chrome.runtime.lastError);
        showError('Error retrieving webhooks. Please try again.');
        return;
      }

      let webhooks = data.webhooks;
      const index = document.getElementById('webhookForm').dataset.index;
      const isEditing = index !== undefined;
      
      if (isEditing) {
        // Update existing webhook
        webhooks[index] = { url, name, rateLimit: rateLimitValue };
      } else {
        // Add new webhook
        webhooks.push({ url, name, rateLimit: rateLimitValue });
      }
      
      chrome.storage.local.set({ webhooks: webhooks }, function () {
        if (chrome.runtime.lastError) {
          console.error('Failed to save the webhook:', chrome.runtime.lastError);
          showError('Error saving webhook. Please try again.');
          return;
        }
        
        console.log('Webhook saved!');
        const action = isEditing ? 'updated' : 'added';
        showSuccess(`Webhook "${name}" ${action} successfully!`);
        loadWebhooks();
        
        // Hide form after successful save
        if (window.formToggleFunctions) {
          window.formToggleFunctions.hideForm();
        } else {
          clearForm();
        }
      });
    });
  });

  // Settings form submission
  document.getElementById('settingsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const notificationInterval = parseInt(document.getElementById('notificationInterval').value);
    
    if (isNaN(notificationInterval) || notificationInterval < 1 || notificationInterval > 60) {
      showError('Notification interval must be between 1 and 60 seconds.');
      return;
    }
    
    const settings = { notificationInterval };
    
    chrome.storage.local.set({ settings }, function () {
      if (chrome.runtime.lastError) {
        console.error('Failed to save settings:', chrome.runtime.lastError);
        showError('Error saving settings. Please try again.');
        return;
      }
      
      showSuccess('Settings saved successfully!');
    });
  });
  
  loadWebhooks();
  loadSettings();
});
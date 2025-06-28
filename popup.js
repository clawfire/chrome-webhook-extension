function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

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

    // Error handling here
    if (chrome.runtime.lastError) {
      console.error('Error retrieving webhooks:', chrome.runtime.lastError);
      showError('Error retrieving webhooks. Please try again.');
      return;
    }

    let webhooks = data.webhooks;
    const index = document.getElementById('webhookForm').dataset.index;
    if (index !== undefined) {
      // Update existing webhook
      webhooks[index] = { url, name, rateLimit: rateLimitValue };
    } else {
      // Add new webhook
      webhooks.push({ url, name, rateLimit: rateLimitValue });
    }
    chrome.storage.local.set({ webhooks: webhooks }, function () {
      // Error handling here
      if (chrome.runtime.lastError) {
        console.error('Failed to save the webhook:', chrome.runtime.lastError);
        showError('Error saving webhook. Please try again.');
        return;
      }
      console.log('Webhook saved!');
      loadWebhooks(); // Refresh list after saving
      clearForm(); // Clear the form fields
    });
  });
});

function loadWebhooks() {
  chrome.storage.local.get('webhooks', function (data) {
    // Error handling here
    if (chrome.runtime.lastError) {
      console.error('Failed to load webhooks:', chrome.runtime.lastError);
      showError('Error loading webhooks. Please try again.');
      return;
    }

    const list = document.getElementById('webhookList');
    list.innerHTML = '';
    if (data.webhooks && data.webhooks.length > 0) {
      data.webhooks.forEach(function (hook, index) {
      // Create the container div for the button group
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'pure-button-group';
      buttonGroup.setAttribute('role', 'group');
      buttonGroup.setAttribute('aria-label', 'Webhook actions');

      // Create the delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = `<i class="fa fa-light fa-trash-xmark"></i>`;
      deleteButton.className = 'pure-button';
      deleteButton.onclick = function () {
        handleDeleteClick(deleteButton, index);
      };

      // Create the test button
      const testButton = document.createElement('button');
      testButton.innerHTML = `<i class="fa fa-light fa-vial"></i>`;
      testButton.className = 'pure-button';
      testButton.onclick = function () {
        testWebhook(index, testButton);
      };

      // Create the edit button
      const editButton = document.createElement('button');
      editButton.innerHTML = `<i class="fa fa-light fa-pen"></i>`;
      editButton.className = 'pure-button';
      editButton.onclick = function () {
        editWebhook(index); // Implement this function to handle editing
      };

      // Append buttons to the button group
      buttonGroup.appendChild(testButton);
      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      const item = document.createElement('li');
      const rateLimitText = hook.rateLimit && hook.rateLimit > 0 ? ` (${hook.rateLimit}s limit)` : '';
      item.textContent = `${hook.name}: ${hook.url}${rateLimitText}`;

        // Append the button group to the list container
        item.appendChild(buttonGroup);
        list.appendChild(item);
      });
    }
  });
}

function handleDeleteClick(button, index) {
  if (button.textContent === 'Confirm?') {
    // If button already clicked once, perform the deletion
    deleteWebhook(index);
  } else {
    // First click, prompt for confirmation
    button.textContent = 'Confirm?';
    button.classList.add('button-warning');
    // Revert if clicked elsewhere
    document.addEventListener('click', function eventListener(e) {
      if (!button.contains(e.target)) {
        button.innerHTML = `<i class="fa fa-light fa-trash-xmark"></i>`;
        button.classList.remove('button-warning');
        document.removeEventListener('click', eventListener);
      }
    }, { once: true });
  }
}

function editWebhook(index) {
  chrome.storage.local.get('webhooks', function (data) {
    const webhooks = data.webhooks;
    const webhook = webhooks[index];
    document.getElementById('url').value = webhook.url;
    document.getElementById('name').value = webhook.name;
    document.getElementById('rateLimit').value = webhook.rateLimit || '';
    document.getElementById('webhookForm').dataset.index = index; // Store index for saving changes
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
    webhooks.splice(index, 1);
    chrome.storage.local.set({ webhooks: webhooks }, function () {
      if (chrome.runtime.lastError) {
        console.error('Failed to delete webhook:', chrome.runtime.lastError);
        showError('Error deleting webhook. Please try again.');
        return;
      }
      console.log('Webhook deleted!');
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
    buttonElement.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`;
    buttonElement.disabled = true;

    const startTime = Date.now();
    const testPayload = {
      url: 'https://example.com/test',
      title: 'Test webhook from Chrome Extension'
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
        buttonElement.innerHTML = `<i class="fa fa-check" style="color: green;"></i>`;
        showSuccess(`${webhook.name} test successful (${responseTime}ms)`);
        setTimeout(() => {
          buttonElement.innerHTML = originalContent;
        }, 3000);
      } else {
        buttonElement.innerHTML = `<i class="fa fa-times" style="color: red;"></i>`;
        showError(`${webhook.name} test failed: HTTP ${response.status} (${responseTime}ms)`);
        setTimeout(() => {
          buttonElement.innerHTML = originalContent;
        }, 3000);
      }
    }).catch(error => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Reset button
      buttonElement.innerHTML = `<i class="fa fa-times" style="color: red;"></i>`;
      buttonElement.disabled = false;

      showError(`${webhook.name} test error: ${error.message} (${responseTime}ms)`);
      setTimeout(() => {
        buttonElement.innerHTML = originalContent;
      }, 3000);
    });
  });
}

function showSuccess(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.background = '#51cf66';
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
      errorDiv.style.background = '#ff6b6b';
    }, 5000);
  }
}

function clearForm() {
  document.getElementById('url').value = '';
  document.getElementById('name').value = '';
  document.getElementById('rateLimit').value = '';
  delete document.getElementById('webhookForm').dataset.index; // Remove index from dataset
}

document.addEventListener('DOMContentLoaded', loadWebhooks);

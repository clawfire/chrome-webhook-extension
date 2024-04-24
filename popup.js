document.getElementById('webhookForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const name = document.getElementById('name').value;

  chrome.storage.local.get({ webhooks: [] }, function (data) {
    let webhooks = data.webhooks;
    const index = document.getElementById('webhookForm').dataset.index;
    if (index !== undefined) {
      // Update existing webhook
      webhooks[index] = { url, name };
    } else {
      // Add new webhook
      webhooks.push({ url, name });
    }
    chrome.storage.local.set({ webhooks: webhooks }, function () {
      console.log('Webhook saved!');
      loadWebhooks(); // Refresh list after saving
      clearForm(); // Clear the form fields
    });
  });
});

function loadWebhooks() {
  chrome.storage.local.get('webhooks', function (data) {
    const list = document.getElementById('webhookList');
    list.innerHTML = '';
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
        deleteWebhook(index); // Implement this function to handle deletion
      };

      // Create the edit button
      const editButton = document.createElement('button');
      editButton.innerHTML = `<i class="fa fa-light fa-pen"></i>`;
      editButton.className = 'pure-button';
      editButton.onclick = function () {
        editWebhook(index); // Implement this function to handle editing
      };

      // Append buttons to the button group
      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      const item = document.createElement('li');
      item.textContent = `${hook.name}: ${hook.url}`;

      // Append the button group to the list container
      item.appendChild(buttonGroup);
      list.appendChild(item);
    });
  });
}

function editWebhook(index) {
  chrome.storage.local.get('webhooks', function (data) {
    const webhooks = data.webhooks;
    const webhook = webhooks[index];
    document.getElementById('url').value = webhook.url;
    document.getElementById('name').value = webhook.name;
    document.getElementById('webhookForm').dataset.index = index; // Store index for saving changes
  });
}

function updateWebhook(index) {
  // This function is no longer needed because the main form's submit handler takes care of updating
}

function deleteWebhook(index) {
  chrome.storage.local.get('webhooks', function (data) {
    let webhooks = data.webhooks;
    webhooks.splice(index, 1);
    chrome.storage.local.set({ webhooks: webhooks }, function () {
      console.log('Webhook deleted!');
      loadWebhooks(); // Refresh list after deleting
    });
  });
}

function clearForm() {
  document.getElementById('url').value = '';
  document.getElementById('name').value = '';
  delete document.getElementById('webhookForm').dataset.index; // Remove index from dataset
}

document.addEventListener('DOMContentLoaded', loadWebhooks);

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
      const item = document.createElement('li');
      item.textContent = `${hook.name}: ${hook.url}`;
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = function () { editWebhook(index); };
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = function () { deleteWebhook(index); };
      item.appendChild(editBtn);
      item.appendChild(deleteBtn);
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

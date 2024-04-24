document.getElementById('webhookForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const name = document.getElementById('name').value;

  chrome.storage.local.get({webhooks: []}, function(data) {
    const webhooks = data.webhooks;
    webhooks.push({ url: url, name: name });
    chrome.storage.local.set({webhooks: webhooks}, function() {
      console.log('Webhook saved!');
      // Optionally, refresh the list on the popup
    });
  });
});

function loadWebhooks() {
  chrome.storage.local.get('webhooks', function(data) {
    const list = document.getElementById('webhookList');
    list.innerHTML = '';
    data.webhooks.forEach(function(hook) {
      const item = document.createElement('li');
      item.textContent = `${hook.name}: ${hook.url}`;
      list.appendChild(item);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadWebhooks);

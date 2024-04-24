chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToWebhook",
    title: "Send to Webhook",
    contexts: ["page", "link", "image"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error creating parent menu: ${chrome.runtime.lastError.message}`);
    }
    updateWebhookMenus();
  });
});

chrome.runtime.onStartup.addListener(() => {
  updateWebhookMenus();
});

function updateWebhookMenus() {
  // First remove all existing child items (if any)
  chrome.contextMenus.removeAll(() => {
    // Recreate parent menu to avoid reference errors
    chrome.contextMenus.create({
      id: "sendToWebhook",
      title: "Send to Webhook",
      contexts: ["page", "link", "image"]
    }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error(`Error recreating parent menu: ${chrome.runtime.lastError.message}`);
        return;
      }

      // Now add child items
      chrome.storage.local.get('webhooks', function (data) {
        if (data.webhooks && data.webhooks.length > 0) {
          data.webhooks.forEach(webhook => {
            chrome.contextMenus.create({
              id: `sendTo${webhook.name}`,
              parentId: "sendToWebhook",
              title: webhook.name,
              contexts: ["page", "link", "image"]
            });
          });
        }
      });
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("sendTo")) {
    chrome.storage.local.get('webhooks', function (data) {
      const webhook = data.webhooks.find(wh => `sendTo${wh.name}` === info.menuItemId);
      if (webhook) {
        sendToWebhook(webhook.url, info);
      }
    });
  }
});

function sendToWebhook(webhookUrl, info) {
  let urlToSend = info.pageUrl;
  if (info.linkUrl) {
    urlToSend = info.linkUrl;
  } else if (info.srcUrl) {
    urlToSend = info.srcUrl;
  }

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: urlToSend })
  }).then(response => {
    console.log('Webhook sent with response status:', response.status);
  }).catch(error => {
    console.error('Error sending webhook:', error);
  });
}


// Listen for changes in the webhooks data to update context menus
chrome.runtime.onStartup.addListener(updateWebhookMenus);
chrome.storage.onChanged.addListener(updateWebhookMenus);

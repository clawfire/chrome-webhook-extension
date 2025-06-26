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

function sanitizeMenuId(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
}

let updateWebhookMenusTimeout;
function updateWebhookMenus() {
  // Debounce to avoid excessive rebuilds
  clearTimeout(updateWebhookMenusTimeout);
  updateWebhookMenusTimeout = setTimeout(() => {
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
            data.webhooks.forEach((webhook, index) => {
              const sanitizedId = sanitizeMenuId(webhook.name);
              chrome.contextMenus.create({
                id: `sendTo_${sanitizedId}_${index}`,
                parentId: "sendToWebhook",
                title: webhook.name,
                contexts: ["page", "link", "image"]
              });
            });
          }
        });
      });
    });
  }, 100);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("sendTo_")) {
    chrome.storage.local.get('webhooks', function (data) {
      // Extract index from menu ID (sendTo_sanitizedName_index)
      const parts = info.menuItemId.split('_');
      const index = parseInt(parts[parts.length - 1]);
      const webhook = data.webhooks[index];
      if (webhook) {
        sendToWebhook(webhook.url, info, tab.id);
      }
    });
  }
});

function sendToWebhook(webhookUrl, info, tabId) {
  if (info.linkUrl) {
    extractDataAndSend(webhookUrl, info.linkUrl, 'link', tabId);
  } else if (info.srcUrl) {
    extractDataAndSend(webhookUrl, info.srcUrl, 'image', tabId);
  } else {
    extractDataAndSend(webhookUrl, info.pageUrl, 'page', tabId);
  }
}

function extractDataAndSend(webhookUrl, urlToSend, type, tabId) {
  let codeToExecute;

  if (type === 'page') {
    codeToExecute = function () {
      return document.title;
    };
  } else if (type === 'link') {
    codeToExecute = function () {
      const links = document.querySelectorAll('a');
      for (let link of links) {
        if (link.href === arguments[0]) {
          return link.title || null;
        }
      }
      return null;
    };
  } else if (type === 'image') {
    codeToExecute = function () {
      const images = document.querySelectorAll('img');
      for (let img of images) {
        if (img.src === arguments[0]) {
          return img.alt || null;
        }
      }
      return null;
    };
  }

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: codeToExecute,
    args: [urlToSend]
  }, (injectionResults) => {
    if (chrome.runtime.lastError) {
      console.error('Script injection failed:', chrome.runtime.lastError.message);
      return;
    }
    const titleToSend = injectionResults[0]?.result;
    
    // Find webhook name for notification
    chrome.storage.local.get('webhooks', function (data) {
      const webhook = data.webhooks?.find(wh => wh.url === webhookUrl);
      const webhookName = webhook ? webhook.name : 'Webhook';
      postToWebhook(webhookUrl, urlToSend, titleToSend, 3, webhookName);
    });
  });
}

function showNotification(title, message, isSuccess = true) {
  const iconPath = isSuccess ? 'images/icon48.png' : 'images/icon48.png';
  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconPath,
    title: title,
    message: message
  });
}

function postToWebhook(webhookUrl, url, title, retryCount = 3, webhookName = 'Webhook') {
  const payload = { url: url, title: title };
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(response => {
    if (!response.ok && retryCount > 0) {
      console.log(`Webhook failed with status ${response.status}, retrying... (${retryCount} attempts left)`);
      setTimeout(() => postToWebhook(webhookUrl, url, title, retryCount - 1, webhookName), 1000);
    } else if (response.ok) {
      console.log('Webhook sent with response status:', response.status);
      showNotification(`✅ ${webhookName} - Success`, `URL sent successfully to ${webhookName}`, true);
    } else {
      console.log('Webhook failed after all retries');
      showNotification(`❌ ${webhookName} - Failed`, `Failed to send URL after 3 attempts`, false);
    }
  }).catch(error => {
    console.error('Error sending webhook:', error);
    if (retryCount > 0) {
      console.log(`Retrying webhook in 2 seconds... (${retryCount} attempts left)`);
      setTimeout(() => postToWebhook(webhookUrl, url, title, retryCount - 1, webhookName), 2000);
    } else {
      showNotification(`❌ ${webhookName} - Error`, `Network error: ${error.message}`, false);
    }
  });
}

// Listen for changes in the webhooks data to update context menus
chrome.storage.onChanged.addListener(updateWebhookMenus);

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
      const link = document.querySelector(`a[href="${urlToSend}"]`);
      return link ? link.title : null;
    };
  } else if (type === 'image') {
    codeToExecute = function () {
      const img = document.querySelector(`img[src="${urlToSend}"]`);
      return img ? img.alt : null;
    };
  }

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: codeToExecute,
  }, (injectionResults) => {
    if (chrome.runtime.lastError) {
      console.error('Script injection failed:', chrome.runtime.lastError.message);
      return;
    }
    const titleToSend = injectionResults[0]?.result;
    postToWebhook(webhookUrl, urlToSend, titleToSend);
  });
}

function postToWebhook(webhookUrl, url, title) {
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url, title: title })
  }).then(response => {
    console.log('Webhook sent with response status:', response.status);
  }).catch(error => {
    console.error('Error sending webhook:', error);
  });
}

function getPageTitle() {
  return document.title;  // Returns the title of the current page
}

function getLinkTitle(linkUrl) {
  const link = document.querySelector(`a[href="${linkUrl}"]`);
  return link ? link.title : null;  // Returns the title attribute of the link if available
}

function getImageAlt(imageSrc) {
  const img = document.querySelector(`img[src="${imageSrc}"]`);
  return img ? img.alt : null;  // Returns the alt attribute of the image if available
}



// Listen for changes in the webhooks data to update context menus
chrome.runtime.onStartup.addListener(updateWebhookMenus);
chrome.storage.onChanged.addListener(updateWebhookMenus);

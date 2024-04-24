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
  let urlToSend = info.pageUrl;  // Default to page URL
  let titleToSend = null;

  if (info.linkUrl) {
    urlToSend = info.linkUrl;  // If it's a link, override the URL
    // Extract title attribute from the link
    chrome.scripting.executeScript({
      target: { tabId: info.tabId },
      function: getLinkTitle,
      args: [info.linkUrl]
    }, (injectionResults) => {
      titleToSend = (injectionResults && injectionResults[0]) ? injectionResults[0].result : null;
      postToWebhook(webhookUrl, urlToSend, titleToSend);
    });
  } else if (info.srcUrl) {
    urlToSend = info.srcUrl;  // If it's an image, override the URL
    // Extract alt attribute from the image
    chrome.scripting.executeScript({
      target: { tabId: info.tabId },
      function: getImageAlt,
      args: [info.srcUrl]
    }, (injectionResults) => {
      titleToSend = (injectionResults && injectionResults[0]) ? injectionResults[0].result : null;
      postToWebhook(webhookUrl, urlToSend, titleToSend);
    });
  } else {
    // Extract title of the page
    chrome.scripting.executeScript({
      target: { tabId: info.tabId },
      function: getPageTitle
    }, (injectionResults) => {
      titleToSend = (injectionResults && injectionResults[0]) ? injectionResults[0].result : null;
      postToWebhook(webhookUrl, urlToSend, titleToSend);
    });
  }
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

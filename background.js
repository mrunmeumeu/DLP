chrome.runtime.onInstalled.addListener(() => {
  // Check if the 'sensitiveWords' key exists in storage
  chrome.storage.local.get(['sensitiveWords'], (result) => {
      if (!result.sensitiveWords) {
          // Initialize with default sensitive words if not present
          const defaultWords = [  'comission', 'kickback'];
          chrome.storage.local.set({ sensitiveWords: defaultWords }, () => {
              console.log('Sensitive words initialized.');
          });
      }
  });
});
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'closeTab') {
        // Close the tab
        chrome.tabs.remove(sender.tab.id);
    }
});

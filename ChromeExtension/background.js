chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
	  files: ['dist/main.js']
  });
}, {hostEquals: 'docs.google.com'});


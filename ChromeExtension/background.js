function setLocals(tabId) {
	window.locals = {tabId: tabId};
}

chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    func: setLocals,
    args : [ details.tabId ],
  });
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
	  files: ['dist/main.js']
  });
}, {hostEquals: 'docs.google.com'});


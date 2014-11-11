'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

var initTab = function(details) {
	chrome.tabs.sendMessage(
		details.tabId,
		{
			type: 'init'
		}
	);
};

chrome.webNavigation.onCompleted.addListener(initTab);
chrome.webNavigation.onHistoryStateUpdated.addListener(initTab);

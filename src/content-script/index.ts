const script = document.createElement('script');
script.src = chrome.runtime.getURL('@/provider-script/provider.js');
(document.head || document.documentElement).appendChild(script);
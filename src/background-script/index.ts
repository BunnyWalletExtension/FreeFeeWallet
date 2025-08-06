chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request, sender);
    switch (request.method) {
        case 'requestAccounts': {
            sendResponse({ result: ['0xYourWalletAddress'] });
            break;
        }
        case 'sendTransaction': {
            chrome.runtime.sendMessage({
                type: 'SHOW_TRANSACTION',
                data: request.params[0],
            });
            sendResponse({ result: 'Transaction pending' });
            break;
        }
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    console.log('Tab created:', tab);
    chrome.action.openPopup();
});

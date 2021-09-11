function initStorage() {
    chrome.storage.local.get(null, function(result) {
        if (!result['src']) chrome.storage.local.set({'src': ""}, null);
    });
}

function popupQueries() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("hello: ", request);
        switch(request.data) {
            case 'save-img': {
                chrome.storage.local.set({'src': request.src}, null);
                
                sendResponse({
                    data: Profile.updateImage()
                });
            }
        }
    });
}

// Init
(async () => {
    initStorage();
    popupQueries();

    new Typeracer();
})();
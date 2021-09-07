document.addEventListener('onload', () => {
    initStorage();
    imageChange();
    popupQueries();
});

function initStorage() {
    chrome.storage.sync.get(null, function(result) {
        if (!result['src']) chrome.storage.sync.set({'src': ""}, null);
    });
}

function imageChange() {
    img = document.querySelector("#userInfo > div > div.profilePicContainer > img")
    chrome.storage.sync.get(null, function(result) {
        img.src = result['src'];
    });
}

function popupQueries() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log (request);
        switch(request.data) {
            case 'save-img': {
                chrome.storage.sync.set({'src': request.src}, null);
                imageChange();
            }
        }
    });
}
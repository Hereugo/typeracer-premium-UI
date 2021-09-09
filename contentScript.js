function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initStorage() {
    chrome.storage.sync.get(null, function(result) {
        if (!result['src']) chrome.storage.sync.set({'src': ""}, null);
    });
}

function addRemover() {
    let adContainers = document.querySelectorAll('.AdContainer');
    for (let i = 0; i < adContainers.length; i++) {
        let ad = adContainers[i];
        ad.remove();
    }
}

function imageChange() {
    let profile = document.querySelector("#userInfo > div > div.profilePicContainer");
    profile.innerHTML = "";
    chrome.storage.sync.get(null, function(result) {
        html = `
            <img
                style="
                    width: 107px;
                    height: 107px;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                " 
                src="${result['src']}" 
                alt="profile"/>
        `
        profile.insertAdjacentHTML('beforeend', html);
    });
    return 'success';
}

function popupQueries() {
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        console.log("hello: ", request);
        switch(request.data) {
            case 'save-img': {
                chrome.storage.sync.set({'src': request.src}, null);
                
                sendResponse({
                    data: await imageChange()
                });
            }
        }
    });
}

async function onSiteLoad(callback, tryCount = 0, maxTryCount = 20) {
    if (tryCount >= maxTryCount) return 'error';
    try {
        console.log("try function: ", callback);
        callback();
        return 'success';
    }
    catch(e) {
        await sleep(100);
        return await onSiteLoad(callback, tryCount + 1);
    }
}

// Create self activating function
(async () => {
    initStorage();
    popupQueries();
    await onSiteLoad(imageChange);
    await onSiteLoad(addRemover);
})();
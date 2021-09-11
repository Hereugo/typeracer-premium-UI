class Typeracer {
    constructor() {
        Typeracer.onSiteLoad(() => {
            Profile.init();
            ProfilePopup.init();

            Typeracer.adsRemover();
        })
    }

    static async onSiteLoad(callback, tryCount = 0, maxTryCount = 20) {
        if (tryCount > maxTryCount) return 'error';
        try {
            console.log("try function: ", callback);
            callback();
            return 'success';
        }
        catch(e) {
            await sleep(100);
            return await Typeracer.onSiteLoad(callback, tryCount + 1);
        }
    }

    static adsRemover() {
        let adContainers = document.querySelectorAll('.AdContainer');
        for (let i = 0; i < adContainers.length; i++) {
            let ad = adContainers[i];
            ad.remove();
        }
    }
}

class Profile {
    static init() {
        Profile.initImage(107, 107);
    }
    static initImage(width, height) {
        let img = Profile.getImage();
        let profile = img.parentNode
        profile.innerHTML = "";
        let html = `
            <img
                style="
                    width: ${width}px;
                    height: ${height}px;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                " 
                src="" 
                alt="profile"/>
        `
        profile.insertAdjacentHTML('beforeend', html);
        Profile.updateImage();
    }
    static getImage() {
        let selector = "#userInfo > div > div.profilePicContainer > img";
        let img = document.querySelector(selector);
        return img;
    }

    static updateImage() {
        let img = Profile.getImage();
        chrome.storage.local.get(null, function(result) {
            img.src = result['src'];
        });
        return 'success';
    }
}
class ProfilePopup extends Profile {
    static init() {
        ProfilePopup.initImage(150, 150);
    }
    static initImage(width, height) {
        var observer = new MutationObserver((record) => {
            try {
                console.log('mutation occruded!');

                if (!ProfilePopup.isOwner()) {
                    return 'not owner';
                }

                let imgContainer = ProfilePopup.getPopupImage();

                imgContainer.style.display = 'block';
                imgContainer.style.width = `${width}px`;
                imgContainer.style.height = `${height}px`;
    
                chrome.storage.local.get(null, function(result) {
                    imgContainer.src = result['src'];
                });
                return 'success';
            }
            catch(e) {
                return 'error';
            }
        });
        observer.observe(document.querySelector('body'), {
            childList: true
        });
    }
    static getPopupImage() {
        let selector = "body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > img";
        let img = document.querySelector(selector);
        return img;
    }
    static isOwner() {
        let selector1 = "body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > div > a:nth-child(3)"
        let selector2 = "body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > div > a:nth-child(2)"
        let link1 = document.querySelector(selector1);
        let link2 = document.querySelector(selector2);
        return (link1.style.display == 'none' && link2.style.display != 'none');
    }
}
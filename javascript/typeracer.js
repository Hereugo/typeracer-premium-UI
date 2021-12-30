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
        Profile.initImage();
    }
    static initImage() {
        let profile = Profile.getImage().parentNode
        
        profile.innerHTML = "";

        let html = `
            <div class="avatar-container">
                <div class="edit-button">Upload a photo</div> 
                <input type="file" style="display:none;" accept=".png,.jpeg,.jpg"/>
                <img src=""/>
            </div>`;
        profile.insertAdjacentHTML('beforeend', html);

        document.querySelector(".edit-button").addEventListener("click", () => {
            document.querySelector(".avatar-container input").click();
        }, false);
        document.querySelector(".avatar-container input").addEventListener("click", (_e) => {
            _e.target.value = "";
        }, false);
        document.querySelector(".avatar-container input").addEventListener("change", (_e) => {
            console.log(_e);
            if (_e.target.files) {
                document.querySelector('.box-main').style.visibility = 'visible';
                var reader = new FileReader();
                reader.onload = (e) => {
                    cropper.replace(e.target.result);
                };
                reader.readAsDataURL(_e.target.files[0]);
            }
        }, false);

        chrome.storage.local.get(null, function(result) {
            Profile.updateImage(result['src']);
        });
    }
    static getImage() {
        let selector = "#userInfo div div.profilePicContainer img";
        let img = document.querySelector(selector);
        return img;
    }
    static updateImage(src) {
        let img = Profile.getImage();
        img.src = src;
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
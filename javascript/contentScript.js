var profile, profilePopup, profilePitstop;
var editCard;

(async () => {
    let data = await getStorageData(null);
    await setStorageData({
        'src': data.src || chrome.runtime.getURL('images/avatar.png'),
    });

    editCard = new EditCard($('body'));
    
    onReady('body', '.userInfo .profilePicContainer', () => {
        console.log("ehh");

        profile = new Profile();
        profilePopup = new ProfilePopup();
        profilePitstop = new ProfilePitstop();


        $('.AdContainer').remove();
    });
})();
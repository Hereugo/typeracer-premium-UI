class Profile {
    constructor () {
        this.html = avatarHTML;
        this.container = $(".userInfo .profilePicContainer");
        
        this.injectHTML();

        this.profileImage = this.container.find('.avatar-container img');
        this.width = "45px";
        this.height = "45px";

        this.init();
    }

    injectHTML() {
        this.container.html('');
        this.container.append(this.html);
    }

    async init() {
        $('.edit-button').click(() => { $('.avatar-container input').click() });
        $('.avatar-container input').click((_e) => { _e.target.value = "" });
        $('.avatar-container input').change((_e) => {
            console.log(_e);
            if (_e.target.files) {
                editCard.show();
                
                var reader = new FileReader();
                reader.onload = (e) => {
                    editCard.cropper.replace(e.target.result);
                };
                reader.readAsDataURL(_e.target.files[0]);
            }
        });

        this.update();
    }

    async update() {
        const { src } = await getStorageData(['src']); 

        this.profileImage.attr('src', src);
    }

    getProfileName() {
        return $('.userInfo .userNameLabel')[0].innerText;
    }
}

class ProfilePopup {
    constructor() {
        this.width = "150px";
        this.height = "150px";


        this.setup();
    }

    setup() {
        var observer = new MutationObserver(this.open.bind(this));

        observer.observe($('body')[0], {
            childList: true,
        });
    }

    async open() {
        console.log("Popup opened");

        if (!this.isOwner()) return;
    
        let img = this.getImage();
        img.css({
            width: this.width,
            height: this.height,
            display: 'block',
        });

        const { src } = await getStorageData(['src']); 
        img.attr('src', src);
    }

    getImage() {
        return $("body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > img");
    }

    isOwner() {
        try {
            let chk1 = $("body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > div > a:nth-child(3)")[0];
            let chk2 = $("body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > div > a:nth-child(2)")[0];
            return (chk1.style.display == 'none' && chk2.style.display != 'none');
        }
        catch(_e) {
            return false;
        }
    }
}

class ProfilePitstop {
    constructor() {
        this.img = $(".user_profile_pic").filter(function (_index) {
            let title = $(this).attr('title');
            return title == profile.getProfileName() || title == "Your profile picture";
        });

        console.log(this.img);
        
        this.container = $(".picControls");
        this.html = pitstopHTML;

        this.injectHTML();

        this.init();
    }

    injectHTML() {
        var link = window.location.href;
        if (link == "https://data.typeracer.com/pit/edit_profile") {
            this.container.html('');
            this.container.append(this.html);
        }
    }

    async init() {
        await this.update();

        // Second way to update the profile pic
        try {
            $('.pitstop-container input').click((_e) => { _e.target.value = "" });
            $('.pitstop-container input').change((async (_e) => {
                console.log(_e);
                if (_e.target.files) {
                    editCard.show();
                    
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        editCard.cropper.replace(e.target.result);
                    };
                    reader.readAsDataURL(_e.target.files[0]);
                }
            }).bind(this));
        }
        catch(_e) {
            console.log(_e);
        }
    }

    async update() {
        const { src } = await getStorageData(['src']);
        this.img.attr('src', src);
    }
}


class EditCard {
    constructor($parent) {
        this.html = boxHTML;
        this.injectHTML($parent);

        this.img = $("#box-image");
        this.card = $('.box-main');

        this.cropper = new Cropper(this.img[0], {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1 / 1,
            restore: false,
            guides: false,
            center: false,
            highlight: false,
        });

        this.init();
    }

    hide() {
        this.card.css('visibility', 'hidden');
    }
    show() {
        this.card.css('visibility', 'visible');
    }

    injectHTML($parent) {
        $parent.append(this.html);
    }

    init() {
        $('.close-button').click(this.hide.bind(this));
        $('.set-button').click(this.save.bind(this));
    }

    async save() {
        const src = this.cropper.getCroppedCanvas().toDataURL();

        await setStorageData({ 'src': src });

        profile.update();
        profilePitstop.update();

        this.hide();
    }
}
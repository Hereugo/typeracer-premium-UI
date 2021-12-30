var cropper;

function initStorage() {
    chrome.storage.local.get(null, function(result) {
        if (!result['src']) chrome.storage.local.set({'src': chrome.runtime.getURL('images/avatar.png')}, null);
    });
}

function initBoxHTML() {
    var boxHTML = `
    <div class="box-main">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css" integrity="sha512-5ZQRy5L3cl4XTtZvjaJRucHRPKaKebtkvCWR/gbYdKH67km1e18C1huhdAc0wSnyMwZLiO7nEa534naJrH6R/Q==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <div class="box-container">
            <div class="box-header">
                <h4 class="box-title">Crop your new profile picture</h4>
                <button class="close-button">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
                        <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                    </svg>
                </button>
            </div>
            <div class="box-content">
                <div id="img-container">
                    <img id="box-image" src=""/>
                </div>
                <button class="set-button">Set new profile picture</button>
            </div>
        </div>            
    </div>`;

    document.body.insertAdjacentHTML('beforebegin', boxHTML);
    img = document.getElementById('box-image');
    cropper = new Cropper(img, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1 / 1,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
    });

    // add event listeners to the buttons
    document.querySelector('.close-button').addEventListener('click', function() {
        document.querySelector('.box-main').style.visibility = 'hidden';
    }, false);

    document.querySelector(".set-button").addEventListener("click", () => {
        const src = cropper.getCroppedCanvas().toDataURL();
    
        chrome.storage.local.set({'src': src}, null);
    
        Profile.updateImage(src);

        document.querySelector('.box-main').style.visibility = 'hidden';
    }, false);
}

// Init
(async () => {
    initStorage();
    
    initBoxHTML();
    
    new Typeracer();
})();
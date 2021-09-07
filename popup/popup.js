document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var img = document.querySelector('#messageImg');
            reader.onload = function(e) {
                img.onload = () => {
                    resizeImage()
                }
                img.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (!tabs[0].url.match(/https:\/\/play.typeracer.com\//)) return;

        document.querySelector("#submit").addEventListener('click', function() {
            let img = document.querySelector('#profileImg');
            chrome.tabs.sendMessage(tabs[0].id, {data: 'save-img', src: img.src});
            window.close();
        }, false);
	});
}, false);
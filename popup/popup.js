function validURI(uri) {
    return /data:image\/jpeg|png|jpg;base64/.test(uri);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var img = document.querySelector('#profileImg');
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        document.querySelector("#submit").addEventListener('click', function() {
            let img = document.querySelector('#profileImg');

            if (validURI(img.src)) {
                chrome.tabs.sendMessage(tabs[0].id, {data: 'save-img', src: img.src}, function(response) {
                    if (response != undefined && response.data == 'success') {
                        window.close();
                    } else {
                        alert('Error!');
                    }
                });
            } else {
                alert('Error!');
            }
        }, false);
	});

    document.querySelector("#cancel").addEventListener('click', function() {
        window.close();
    }, false);
}, false);
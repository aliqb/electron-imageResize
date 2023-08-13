const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

// Make sure file is an image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
}

function loadImage(event) {
    const file = event.target.files[0];
    console.log(file)
    if (!isFileImage(file)) {
        return
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            heightInput.value = img.height;
            widthInput.value = img.width
        };
    };

    reader.readAsDataURL(file);
    form.style.display = 'block';
    filename.innerHTML = img.files[0].name;
}

img.addEventListener('change', loadImage)
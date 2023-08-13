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
    if (!isFileImage(file)) {
        alertError('Please select an image');
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
    outputPath.innerText = path.join(os.homeDir(), 'imageresizer');
}

// Resize image
function resizeImage(e) {
    e.preventDefault();

    if (!img.files[0]) {
        alertError('Please upload an image');
        return;
    }

    if (widthInput.value === '' || heightInput.value === '') {
        alertError('Please enter a width and height');
        return;
    }

    // Electron adds a bunch of extra properties to the file object including the path
    const imgPath = img.files[0].path;
    const width = widthInput.value;
    const height = heightInput.value;

    ipcRenderer.send('image:resize', {
        imgPath,
        height,
        width,
    });
}

// When done, show message
ipcRenderer.on('image:done', () =>{
    alertSuccess(`Image resized to ${heightInput.value} x ${widthInput.value}`)
}
);

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center',
        },
    });
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center',
        },
    });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', resizeImage)
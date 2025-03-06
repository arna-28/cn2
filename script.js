document.addEventListener('DOMContentLoaded', function () {
    // Global Variables
    let isSubmitted = false;
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const codecObj = new Codec();

    // Modify the Submit Button Logic
    const submitButton = document.getElementById('submitbtn');
    if (submitButton) {
        submitButton.onclick = function () {
            const uploadedFile = document.getElementById('uploadfile').files[0];
            if (uploadedFile === undefined) {
                alert("No file uploaded.\nPlease upload a valid file and try again!");
                return;
            }

            const extension = uploadedFile.name.split('.').pop().toLowerCase();
            if (extension === 'txt' || extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                alert("File submitted!");
                isSubmitted = true;
                onclickChanges("Done!! File uploaded!", step1);
                if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                    document.getElementById("imageCompressionOptions").style.display = "block";
                } else {
                    document.getElementById("imageCompressionOptions").style.display = "none";
                }
            } else {
                alert("Invalid file type (." + extension + ") \nPlease upload a valid .txt, .jpg, .jpeg, or .png file and try again!");
            }
        };
    }

    const qualitySlider = document.getElementById('qualitySlider');
    if (qualitySlider) {
        qualitySlider.oninput = function () {
            const qualityValue = document.getElementById('qualityValue');
            if (qualityValue) {
                qualityValue.innerText = this.value;
            }
        };
    }

    // Modify the Encode Button Logic
    const encodeButton = document.getElementById('encode');
    if (encodeButton) {
        encodeButton.onclick = function () {
            const uploadedFile = document.getElementById('uploadfile');
            if (!uploadedFile) {
                alert("File upload element not found. Please refresh the page.");
                return;
            }
            
            const file = uploadedFile.files[0];
            if (!file) {
                alert("No file uploaded.\nPlease upload a file and try again!");
                return;
            }
            
            if (isSubmitted === false) {
                alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
                return;
            }

            const extension = file.name.split('.').pop().toLowerCase();
            if (extension === 'txt') {
                onclickChanges("Done!! Your file will be Compressed", step2);
                onclickChanges2("Compressing your file ...", "Compressed");
                const fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    const text = fileLoadedEvent.target.result;
                    const [encodedString, outputMsg] = codecObj.encode(text);
                    myDownloadFile(file.name.split('.')[0] + "_compressed.txt", encodedString);
                    ondownloadChanges(outputMsg);
                };
                fileReader.readAsText(file, "UTF-8");
            } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                onclickChanges("Done!! Your image will be Compressed", step2);
                onclickChanges2("Compressing your image ...", "Compressed");
                const quality = parseFloat(document.getElementById('qualitySlider')?.value || 0.8);
                const fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    const img = new Image();
                    img.src = fileLoadedEvent.target.result;
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.name.split('.')[0] + "_compressed." + extension;
                            a.click();
                            URL.revokeObjectURL(url);
                            ondownloadChanges("Compression complete and image downloading....");
                        }, 'image/jpeg', quality);
                    };
                };
                fileReader.readAsDataURL(file);
            } else {
                alert("Invalid file type for compression.\nPlease upload a valid .txt, .jpg, .jpeg, or .png file and try again!");
            }
        };
    }

    // Modify the Decode Button Logic
    const decodeButton = document.getElementById('decode');
    if (decodeButton) {
        decodeButton.onclick = function () {
            console.log("Decode function called");

            const uploadFileElement = document.getElementById('uploadfile');
            if (!uploadFileElement) {
                console.error("Error: uploadfile element not found!");
                alert("Critical Error: File upload element is missing. Please refresh the page.");
                return;
            }

            const file = uploadFileElement.files[0];
            if (!file) {
                alert("No file uploaded.\nPlease upload a file and try again!");
                return;
            }

            if (isSubmitted === false) {
                alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
                return;
            }

            onclickChanges("Decompressing...", step2);
            const extension = file.name.split('.').pop().toLowerCase();

            if (extension === 'txt') {
                onclickChanges("Done!! Your file will be De-Compressed", step2);
                onclickChanges2("De-Compressing your file ...", "De-Compressed");
                const fileReader = new FileReader();

                fileReader.onload = function (fileLoadedEvent) {
                    const text = fileLoadedEvent.target.result;
                    try {
                        const [decodedString, outputMsg] = codecObj.decode(text);
                        myDownloadFile(file.name.split('.')[0] + "_decompressed.txt", decodedString);
                        ondownloadChanges(outputMsg);
                    } catch (error) {
                        console.error("Decompression error:", error);
                        alert("Error during decompression. The file may be corrupted or not in the expected format.");
                        onclickChanges("Decompression failed", step2);
                    }
                };
                fileReader.readAsText(file, "UTF-8");
            } else {
                alert("Decoding is only supported for .txt files at this time.");
            }
        };
    }
    console.log("Event handlers attached");
});

/// Function for the Steps
function onclickChanges(message, step) {
    if (step) {
        step.innerHTML = "<br>" + message + "<br>";
    }
}

/// Function for the Output messages
function ondownloadChanges(message) {
    const text4Element = document.getElementById("text4");
    if (text4Element) {
        text4Element.innerHTML = "<br>" + message + "<br>" + "<button type=\"button\" class=\"btn btn-success\" onclick=\"location.reload()\">Click Here</button> to Start Again!";
    }
}

function onclickChanges2(message, type) {
    const headingElement = document.getElementById("heading");
    if (headingElement) {
        headingElement.innerHTML = message;
        headingElement.style.color = "Green";
        headingElement.style.fontSize = "50px";
    }
}

/// Download File Function
function myDownloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

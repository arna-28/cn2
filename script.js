// Debug logs at the start
console.log("Initializing script...");

// Utility Functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Min Heap Implementation
class MinHeap {
    constructor() {
        this.heap_array = [];
    }

    size() {
        return this.heap_array.length;
    }

    empty() {
        return this.size() === 0;
    }

    push(value) {
        this.heap_array.push(value);
        this.up_heapify();
    }

    up_heapify() {
        let current_index = this.size() - 1;
        while (current_index > 0) {
            let current_element = this.heap_array[current_index];
            let parent_index = Math.trunc((current_index - 1) / 2);
            let parent_element = this.heap_array[parent_index];

            if (parent_element[0] < current_element[0]) {
                break;
            } else {
                this.heap_array[parent_index] = current_element;
                this.heap_array[current_index] = parent_element;
                current_index = parent_index;
            }
        }
    }

    top() {
        return this.heap_array[0];
    }

    pop() {
        if (!this.empty()) {
            let last_index = this.size() - 1;
            this.heap_array[0] = this.heap_array[last_index];
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    down_heapify() {
        let current_index = 0;
        let current_element = this.heap_array[0];
        while (current_index < this.size()) {
            let child_index1 = (current_index * 2) + 1;
            let child_index2 = (current_index * 2) + 2;
            if (child_index1 >= this.size() && child_index2 >= this.size()) {
                break;
            } else if (child_index2 >= this.size()) {
                let child_element1 = this.heap_array[child_index1];
                if (current_element[0] < child_element1[0]) {
                    break;
                } else {
                    this.heap_array[child_index1] = current_element;
                    this.heap_array[current_index] = child_element1;
                    current_index = child_index1;
                }
            } else {
                let child_element1 = this.heap_array[child_index1];
                let child_element2 = this.heap_array[child_index2];
                if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
                    break;
                } else {
                    if (child_element1[0] < child_element2[0]) {
                        this.heap_array[child_index1] = current_element;
                        this.heap_array[current_index] = child_element1;
                        current_index = child_index1;
                    } else {
                        this.heap_array[child_index2] = current_element;
                        this.heap_array[current_index] = child_element2;
                        current_index = child_index2;
                    }
                }
            }
        }
    }
}

// Coder Decoder Class
class Codec {
    constructor() {
        this.codes = {};
    }

    getCodes(node, curr_code) {
        if (typeof node[1] === "string") {
            this.codes[node[1]] = curr_code;
            return;
        }
        this.getCodes(node[1][0], curr_code + '0');
        this.getCodes(node[1][1], curr_code + '1');
    }

    make_string(node) {
        if (typeof node[1] === "string") {
            return "'" + node[1];
        }
        return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
    }

    make_tree(tree_string) {
        let node = [];
        if (tree_string[this.index] === "'") {
            this.index++;
            node.push(tree_string[this.index]);
            this.index++;
            return node;
        }
        this.index++;
        node.push(this.make_tree(tree_string));
        this.index++;
        node.push(this.make_tree(tree_string));
        return node;
    }

    rleEncode(data) {
        let encodedString = "";
        let count = 1;

        for (let i = 0; i < data.length; i++) {
            if (i + 1 < data.length && data[i] === data[i + 1]) {
                count++;
            } else {
                encodedString += data[i] + (count > 1 ? count.toString() : "");
                count = 1;
            }
        }
        return encodedString;
    }

    rleDecode(data) {
        let decodedString = "";
        let i = 0;

        while (i < data.length) {
            let char = data[i];
            i++;
            let count = "";
            while (i < data.length && !isNaN(parseInt(data[i]))) {
                count += data[i];
                i++;
            }

            let repeatCount = count === "" ? 1 : parseInt(count);
            for (let j = 0; j < repeatCount; j++) {
                decodedString += char;
            }
        }
        return decodedString;
    }

    encode(data) {
        const rleEncodedData = this.rleEncode(data);
        this.heap = new MinHeap();
        let mp = new Map();

        for (let i = 0; i < rleEncodedData.length; i++) {
            if (mp.has(rleEncodedData[i])) {
                mp.set(rleEncodedData[i], mp.get(rleEncodedData[i]) + 1);
            } else {
                mp.set(rleEncodedData[i], 1);
            }
        }

        if (mp.size === 0) {
            let final_string = "zer#";
            let output_message = "Compression complete and file downloading...." + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }

        if (mp.size === 1) {
            let key, value;
            for (let [k, v] of mp) {
                key = k;
                value = v;
            }
            let final_string = "one" + '#' + key + '#' + value.toString();
            let output_message = "Compression complete and file downloading...." + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }

        for (let [key, value] of mp) {
            this.heap.push([value, key]);
        }

        while (this.heap.size() >= 2) {
            let min_node1 = this.heap.top();
            this.heap.pop();
            let min_node2 = this.heap.top();
            this.heap.pop();
            this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
        }

        let huffman_tree = this.heap.top();
        this.heap.pop();
        this.codes = {};
        this.getCodes(huffman_tree, "");

        let binary_string = "";
        for (let i = 0; i < rleEncodedData.length; i++) {
            binary_string += this.codes[rleEncodedData[i]];
        }

        let padding_length = (8 - (binary_string.length % 8)) % 8;
        for (let i = 0; i < padding_length; i++) {
            binary_string += '0';
        }

        let encoded_data = "";
        for (let i = 0; i < binary_string.length;) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - '0';
            }
            encoded_data += String.fromCharCode(curr_num);
        }

        let tree_string = this.make_string(huffman_tree);
        let ts_length = tree_string.length;
        let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
        let output_message = "Compression complete and file downloading...." + '\n' + "Compression Ratio : " + (data.length/final_string.length);
        return [final_string, output_message];
    }

    decode(data) {
        let k = 0;
        let temp = "";
        while (data[k] != '#') {
            temp += data[k];
            k++;
        }

        if (temp === "zer") {
            let decoded_data = "";
            let output_message = "Decompression complete and file downloading....";
            return [decoded_data, output_message];
        }

        if (temp === "one") {
            data = data.slice(k + 1);
            k = 0;
            temp = "";
            while (data[k] != '#') {
                temp += data[k];
                k++;
            }
            let one_char = temp;
            data = data.slice(k + 1);
            let str_len = parseInt(data);
            let decoded_data = "";
            for (let i = 0; i < str_len; i++) {
                decoded_data += one_char;
            }
            let output_message = "Decompression complete and file downloading....";
            return [decoded_data, output_message];
        }

        data = data.slice(k + 1);
        let ts_length = parseInt(temp);
        k = 0;
        temp = "";
        while (data[k] != '#') {
            temp += data[k];
            k++;
        }
        data = data.slice(k + 1);
        let padding_length = parseInt(temp);
        temp = "";
        for (k = 0; k < ts_length; k++) {
            temp += data[k];
        }
        data = data.slice(k);
        let tree_string = temp;
        temp = "";
        for (k = 0; k < data.length; k++) {
            temp += data[k];
        }
        let encoded_data = temp;
        this.index = 0;
        let huffman_tree = this.make_tree(tree_string);
        let binary_string = "";
        for (let i = 0; i < encoded_data.length; i++) {
            let curr_num = encoded_data.charCodeAt(i);
            let curr_binary = "";
            for (let j = 7; j >= 0; j--) {
                let foo = curr_num >> j;
                curr_binary = curr_binary + (foo & 1);
            }
            binary_string += curr_binary;
        }

        binary_string = binary_string.slice(0, -padding_length);

        let decoded_data = "";
        let node = huffman_tree;
        for (let i = 0; i < binary_string.length; i++) {
            if (binary_string[i] === '1') {
                node = node[1];
            } else {
                node = node[0];
            }

            if (typeof node[0] === "string") {
                decoded_data += node[0];
                node = huffman_tree;
            }
        }

        const rleDecodedData = this.rleDecode(decoded_data);
        let output_message = "Decompression complete and file downloading....";
        return [rleDecodedData, output_message];
    }
}

// Global Variables
let currentImageFile = null;
let previewTimeout = null;

// UI Helper Functions
function onclickChanges(firstMsg, step) {
    if (!step) return;
    step.innerHTML = "";
    let img = document.createElement("img");
    img.src = "done_icon3.png";
    img.id = "doneImg";
    step.appendChild(img);
    
    let br = document.createElement("br");
    step.appendChild(br);
    
    let msg = document.createElement("span");
    msg.className = "text2";
    msg.innerHTML = firstMsg;
    step.appendChild(msg);
}

function onclickChanges2(secMsg, word, step3) {
    const encodeBtn = document.getElementById('encode');
    const decodeBtn = document.getElementById('decode');
    
    if (encodeBtn) encodeBtn.disabled = true;
    if (decodeBtn) decodeBtn.disabled = true;
    
    if (step3) {
        step3.innerHTML = "";
        let msg2 = document.createElement("span");
        msg2.className = "text2";
        msg2.innerHTML = secMsg;
        step3.appendChild(msg2);
        
        let msg3 = document.createElement("span");
        msg3.className = "text2";
        msg3.innerHTML = " , " + word + " file will be downloaded automatically!";
        step3.appendChild(msg3);
    }
}

function myDownloadFile(fileName, text) {
    let a = document.createElement('a');
    a.href = "data:application/octet-stream," + encodeURIComponent(text);
    a.download = fileName;
    a.click();
}

function ondownloadChanges(outputMsg, step3) {
    if (!step3) return;
    step3.innerHTML = "";
    let img = document.createElement("img");
    img.src = "done_icon3.png";
    img.id = "doneImg";
    step3.appendChild(img);
    
    let br = document.createElement("br");
    step3.appendChild(br);
    
    let msg3 = document.createElement("span");
    msg3.className = "text2";
    msg3.innerHTML = outputMsg;
    step3.appendChild(msg3);
}

// Image Preview Functions
function updateLivePreview(file, quality) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Improve image rendering quality
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(blob => {
                const previewUrl = URL.createObjectURL(blob);
                const compressedPreview = document.getElementById('compressedPreview');
                
                // Clean up previous URL
                if (compressedPreview.src.startsWith('blob:')) {
                    URL.revokeObjectURL(compressedPreview.src);
                }
                
                compressedPreview.src = previewUrl;
                compressedPreview.onload = function() {
                    URL.revokeObjectURL(previewUrl);
                };
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// File Handlers
function handleTextCompression(file, step2, step3, codecObj) {
    if (!step2 || !step3) return;
    
    onclickChanges("Done!! Your file will be Compressed", step2);
    onclickChanges2("Compressing your file...", "Compressed", step3);
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const text = e.target.result;
            const [encodedString, outputMsg] = codecObj.encode(text);
            myDownloadFile(file.name.split('.')[0] + "_compressed.txt", encodedString);
            ondownloadChanges(outputMsg, step3);
        } catch (error) {
            console.error("Compression error:", error);
            ondownloadChanges("Compression failed: " + error.message, step3);
        }
    };
    fileReader.onerror = () => ondownloadChanges("Error reading file", step3);
    fileReader.readAsText(file, "UTF-8");
}

function handleImageCompression(file, extension, step2, step3) {
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    
    if (!qualitySlider || !qualityValue || !step2 || !step3) {
        alert("System error: Missing components");
        return;
    }

    const quality = parseFloat(qualitySlider.value);
    qualityValue.textContent = quality.toFixed(1);

    onclickChanges("Done!! Your image will be Compressed", step2);
    onclickChanges2("Compressing your image...", "Compressed", step3);
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);
            
            const originalSize = file.size;
            
            canvas.toBlob(function(blob) {
                if (!blob) {
                    throw new Error("Compression failed - no blob created");
                }
                
                const compressedSize = blob.size;
                const ratio = (compressedSize / originalSize).toFixed(2);
                const percentReduction = ((1 - ratio) * 100).toFixed(1);
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.split('.')[0]}_compressed.${extension}`;
                a.click();
                
                ondownloadChanges(
                    `Compression complete!<br>
                     Original: ${formatBytes(originalSize)}<br>
                     Compressed: ${formatBytes(compressedSize)}<br>
                     Ratio: ${ratio}x (${percentReduction}% smaller)`,
                    step3
                );
                
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }, `image/${extension === 'jpg' ? 'jpeg' : extension}`, quality);
        };
        img.onerror = () => ondownloadChanges("Error loading image", step3);
        img.src = e.target.result;
    };
    fileReader.onerror = () => ondownloadChanges("Error reading image file", step3);
    fileReader.readAsDataURL(file);
}

function handleTextDecompression(file, step2, step3, codecObj) {
    if (!step2 || !step3) return;
    
    onclickChanges("Done!! Your file will be Decompressed", step2);
    onclickChanges2("Decompressing your file...", "Decompressed", step3);
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const text = e.target.result;
            const [decodedString, outputMsg] = codecObj.decode(text);
            myDownloadFile(file.name.split('.')[0] + "_decompressed.txt", decodedString);
            ondownloadChanges(outputMsg, step3);
        } catch (error) {
            console.error("Decompression error:", error);
            ondownloadChanges("Decompression failed: " + error.message, step3);
        }
    };
    fileReader.onerror = () => ondownloadChanges("Error reading file", step3);
    fileReader.readAsText(file, "UTF-8");
}

// Main Initialization
function initializeApp() {
    console.log("Initializing application...");
    
    // Cache DOM elements
    const fileInput = document.getElementById('uploadfile');
    const encodeBtn = document.getElementById('encode');
    const decodeBtn = document.getElementById('decode');
    const submitBtn = document.getElementById('submitbtn');
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const imageOptions = document.getElementById('imageCompressionOptions');
    
    // Verify critical elements
    if (!fileInput || !encodeBtn || !decodeBtn || !submitBtn || !step1 || !step2 || !step3) {
        console.error("Missing critical elements");
        alert("System error: UI failed to load. Please refresh.");
        return;
    }

    let isSubmitted = false;
    const codecObj = new Codec();

    // Submit Button
    submitBtn.addEventListener('click', function() {
        if (!fileInput.files?.[0]) {
            alert("Please select a file first!");
            return;
        }

        currentImageFile = fileInput.files[0];
        const extension = currentImageFile.name.split('.').pop().toLowerCase();
        
        if (['txt', 'jpg', 'jpeg', 'png'].includes(extension)) {
            isSubmitted = true;
            onclickChanges("Done!! File uploaded!", step1);
            
            // Show/hide quality controls based on file type
            if (imageOptions) {
                imageOptions.style.display = ['jpg', 'jpeg', 'png'].includes(extension) 
                    ? 'block' 
                    : 'none';
            }
            
            // Show original image preview for images
            if (['jpg', 'jpeg', 'png'].includes(extension)) {
                const originalPreview = document.getElementById('originalPreview');
                if (originalPreview) {
                    originalPreview.src = URL.createObjectURL(currentImageFile);
                }
            }
        } else {
            alert(`Invalid file type (.${extension}). Please upload a valid file.`);
        }
    });

    // Quality Slider with Debounce
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', function() {
            qualityValue.textContent = this.value;
            
            // Debounced preview update
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(() => {
                if (currentImageFile && ['jpg', 'jpeg', 'png'].includes(currentImageFile.name.split('.').pop().toLowerCase())) {
                    updateLivePreview(currentImageFile, parseFloat(this.value));
                }
            }, 200);
        });
    }

    // Encode Button
    encodeBtn.addEventListener('click', function() {
        if (!isSubmitted) {
            alert("Please submit a file first!");
            return;
        }

        const uploadedFile = fileInput.files[0];
        if (!uploadedFile) {
            alert("Please select a file first!");
            return;
        }

        const extension = uploadedFile.name.split('.').pop().toLowerCase();
        
        if (extension === 'txt') {
            handleTextCompression(uploadedFile, step2, step3, codecObj);
        } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
            handleImageCompression(uploadedFile, extension, step2, step3);
        } else {
            alert("Invalid file type for compression");
        }
    });

    // Decode Button
    decodeBtn.addEventListener('click', function() {
        if (!isSubmitted) {
            alert("Please submit a file first!");
            return;
        }

        const uploadedFile = fileInput.files[0];
        if (!uploadedFile) {
            alert("Please select a file first!");
            return;
        }

        const extension = uploadedFile.name.split('.').pop().toLowerCase();
        
        if (extension === 'txt') {
            handleTextDecompression(uploadedFile, step2, step3, codecObj);
        } else {
            alert("Decompression is only supported for .txt files");
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    initializeApp();
});

// Fallback initialization
setTimeout(function() {
    if (!document.getElementById('uploadfile')) {
        console.warn("Fallback initialization");
        initializeApp();
    }
}, 1000);

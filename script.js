// Min Heap Implementation
class MinHeap {
    constructor() {
        this.heap_array = [];
    }

    /// Returns size of the min heap
    size() {
        return this.heap_array.length;
    }

    /// Returns if the heap is empty
    empty() {
        return this.size() === 0;
    }

    /// Insert a new value in the heap
    push(value) {
        this.heap_array.push(value);
        this.up_heapify();
    }

    /// Updates heap by up heapifying
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

    /// Returns the top element (smallest value element)
    top() {
        return this.heap_array[0];
    }

    /// Delete the top element
    pop() {
        if (!this.empty()) {
            let last_index = this.size() - 1;
            this.heap_array[0] = this.heap_array[last_index];
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    /// Updates heap by down heapifying
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

/// Coder Decoder Class
class Codec {
    constructor() {
        this.codes = {};
    }

    /// DFS to generate codes
    getCodes(node, curr_code) {
        if (typeof node[1] === "string") {
            this.codes[node[1]] = curr_code;
            return;
        }
        this.getCodes(node[1][0], curr_code + '0');
        this.getCodes(node[1][1], curr_code + '1');
    }

    /// Make the Huffman tree into a string
    make_string(node) {
        if (typeof node[1] === "string") {
            return "'" + node[1];
        }
        return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
    }

    /// Make string into Huffman tree
    make_tree(tree_string) {
        let node = [];
        if (tree_string[this.index] === "'") {
            this.index++;
            node.push(tree_string[this.index]);
            this.index++;
            return node;
        }
        this.index++;
        node.push(this.make_tree(tree_string)); // Left child
        this.index++;
        node.push(this.make_tree(tree_string)); // Right child
        return node;
    }

    /// RLE Encode Function
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

    /// RLE Decode Function
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

    /// Encoder function (Huffman with RLE)
    encode(data) {
        // Apply RLE first
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
        let output_message = "Compression complete and file downloading...." + '\n' + "Compression Ratio : " + (data.length / final_string.length);
        return [final_string, output_message];
    }

    /// Decoder function (Huffman with RLE)
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

        // Apply RLE decoding as the final step
        const rleDecodedData = this.rleDecode(decoded_data);

        let output_message = "Decompression complete and file downloading....";
        return [rleDecodedData, output_message];
    }
}

/// Onload Function
document.addEventListener('DOMContentLoaded', function () {
    // Global Variables
    let isSubmitted = false;
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const codecObj = new Codec();

    // Modify the Submit Button Logic
    document.getElementById('submitbtn').onclick = function () {
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

    document.getElementById('qualitySlider').oninput = function () {
        document.getElementById('qualityValue').innerText = document.getElementById('qualitySlider').value;
    };

    // Modify the Encode Button Logic
    document.getElementById('encode').onclick = function () {
        const uploadedFile = document.getElementById('uploadfile').files[0];
        if (uploadedFile === undefined) {
            alert("No file uploaded.\nPlease upload a file and try again!");
            return;
        }
        if (isSubmitted === false) {
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }

        const extension = uploadedFile.name.split('.').pop().toLowerCase();
        if (extension === 'txt') {
            onclickChanges("Done!! Your file will be Compressed", step2);
            onclickChanges2("Compressing your file ...", "Compressed");
            const fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                const text = fileLoadedEvent.target.result;
                const [encodedString, outputMsg] = codecObj.encode(text);
                myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);
                ondownloadChanges(outputMsg);
            };
            fileReader.readAsText(uploadedFile, "UTF-8");
        } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
            onclickChanges("Done!! Your image will be Compressed", step2);
            onclickChanges2("Compressing your image ...", "Compressed");
            const quality = parseFloat(document.getElementById('qualitySlider').value);
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
                        a.download = uploadedFile.name.split('.')[0] + "_compressed." + extension;
                        a.click();
                        URL.revokeObjectURL(url);
                        ondownloadChanges("Compression complete and image downloading....");
                    }, 'image/jpeg', quality);
                };
            };
            fileReader.readAsDataURL(uploadedFile);
        } else {
            alert("Invalid file type for compression.\nPlease upload a valid .txt, .jpg, .jpeg, or .png file and try again!");
        }
    };

    // Modify the Decode Button Logic
 document.getElementById('decode').onclick = function () {
        debugger; // Add breakpoint at the beginning
        console.log("Decode function called");

        const uploadFileElement = document.getElementById('uploadfile');

        if (!uploadFileElement) {
            console.error("Error: uploadfile element not found!");
            alert("Critical Error: File upload element is missing. Please refresh the page.");
            return;
        }

        const uploadedFile = uploadFileElement.files[0];

        if (uploadedFile === undefined) {
            alert("No file uploaded.\nPlease upload a file and try again!");
            return;
        }

        if (isSubmitted === false) {
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }

        onclickChanges("Decompressing...", step2);
        const extension = uploadedFile.name.split('.').pop().toLowerCase();

        if (extension === 'txt') {
            onclickChanges("Done!! Your file will be De-Compressed", step2);
            onclickChanges2("De-Compressing your file ...", "De-Compressed");
            const fileReader = new FileReader();

            fileReader.onload = function (fileLoadedEvent) {
                const text = fileLoadedEvent.target.result;
                const [decodedString, outputMsg] = codecObj.decode(text);
                myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
                ondownloadChanges(outputMsg);
            };
            fileReader.readAsText(uploadedFile, "UTF-8");

        } else {
            alert("Decoding is only supported for .txt files at this time.");
        }
    };

console.log("Decode button onclick handler attached"); //Log after attachment


/// Function for the Steps
function onclickChanges(message, step) {
    step.innerHTML = "<br>" + message + "<br>";
}

/// Function for the Output messages
function ondownloadChanges(message) {
    document.getElementById("text4").innerHTML = "<br>" + message + "<br>" + "<button type=\"button\" class=\"btn btn-success\" onclick=\"location.reload()\">Click Here</button> to Start Again!";
}

function onclickChanges2(message, type) {
    document.getElementById("heading").innerHTML = message;
    document.getElementById("heading").style.color = "Green";
    document.getElementById("heading").style.fontSize = "50px";
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

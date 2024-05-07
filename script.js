const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = '#000000';
let brushSize = 5;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function useBrush() {
    canvas.removeEventListener('click', fillBucket);
    canvas.addEventListener('mousemove', draw);
}

function useBucket() {
    canvas.removeEventListener('mousemove', draw);
    canvas.addEventListener('click', fillBucket);
}

function fillBucket() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stack = [[lastX, lastY]];
    const targetColor = getPixelColor(imageData, lastX, lastY);

    while (stack.length) {
        const [x, y] = stack.pop();
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height && getPixelColor(imageData, x, y) === targetColor) {
            setPixelColor(imageData, x, y, color);
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return `rgb(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]})`;
}

function setPixelColor(imageData, x, y, fillColor) {
    const index = (y * imageData.width + x) * 4;
    const [r, g, b] = hexToRgb(fillColor);
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function exportImage() {
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = 'my_drawing.png';
    a.click();
}

// Update color and brush size
document.getElementById('colorPicker').addEventListener('change', (e) => {
    color = e.target.value;
});

document.getElementById('brushSize').addEventListener('change', (e) => {
    brushSize = parseInt(e.target.value);
});

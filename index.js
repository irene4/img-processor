var ctx = document.getElementById('canvas1').getContext('2d');

var imgW = 0;
var imgH = 0;
var originalImg = [];

document.getElementById('upload').onchange = function (e) {
	var img = new Image();
	img.onload = draw;
	img.onerror = fail;
	img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
	var canvas = document.getElementById('canvas1');
	canvas.width = this.width;
	canvas.height = this.height;
	imgW = this.width;
	imgH = this.height;
	ctx.drawImage(this, 0, 0);
	originalImg = ctx.getImageData(0, 0, imgW, imgH);
}
function fail() {
	console.error('Error');
}
function restore() {
	ctx.putImageData(originalImg, 0, 0);
}
function invert() {
	var imgd = ctx.getImageData(0, 0, imgW, imgH);
	var pix = imgd.data;

	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i] = 255 - pix[i]; // r
		pix[i + 1] = 255 - pix[i + 1]; // g
		pix[i + 2] = 255 - pix[i + 2]; // b
		// i+3 is alpha
	}
	ctx.putImageData(imgd, 0, 0);
}

/* Formula: 𝑓(𝑥)=𝛼(𝑥−128)+128+𝑏
𝛼: contrast, 𝑏: brightness */
function contrast(alpha) {
	var imgd = ctx.getImageData(0, 0, imgW, imgH);
	var pix = imgd.data;

	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i] = alpha * pix[i]; //r
		pix[i + 1] = alpha * pix[i + 1]; //g
		pix[i + 2] = alpha * pix[i + 2]; //b
	}
	ctx.putImageData(imgd, 0, 0);
}
function brightness(beta) {
	var imgd = ctx.getImageData(0, 0, imgW, imgH);
	var pix = imgd.data;

	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i] = pix[i] + beta; //r
		pix[i + 1] = pix[i + 1] + beta; //g
		pix[i + 2] = pix[i + 2] + beta; //b
	}
	ctx.putImageData(imgd, 0, 0);
}
function saturation(sat) {
	//100% is original saturation
	var imgd = ctx.getImageData(0, 0, imgW, imgH);
	var pix = imgd.data;

	for (var i = 0, n = pix.length; i < n; i += 4) {
		const r = pix[i],
			g = pix[i + 1],
			b = pix[i + 2];

		const ry1 = (70 * r - 59 * g - 11 * b) / 100;
		const by1 = (-30 * r - 59 * g + 89 * b) / 100;
		const gy1 = (-30 * r + 41 * g - 11 * b) / 100;

		const y = (30 * r + 59 * g + 11 * b) / 100;

		var by = (by1 * sat) / 100 + y;
		var ry = (ry1 * sat) / 100 + y;
		var gy = (gy1 * sat) / 100 + y;

		if (ry < 0) ry = 0;
		if (by < 0) by = 0;
		if (gy < 0) gy = 0;
		if (ry > 255) ry = 255;
		if (by > 255) by = 255;
		if (gy > 255) gy = 255;

		pix[i] = ry;
		pix[i + 1] = gy;
		pix[i + 2] = by;
	}

	ctx.putImageData(imgd, 0, 0);
} //Algorithm from The Pocket Handbook of Image Processing Algorithms in C

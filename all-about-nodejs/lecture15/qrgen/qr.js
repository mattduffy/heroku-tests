'use strict';

const qr = require('qr-image');
const fs = require('fs');
//node qr "Encode this string" "QRImage.png"

let dataToEncode = process.argv[2] || null;
let outImage = process.argv[3] || null;

if (null !== dataToEncode && null !== outImage) {
	qr.image(dataToEncode, {
		'type': 'png',
		'size': 20
		}).pipe(fs.createWriteStream(outImage));
		console.log("QR Image created.");
} else {
	console.log("please check cli options.");
}

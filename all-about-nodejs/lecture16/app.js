'use strict';
const Enigma = require('./enigma');
const e = new Enigma('magrathea');

let encodedString = e.encode("Don't Panic!");
console.log("encoded string: ", encodedString);
let decodedString = e.decode(encodedString);
console.log("Decoded: ", decodedString);

let qr = e.qrgen(encodedString, 'cipher-qr.png');
if (qr) console.log("Ecoded your secret message.");

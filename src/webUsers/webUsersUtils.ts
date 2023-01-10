import CryptoJS from "crypto-js";

export function encrypt(input: string, key: string) {
  var c = "";
  while (key.length < input.length) {
    key += key;
  }
  for (var i = 0; i < input.length; i++) {
    var value1 = input[i].charCodeAt(0);
    var value2 = key[i].charCodeAt(0);

    var xorValue = value1 ^ value2;

    var xorValueAsHexString = xorValue.toString(16);

    if (xorValueAsHexString.length < 2) {
      xorValueAsHexString = "0" + xorValueAsHexString;
    }

    c += xorValueAsHexString;
  }
  return c;
}
export function decrypt(ciphertext: string, key: string) {
    var p = "";
    while (key.length < (ciphertext.length / 2)) {
      key += key;
    }
  
    for (var i = 0; i < ciphertext.length; i += 2) {
      var xorValueAsHexString = ciphertext.substr(i, 2);
      var xorValue = parseInt(xorValueAsHexString, 16);
  
      var value1 = key[i / 2].charCodeAt(0);
  
      var decryptedValue = xorValue ^ value1;
      p += String.fromCharCode(decryptedValue);
    }
    return p;
  }
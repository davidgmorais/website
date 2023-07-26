const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("")

const makeTable = () => {
    const table = Array();
    for (let ch in ALPHA) {
        table.push(Array().concat(ALPHA.slice(ch, ALPHA.length), ALPHA.slice(0, ch)))
    }
    return table;
}

const getKey = () => {
    let key = CryptoJS.enc.Hex.parse("68747470733a2f2f6461766964676d6f726169732e6769746875622e696f2f44617669644d6f726169735f43562e706466").toString(CryptoJS.enc.Utf8);
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    var cleanKey = new Array();
	for (var i = 0; i < key.length; i++) {
        cleanKey[i] = ALPHA.indexOf(key.charAt(i));
	}
    return cleanKey;
}

const TABLE = makeTable();

export const encryptText = (plaintext, offset=0) => {
    const key = getKey();
    let keyCh = offset%key.length;
    let cipherText = Array();
    for (let ch of plaintext) {
        let row = ALPHA.indexOf(ch.toLowerCase());
        let col = key[keyCh];
        if (row >= 0) {
            let cipherCh = TABLE[row][col];
            if (ch === ch.toUpperCase()) cipherCh = cipherCh.toUpperCase();
            cipherText.push(cipherCh);
            keyCh = (keyCh<key.length-1) ? keyCh+1 : 0;
        } else {
            cipherText.push(ch);
        }
    }
    return cipherText.join("");
}


export const decryptText = (cipherText, offset=0) => {
    const key = getKey();
    let keyCh = offset%key.length;
    let plaintext = Array();
    for (let ch of cipherText) {
        let row = TABLE[key[keyCh]];
        let col = row.indexOf(ch.toLowerCase());
        if (col >= 0) {
            let plainCh = ALPHA[col];
            if (ch === ch.toUpperCase()) plainCh = plainCh.toUpperCase();
            plaintext.push(plainCh)
            keyCh = (keyCh<key.length-1) ? keyCh+1 : 0;
        } else {
            plaintext.push(ch)
        }
    }
    return plaintext.join("");
}

export const fromHex = (hexValue) => {
    return CryptoJS.enc.Hex.parse(hexValue).toString(CryptoJS.enc.Utf8);
}
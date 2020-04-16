const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const password =
  "ccZmMULq3tlzAY+iafZz+96xz+qFsAuGpEjhN7CckJTcdBT03fgobfSVGCGYzILyPNSA3e3msUqHUTCpv8kRnWvFdLv9c+GTEhg+Lj5dOThGDHtkQX2j5bd6Eubw9/l+Lcwj0PeyW0ZoVkB5Nnp1yCnmKAn2Euliq+IurgthT+wln6cQmTjXfL4IB5VxwUEb72FcbeiCfbKxa+MxxbcQTCpli3ErSptwdp9on2k87JTPFqyyMmMRFA9VgOXpHNe43IwFzME01DyHZ+Rp/eQguTmY9FtkFIZeD2e2nrbbDbW6tlk/KOtdhGVIlIGMPNS5m8LYqlrGZlJU3JythEy+J0z1wW1owjVe9Yto2OtUe8WeKI744enBKAX4FnD4My7+/XRjbF5kf6loT9lqeMCdXFb3LDej3GVcKWbJuZjXmD4=";
const key = crypto.scryptSync(password, "salt", 32);
const iv = Buffer.alloc(16, 0); 

function encrypt(text) {
  // console.log("CODE ", text);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log(encrypted);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text) {
  // console.log("DECODE ", text);
  let encryptedText = text.encryptedData;
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAutoPadding(false);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  // console.log(decrypted);
  return decrypted.toString();
}

module.exports = {
  encrypt,
  decrypt
};

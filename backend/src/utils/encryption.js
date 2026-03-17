const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.AES_SECRET_KEY; // must be exactly 32 chars
const IV_LENGTH = 16;

/**
 * Encrypt a plain text string
 * Returns "iv:encryptedData" (both hex encoded)
 */
const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(String(text)), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Decrypt an encrypted string (format: "iv:encryptedData")
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;
  try {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedData = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY, "utf8"),
      iv
    );
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return encryptedText;
  }
};

module.exports = { encrypt, decrypt };
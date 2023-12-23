import generateKeyPair from "./rsa.js";

function getSecure(msg){

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
  
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
  
    return result;
  }

  function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;
  
    while (a > 1) {
      const q = Math.floor(a / m);
      let temp = m;
  
      m = a % m;
      a = temp;
      temp = x0;
  
      x0 = x1 - q * x0;
      x1 = temp;
    }
  
    return x1 < 0 ? x1 + m0 : x1;
  }
  
  
  function blindMessage(message, e, n) {
    // Blinding: message * r^e (mod n)
    const r = Math.floor(Math.random() * (n - 1)) + 1;
    const blindedMessage = (message * modPow(r, e, n)) % n;
    return { blindedMessage, r };
  }
  
  function signBlindedMessage(blindedMessage, d, n) {
    // Signing: blindedMessage^d (mod n)
    return modPow(blindedMessage, d, n);
  }
  
  function unblindSignature(signedBlindedMessage, r, n) {
    // Unblinding: signedBlindedMessage * r^(-1) (mod n)
    const rInverse = modInverse(r, n);
    return (signedBlindedMessage * rInverse) % n;
  }
  
  function encrypt(message, e, n) {
    // Encryption: message^e (mod n)
    return modPow(message, e, n);
  }
  
  function decrypt(ciphertext, d, n) {
    // Decryption: ciphertext^d (mod n)
    return modPow(ciphertext, d, n);
  }
  
  // Example usage
  const bits = 32;
  const message = msg; // Replace with your actual message
  
  // Generate key pair
  const keyPair = generateKeyPair(bits);
  const { publicKey, privateKey } = keyPair;

  console.log(keyPair);
  
  // Blind the message
  const { blindedMessage, r } = blindMessage(message, publicKey.e, publicKey.n);
  
  // Sign the blinded message
  const signedBlindedMessage = signBlindedMessage(blindedMessage, privateKey.d, publicKey.n);
  
  // Unblind the signature
  const unblindedSignature = unblindSignature(signedBlindedMessage, r, publicKey.n);
  
  // Encrypt and decrypt a message (for demonstration purposes)
  const ciphertext = encrypt(message, publicKey.e, publicKey.n);
  const decryptedMessage = decrypt(ciphertext, privateKey.d, publicKey.n);
  
  console.log('Blinded Message:', blindedMessage);
  console.log('Unblinded Signature:', unblindedSignature);
  console.log('Encrypted Message:', ciphertext);
  console.log('Decrypted Message:', decryptedMessage);
  console.log("\n");

}

getSecure(123);

getSecure(123);


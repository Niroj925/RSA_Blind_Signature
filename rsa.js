function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }
  
  function generatePrime(bits) {
    let num;
    do {
      num = Math.floor(Math.random() * (2 ** (bits - 1))) + 2;
    } while (!isPrime(num));
    return num;
  }
  
  function gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;
  
    while (a > 1) {
      const q = Math.floor(a / m);
      let t = m;
  
      m = a % m;
      a = t;
      t = x0;
  
      x0 = x1 - q * x0;
      x1 = t;
    }
  
    return x1 < 0 ? x1 + m0 : x1;
  }
  
  function generateKeyPair(bits) {
    const p = generatePrime(bits);
    const q = generatePrime(bits);
  
    const n = p * q;
    const phi = (p - 1) * (q - 1);
  
    let e;
    do {
      e = Math.floor(Math.random() * (phi - 2)) + 2;
    } while (gcd(e, phi) !== 1);
  
    const d = modInverse(e, phi);
  
    return {
      publicKey: { n, e },
      privateKey: { n, d },
    };
  }
  
  export default generateKeyPair;
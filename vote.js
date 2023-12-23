import generateKeyPair from "./rsa.js";


class Voter {
    constructor(id, publicKey) {
      this.id = id;
      this.publicKey = publicKey;
      this.hasVoted = false;
    }
  }
  
  class Candidate {
    constructor(name, publicKey) {
      this.name = name;
      this.publicKey = publicKey;
      this.voteCount = 0;
    }
  }
  
  class Election {
    constructor() {
      this.voters = [];
      this.candidates = [];
    }
  
    registerVoter(id, publicKey) {
      const newVoter = new Voter(id, publicKey);
      this.voters.push(newVoter);
      console.log(`Voter ${id} registered successfully.`);
      return newVoter;
    }
  
    addCandidate(name, publicKey) {
      const newCandidate = new Candidate(name, publicKey);
      this.candidates.push(newCandidate);
      console.log(`Candidate ${name} added successfully.`);
      return newCandidate;
    }
  
    vote(voter, candidate) {
        if (!voter || !candidate) {
          console.log("Invalid voter or candidate.");
          return;
        }
    
        if (voter.hasVoted) {
          console.log(`Voter ${voter.id} has already voted.`);
          return;
        }

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

      const { publicKey: voterPublicKey } = voter;
      const { publicKey: candidatePublicKey } = candidate;
  
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
  
      // Blind the vote using the voter's public key
      const { blindedVote, r } = blindMessage(1, voterPublicKey.e, voterPublicKey.n);
  
      // Sign the blinded vote using the candidate's private key
      const signedBlindedVote = signBlindedMessage(blindedVote, candidatePublicKey.d, voterPublicKey.n);
  
      // Unblind the signed vote to get the actual vote
      const unblindedVote = unblindSignature(signedBlindedVote, r, voterPublicKey.n);
  
      // Increment the candidate's vote count by 1 for each vote
      candidate.voteCount += 1;
  
      // Mark the voter as having voted
      voter.hasVoted = true;
  
      console.log(`Voter ${voter.id} voted for ${candidate.name}.`);
    }
  
  
    tallyVotes() {
      console.log("Vote Tally:");
      this.candidates.forEach(candidate => {
        console.log(`${candidate.name}: ${candidate.voteCount} votes`);
      });
    }
  }
  
  // Example Usage
  
  // Generate key pairs for voters and candidates
  const voterKeyPair = generateKeyPair(32);
  const candidateKeyPairA = generateKeyPair(32);
  const candidateKeyPairB = generateKeyPair(32);
  
  // Create an election instance
  const election = new Election();
  
  // Register voters and add candidates
  const voter1 = election.registerVoter(1, voterKeyPair.publicKey);
  const voter2 = election.registerVoter(1, voterKeyPair.publicKey);
  const voter3 = election.registerVoter(1, voterKeyPair.publicKey);
  const voter4 = election.registerVoter(1, voterKeyPair.publicKey);
  const voter5 = election.registerVoter(1, voterKeyPair.publicKey);
  const candidateA = election.addCandidate("Candidate A", candidateKeyPairA.publicKey);
  const candidateB = election.addCandidate("Candidate B", candidateKeyPairB.publicKey);
  
  // Voters cast their votes
  election.vote(voter1, candidateB);
  election.vote(voter2, candidateA);
  election.vote(voter3, candidateB);
  election.vote(voter4, candidateB);
  election.vote(voter5, candidateA);
  // Tally the votes
  election.tallyVotes();
  
import crypto from 'crypto';

export function deriveAccountId(pubkey) {
  // Ensure pubkey is a hex string without '0x' prefix
  const pubkeyHex = pubkey.toString('hex').replace(/^0x/, '');
  
  // Try multiple derivation methods
  const methods = [
    // Method 1: Remove first byte, hash entire remaining key
    () => {
      const cleanPubkey = pubkeyHex.slice(2);
      const hash = crypto.createHash('sha256').update(Buffer.from(cleanPubkey, 'hex')).digest('hex');
      return `0x${hash}`;
    },
    
    // Method 2: Hash entire key without modification
    () => {
      const hash = crypto.createHash('sha256').update(Buffer.from(pubkeyHex, 'hex')).digest('hex');
      return `0x${hash}`;
    },
    
    // Method 3: Hash with specific preprocessing
    () => {
      // Try removing compression flag and hashing
      const cleanPubkey = pubkeyHex.startsWith('02') || pubkeyHex.startsWith('03') 
        ? pubkeyHex.slice(2) 
        : pubkeyHex;
      const hash = crypto.createHash('sha256').update(Buffer.from(cleanPubkey, 'hex')).digest('hex');
      return `0x${hash}`;
    },
    
    // Method 4: Potential custom hashing approach
    () => {
      const cleanPubkey = pubkeyHex.slice(2);
      const buffer = Buffer.from(cleanPubkey, 'hex');
      
      // Try different hash combinations
      const hash1 = crypto.createHash('sha256').update(buffer).digest('hex');
      const hash2 = crypto.createHash('sha512').update(buffer).digest('hex');
      
      // XOR or combine hashes in different ways
      const combinedHash = Buffer.from(hash1, 'hex').map((byte, i) => 
        byte ^ (hash2.charCodeAt(i * 2) ^ hash2.charCodeAt(i * 2 + 1))
      );
      
      return `0x${combinedHash.toString('hex')}`;
    }
  ];

  // Log detailed information for debugging
  console.log("\nPubkey Processing:");
  console.log("Original Pubkey (hex):", pubkeyHex);
  
  const results = methods.map((method, index) => {
    try {
      const result = method();
      console.log(`Method ${index + 1} Result:`, result);
      return result;
    } catch (error) {
      console.error(`Method ${index + 1} Error:`, error);
      return null;
    }
  });

  return results[0]; // Return first method's result
}

// Test cases with detailed logging
const testCases = [
  {
    pubkey: "0x02466d7fcae563e5cb09a0d1870bb580344804617879a14949cf22285f1bae3f27",
    expectedAccountId: "0x7b1dda0d03d062460c745b459779e1dee9845a5eec6341a81f91c081c5cc89c5"
  },
  {
    pubkey: "0x023c72addb4fdf09af94f0c94d7fe92a386a7e70cf8a1d85916386bb2535c7b1b1",
    expectedAccountId: "0x7cd90dbe3d3a9c74d45671fa5fd30b8a7c367f7227b32f1f8a0021e656ffb9c4"
  }
];

// Run test cases with extensive logging
testCases.forEach(({ pubkey, expectedAccountId }) => {
  console.log("\n--- Test Case ---");
  console.log("Pubkey:", pubkey);
  const derivedAccountId = deriveAccountId(Buffer.from(pubkey.replace('0x', ''), 'hex'));
  console.log("Derived Account ID:  ", derivedAccountId);
  console.log("Expected Account ID: ", expectedAccountId);
  console.log("Match:", derivedAccountId === expectedAccountId);
});
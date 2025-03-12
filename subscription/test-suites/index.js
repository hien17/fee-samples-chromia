import { createConnection, createInMemoryFtKeyStore, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, registerAccount, registrationStrategy, getPendingTransfersForAccount, getLastPendingTransferForAccount, pendingTransferStrategies } from "@chromia/ft4";
import * as pcl from "postchain-client";

// Global variables
const alicePubkey = Buffer.from("025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245", "hex");
const alicePrivkey = Buffer.from("77FEFD5C7E49E16A1744001F0838D4CF191A66BD9A5F45FDD36CC9120440100A", "hex");
const aliceKeyPair = { pubKey: alicePubkey, privKey: alicePrivkey };

console.log("aliceKeyPair", aliceKeyPair);

const trudyPubkey = Buffer.from("032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56", "hex");
const trudyPrivkey = Buffer.from("0579695EAE57192B5A4C848E31183A7F875BEFC53D7184126DA8C19BE5A2A7D3", "hex");
const trudyKeyPair = { pubKey: trudyPubkey, privKey: trudyPrivkey };

console.log("trudyKeyPair", trudyKeyPair);

const trudyKeyPairStore = createInMemoryFtKeyStore(trudyKeyPair);
const aliceKeyPairStore = createInMemoryFtKeyStore(aliceKeyPair);
// Connection setup
const directoryNodeUrl = "https://node0.testnet.chromia.com:7740";
const blockchainRid = "840B208BD2B1BC04C66F70D730DEF676F2D93A9565EB21442CE8DBDD4ECB11CF";

// Update token ids
const MTA = '2265161B620BE46D4DA56EB1F1A7A7C14907507501E5A58C7625DB7985E8964F'
// You can keep other assets if needed, but MTA is the one we'll use
const assets = [MTA]

// Main function
async function subscriptionNotesTest() {
  const chromiaClient = await pcl.createClient({
    nodeUrlPool: [directoryNodeUrl],
    blockchainRid: blockchainRid,
  });
  
  const connection = createConnection(chromiaClient);
  const client = connection.client;
  try {
    console.log("\n=== Starting Subscription Notes Test ===");
    
    // // 1. Get Alice's account (assume it exists with ID 2)
    // const aliceId = 2;
    // console.log(`Using Alice's account ID: ${aliceId}`);
    
    // // 2. Get asset details
    // const assetId = 1; // Numeric asset ID for transfer_tokens
    // const assetIdHex = CHR; // Hex asset ID for other operations
    // console.log(`Using asset ID: ${assetId} (${assetIdHex})`);
    
    // // 3. Transfer tokens from Alice to non-existent Trudy account
    const trudyIdHex = "21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501";
    const trudyId = Buffer.from(trudyIdHex, "hex");
    const aliceIdHex = "1a48a63faa032a2ce18cc706dbbb86f16df8da4c35dcaaea8715cd19e97ecd0a";
    const aliceId = Buffer.from(aliceIdHex, "hex");
    const amount = 100;
    console.log("trudyId", trudyId);
    
    // console.log(`\n=== Transferring ${amount} tokens from Alice (ID: ${aliceId}) to Trudy (ID: ${trudyIdHex}) ===`);
    // const transferResult = await transferToNonExistentAccount(client, aliceId, trudyId, assetId, amount);
    
    // if (!transferResult) {
    //   throw new Error("Transfer failed. Cannot continue test.");
    // }
    
    // 4. Check pending transfer strategies using the direct query
    console.log("\n=== Checking Pending Transfer Strategies ===");
    const strategies = await getPendingTransferStrategiesDirectQuery(client, trudyId);
    
    if (strategies && strategies.length > 0) {
      console.log("Available strategies:", strategies);
    } else {
      console.log("No strategies found. This might be expected depending on the transfer status.");
    }

    const isPending = await hasPendingCreateAccountTransferForStrategy(client, aliceId, trudyId);
    console.log("isPending", isPending);
    
    // 5. Create and connect Trudy's session
    console.log("\n=== Setting up Trudy's Session ===");
    const { getSession } = createKeyStoreInteractor(client, trudyKeyPairStore);
    
    // 6. Register Trudy's account using subscription strategy
    // console.log("\n=== Registering Trudy's Account with Subscription Strategy ===");
    // await registerAccountWithSubscription(client, trudyKeyPair, assetIdHex);
    
    // // 7. Wait a moment for account registration to complete
    // console.log("Waiting for account registration to complete...");
    // await new Promise(resolve => setTimeout(resolve, 5000));
    
    // // 8. Check Trudy's account details
    // console.log("\n=== Checking Trudy's Account Details ===");
    // const trudyAccount = await getAccountById(client, trudyId);
    // console.log("Trudy's Account:", trudyAccount);
    
    // // 9. Check subscription details
    // console.log("\n=== Checking Subscription Details ===");
    // const subscriptionDetails = await getSubscriptionDetails(client, trudyId);
    // console.log("Subscription Details:", subscriptionDetails);
    
    // // 10. Get Trudy's session
    // const trudySession = await createTrudySession(client, trudyKeyPair);
    
    // // 11. Add a note
    // console.log("\n=== Adding a Note ===");
    // await addNote(trudySession, "This is my first note using subscription access!");
    
    // // 12. Get notes
    // console.log("\n=== Getting Notes ===");
    // const notes = await getNotes(client, trudyId);
    // console.log("Trudy's Notes:", notes);
    
    // console.log("\n=== Subscription Notes Test Completed Successfully ===");
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Function to transfer tokens to a non-existent account
async function transferToNonExistentAccount(client, senderAccountId, recipientId, assetId, amount) {
  try {
    const txResult = await client
      .transaction()
      .add({
        name: "transfer_tokens",
        args: [
          senderAccountId,              // sender_id
          recipientId,                  // recipient_id 
          assetId,                      // asset_id
          BigInt(amount)                // amount
        ]
      })
      .sign({ pubKey: alicePubkey, privKey: alicePrivkey })
      .post();
    
    console.log("Transfer successful!");
    console.log("Transaction ID:", formatTransactionId(txResult.receipt.transactionRid));
    return true;
  } catch (error) {
    console.error("Error transferring tokens:", error.message);
    return false;
  }
}

// Function to get pending transfer strategies using direct query
async function getPendingTransferStrategiesDirectQuery(client, recipientId) {
  try {
    // Convert recipient ID to hex string
    const recipientIdHex = recipientId.toString('hex');
    
    // Execute the specific query path
    const strategies = await client.query("ft4.get_pending_transfer_strategies", {
      recipient_id: recipientIdHex,
      filter: null
    });
    
    console.log("Pending Transfer Strategies:", strategies);
    return strategies;
  } catch (error) {
    console.error("Error getting pending transfer strategies:", error.message);
    return [];
  }
}

async function hasPendingCreateAccountTransferForStrategy(client, senderId, recipientId) {
  try {
    // Ensure consistent ID representation
    const senderIdHex = senderId.toString('hex');
    const recipientIdHex = recipientId.toString('hex');
    
    const isPending = await client.query("ft4.has_pending_create_account_transfer_for_strategy", {
      strategy_name: "subscription",
      sender_blockchain_rid: "840B208BD2B1BC04C66F70D730DEF676F2D93A9565EB21442CE8DBDD4ECB11CF",
      sender_id: senderIdHex,
      recipient_id: recipientIdHex,
      asset_id: "2265161B620BE46D4DA56EB1F1A7A7C14907507501E5A58C7625DB7985E8964F",
      amount: BigInt(100000000)
    });

    console.log("Pending Create Account Transfer Status:", isPending);
    return isPending;
  } catch (error) {
    console.error("Error checking pending create account transfer:", error.message);
    return false;
  }
}

// Function to register account using subscription strategy
async function registerAccountWithSubscription(client, keyPair, assetIdHex) {
  try {
    // First attempt the RAS transfer subscription
    const rasResult = await client
      .transaction()
      .add({
        name: "ft4.ras_transfer_subscription",
        args: [
          Buffer.from(assetIdHex, 'hex'),
          [{ // auth descriptor as an array
            pubkey: keyPair.pubKey,
            permissions: ["A", "T"],
            delegate: null
          }],
          null
        ]
      })
      .sign({ pubKey: keyPair.pubKey, privKey: keyPair.privKey })
      .post();
    
    console.log("RAS Transfer Subscription successful!");
    console.log("Transaction ID:", formatTransactionId(rasResult.receipt.transactionRid));
    
    // Then register the account
    const registerResult = await client
      .transaction()
      .add({
        name: "ft4.register_account",
        args: []
      })
      .sign({ pubKey: keyPair.pubKey, privKey: keyPair.privKey })
      .post();
    
    console.log("Account Registration successful!");
    console.log("Transaction ID:", formatTransactionId(registerResult.receipt.transactionRid));
    
    return true;
  } catch (error) {
    console.error("Error registering account with subscription:", error.message);
    return false;
  }
}

// Function to get account by ID
async function getAccountById(client, accountId) {
  try {
    const account = await client.query("get_account_by_id", {
      id: accountId
    });
    return account;
  } catch (error) {
    console.error("Error getting account by ID:", error.message);
    return null;
  }
}

// Function to get subscription details
async function getSubscriptionDetails(client, accountId) {
  try {
    const details = await client.query("get_subscription_details", {
      account_id: accountId
    });
    return details;
  } catch (error) {
    console.error("Error getting subscription details:", error.message);
    return null;
  }
}

// Function to create Trudy's session
async function createTrudySession(client, keyPair) {
  try {
    const { getAccounts, getSession } = createKeyStoreInteractor(client, createInMemoryFtKeyStore(keyPair));
    
    // Try to get accounts
    const accounts = await getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found for Trudy. Account registration may have failed.");
    }
    
    // Get session for first account
    const trudyAccount = accounts[0];
    console.log("Found Trudy's account:", trudyAccount.id.toString("hex"));
    
    const session = await getSession(trudyAccount.id);
    return session;
  } catch (error) {
    console.error("Error creating Trudy's session:", error.message);
    throw error;
  }
}

// Function to add a note
async function addNote(session, noteText) {
  try {
    const txResult = await session
      .transactionBuilder()
      .add({
        name: "notes.add_note",
        args: [noteText]
      })
      .buildAndSend();
    
    console.log("Note added successfully!");
    console.log("Transaction ID:", formatTransactionId(txResult.receipt.transactionRid));
    return true;
  } catch (error) {
    console.error("Error adding note:", error.message);
    return false;
  }
}

// Function to get notes
async function getNotes(client, accountId) {
  try {
    const notes = await client.query("notes.get_notes", {
      account_id: accountId
    });
    return notes;
  } catch (error) {
    console.error("Error getting notes:", error.message);
    return [];
  }
}

// Run the subscription notes test
subscriptionNotesTest();
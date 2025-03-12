import { 
  createConnection, 
  createInMemoryFtKeyStore, 
  createKeyStoreInteractor, 
  registerAccount, 
  getPendingTransfersForAccount 
} from "@chromia/ft4";
import * as pcl from "postchain-client";

// Configuration
const directoryNodeUrl = "https://node0.testnet.chromia.com:7740";
const blockchainRid = "840B208BD2B1BC04C66F70D730DEF676F2D93A9565EB21442CE8DBDD4ECB11CF";
const MTA = '2265161B620BE46D4DA56EB1F1A7A7C14907507501E5A58C7625DB7985E8964F';

// Key Pairs
const alicePubkey = Buffer.from("025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245", "hex");
const alicePrivkey = Buffer.from("77FEFD5C7E49E16A1744001F0838D4CF191A66BD9A5F45FDD36CC9120440100A", "hex");
const aliceKeyPair = { pubKey: alicePubkey, privKey: alicePrivkey };

const trudyPubkey = Buffer.from("032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56", "hex");
const trudyPrivkey = Buffer.from("0579695EAE57192B5A4C848E31183A7F875BEFC53D7184126DA8C19BE5A2A7D3", "hex");
const trudyKeyPair = { pubKey: trudyPubkey, privKey: trudyPrivkey };

const trudyKeyPairStore = createInMemoryFtKeyStore(trudyKeyPair);
const aliceKeyPairStore = createInMemoryFtKeyStore(aliceKeyPair);

// Utility Functions
function formatTransactionId(txId) {
  return txId.toString('hex');
}

async function getPendingTransferStrategiesDirectQuery(session, recipientId) {
  try {
    const recipientIdHex = recipientId.toString('hex');
    const queryPaths = [
      "ft4.get_pending_transfer_strategies",
      "get_pending_transfer_strategies"
    ];

    for (const queryPath of queryPaths) {
      try {
        const strategies = await session.query(queryPath, {
          recipient_id: recipientIdHex,
          filter: null
        });
        
        console.log(`Pending Transfer Strategies (${queryPath}):`, strategies);
        return strategies;
      } catch (pathError) {
        console.log(`Query failed with path ${queryPath}:`, pathError.message);
      }
    }

    throw new Error("Could not execute pending transfer strategies query");
  } catch (error) {
    console.error("Error getting pending transfer strategies:", error);
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

async function transferToNonExistentAccount(client, senderAccountId, recipientId, assetId, amount) {
  try {
    const txResult = await client
      .transaction()
      .add({
        name: "transfer_tokens",
        args: [
          senderAccountId,              
          recipientId,                  
          assetId,                      
          BigInt(amount)                
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

async function registerAccountWithSubscription(session, keyPair, assetIdHex) {
  try {
    const rasResult = await session
      .transactionBuilder()
      .add({
        name: "ft4.ras_transfer_subscription",
        args: [
          Buffer.from(assetIdHex, 'hex'),
          [{ 
            pubkey: keyPair.pubKey,
            permissions: ["A", "T"],
            delegate: null
          }],
          null
        ]
      })
      .buildAndSend();
    
    console.log("RAS Transfer Subscription successful!");
    console.log("Transaction ID:", formatTransactionId(rasResult.receipt.transactionRid));
    
    const registerResult = await session
      .transactionBuilder()
      .add({
        name: "ft4.register_account",
        args: []
      })
      .buildAndSend();
    
    console.log("Account Registration successful!");
    console.log("Transaction ID:", formatTransactionId(registerResult.receipt.transactionRid));
    
    return true;
  } catch (error) {
    console.error("Error registering account with subscription:", error.message);
    return false;
  }
}

// Main Test Function
async function subscriptionNotesTest() {
  const chromiaClient = await pcl.createClient({
    nodeUrlPool: [directoryNodeUrl],
    blockchainRid: blockchainRid,
  });
  
  const connection = createConnection(chromiaClient);
  const client = connection.client;

  try {
    console.log("\n=== Starting Subscription Notes Test ===");
    
    const aliceAccountId = 2;
    const assetId = 1;
    const assetIdHex = MTA;
    
    const aliceIdHex = "1a48a63faa032a2ce18cc706dbbb86f16df8da4c35dcaaea8715cd19e97ecd0a"; // shasum 256 of alice's pubkey
    const aliceId = Buffer.from(aliceIdHex, "hex");
    const trudyIdHex = "21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501"; // shasum 256 of trudy's pubkey
    const trudyId = Buffer.from(trudyIdHex, "hex");
    const amount = 100;

    // Create Alice session
    const { getAccounts, getSession } = createKeyStoreInteractor(client, aliceKeyPairStore);
    
    const accounts = await getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error(
          "No linked Chromia accounts found. Ensure the network is connected to the Chromia testnet."
      );
  }

    const ftAccount = accounts[0];
    const session = await getSession(ftAccount.id);
    
    // console.log(`Transferring ${amount} tokens from Alice to Trudy`);
    // const transferResult = await transferToNonExistentAccount(session, aliceId, trudyId, assetId, amount);
    // if (!transferResult) throw new Error("Transfer failed");
    
    console.log("Checking Pending Transfer Strategies");
    const strategies = await getPendingTransferStrategiesDirectQuery(session, trudyId);
    console.log("Strategies:", strategies);

    console.log("Checking Pending Create Account Transfer For Strategy");
    const isPending = await hasPendingCreateAccountTransferForStrategy(client, aliceId, trudyId);
    console.log("isPending", isPending);
    
    console.log("Registering Account with Subscription");
    await registerAccountWithSubscription(session, trudyKeyPair, assetIdHex);
    
    console.log("\n=== Subscription Notes Test Completed Successfully ===");
    
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

// Run the test
subscriptionNotesTest();
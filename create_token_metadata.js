// Import necessary modules
const {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
    createMetadataAccountV3,
    findMetadataPda,
    MetadataData,
    MetadataArgs,
    Data
} = require('@metaplex-foundation/mpl-token-metadata');
const { Umi, createUmi } = require('@metaplex-foundation/umi');

// Set up connection and wallet
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Replace with your actual secret key as a Uint8Array
const payer = Keypair.fromSecretKey(new Uint8Array([0, 106, 227, 52, 91, 93, 42, 23, 119, 112, 224, 210, 204, 129, 97, 161, 97, 37, 119, 245, 252, 113, 58, 216, 179, 237, 237, 105, 85, 125, 78, 36, 137, 92, 39, 126, 198, 22, 73, 19, 68, 164, 203, 237, 111, 239, 252, 232, 184, 11, 77, 184, 71, 182, 36, 187, 193, 166, 28, 246, 100, 137, 154, 230])); 

const authority = new PublicKey('AFCMfcCXFrtcKUw3j6hvbm6V5324ZUmEubLJ375ceg7P'); // Replace with your authority public key
const mintAddress = new PublicKey('AFCMfcCXFrtcKUw3j6hvbm6V5324ZUmEubLJ375ceg7P');

// Create a UMI instance
const umi = createUmi({
    connection,
    identity: payer,
});

// Define metadata
const metadataUri = 'https://ipfs.io/ipfs/QmNtm8yjmnnKauMzcYdsZw5JP7nhK939L9RrQhCUJvMEUk?filename=20240321_174149.png';
const metadataData = {
    name: 'BEL Tech', // Token name
    symbol: 'BEL', // Token symbol
    uri: metadataUri, // Metadata URI
    sellerFeeBasisPoints: 500, // Example: 5% seller fee
    creators: null, // Optional: Set if you want to specify creators
};

// Create a function to submit the transaction
async function submitTransaction() {
    // Find the metadata account PDA
    const metadataAccountAddress = await findMetadataPda(mintAddress);

    // Create metadata instruction
    const instruction = createMetadataAccountV3({
        metadata: metadataAccountAddress,
        mint: mintAddress,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: authority,
        data: metadataData,
        isMutable: true,
    });

    // Create transaction
    let transaction = new Transaction().add(instruction);

    // Sign and submit the transaction
    try {
        let signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
        console.log(`Transaction submitted: https://explorer.solana.com/tx/${signature}?cluster=mainnet`);
    } catch (error) {
        console.error("Transaction failed", error);
    }
}

// Run the function
submitTransaction();

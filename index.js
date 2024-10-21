const { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { createMetadataAccountV2, PROGRAM_ID } = require('@metaplex-foundation/mpl-token-metadata');

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
const payer = Keypair.fromSecretKey(new Uint8Array([0, 106, 227, 52, 91, 93, 42, 23, 119, 112, 224, 210, 204, 129, 97, 161, 97, 37, 119, 245, 252, 113, 58, 216, 179, 237, 237, 105, 85, 125, 78, 36, 137, 92, 39, 126, 198, 22, 73, 19, 68, 164, 203, 237, 111, 239, 252, 232, 184, 11, 77, 184, 71, 182, 36, 187, 193, 166, 28, 246, 100, 137, 154, 230]));
const mintAddress = new PublicKey('AFCMfcCXFrtcKUw3j6hvbm6V5324ZUmEubLJ375ceg7P');

const tokenMetadata = {
  name: "BEL Tech",
  symbol: "BEL",
  uri: 'https://ipfs.io/ipfs/QmNtm8yjmnnKauMzcYdsZw5JP7nhK939L9RrQhCUJvMEUk?filename=20240321_174149.png'
};

async function initializeMetadata(mintAddress) {
  const [metadataAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer()
    ],
    PROGRAM_ID
  );

  const instruction = createMetadataAccountV2(
    {
      metadata: metadataAccount,
      mint: mintAddress,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey
    }, {
      data: {
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        uri: tokenMetadata.uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
      },
      isMutable: true
    }
  );

  const transaction = new Transaction().add(instruction);
  await sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log('Metadata initialized at:', metadataAccount.toBase58());
}

async function main() {
  await initializeMetadata(mintAddress);
}

main().catch(err => {
  console.error('Error initializing metadata:', err);
});

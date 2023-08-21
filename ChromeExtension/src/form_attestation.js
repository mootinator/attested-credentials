import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // Base Goerli v0.27

export async function eas() {
  
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);

  // Gets a default provider (in production use something else like infura/alchemy)
  const provider = ethers.providers.getDefaultProvider(
    "base-goerli"
  );

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  eas.connect(provider);

  const offchain = await eas.getOffchain();
  const encodedData = schemaEncoder.encodeData([
    { name: "form_id", value: FB_PUBLIC_LOAD_DATA_[14], type: "string" }
  ]);

  // Signer is an ethers.js Signer instance
  const signer = new ethers.Wallet(privateKey, provider);

  const offchainAttestation = await offchain.signOffchainAttestation({
    recipient: '0xCb371553B1692dd8dA6db026F6a250c9d4eF483A',
    // Unix timestamp of when attestation expires. (0 for no expiration)
    expirationTime: 0,
    // Unix timestamp of current time
    time: new Date(),
    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    version: 1,
    nonce: array[0],
    schema: "0x214b3eb0c0ea3d82932610140021ee73b0c622935e52aa3fb393c9ffb52f78d5",
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: encodedData,
  }, signer);
}
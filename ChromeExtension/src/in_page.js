import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider } from 'ethers/providers';

export const EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // Base Goerli v0.27
 
// Gets a default provider (in production use something else like infura/alchemy)
export const provider = new BrowserProvider(window.ethereum, 84531);

BigInt.prototype.toJSON = function() { return this.toString() }

document.addEventListener("attested_forms_create_attestation", async function(e) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);

  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  eas.connect(provider);

  const offchain = await eas.getOffchain();
  const schemaEncoder = new SchemaEncoder("string form_id");
  const encodedData = schemaEncoder.encodeData([
    { name: "form_id", value: FB_PUBLIC_LOAD_DATA_[14], type: "string" }
  ]);

  // Signer is an ethers.js Signer instance
  const signer = await provider.getSigner();

  try {
  // Get the default address
  var accounts = await provider.send("eth_requestAccounts", []);


  const offchainAttestation = await offchain.signOffchainAttestation({
    recipient: accounts[0],
    // Unix timestamp of when attestation expires. (0 for no expiration)
    expirationTime: 0,
    // Unix timestamp of current time
    time: Math.floor(Date.now() / 1000),
    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    version: 1,
    nonce: arr[0],
    schema: "0x214b3eb0c0ea3d82932610140021ee73b0c622935e52aa3fb393c9ffb52f78d5",
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: encodedData,
  }, signer);
  //writeToId
  //resultTextId
  var resultField = document.querySelector("input[jsname='" + e.detail.writeToJsName + "']");
  resultField.setAttribute("value", JSON.stringify(offchainAttestation));
  var event = new Event('input', {
    bubbles: true,
    cancelable: true,
  });
  resultField.dispatchEvent(event);

  var buttonField = document.getElementById(e.detail.resultTextId);
  buttonField.innerText = accounts[0];
  } catch (err) {
    console.log(err);
    var buttonField = document.getElementById(e.detail.resultTextId);
    buttonField.innerText = err.message;
  }
});

document.addEventListener("attested_forms_sign_message", async function(e) {
    var accounts = await provider.send("eth_requestAccounts", []);
    try {
        var signer = await provider.getSigner(accounts[0]);
        var resultField = document.querySelector("input[jsname='" + e.detail.writeToJsName + "']");
        var response = await signer.signMessage(e.detail.message);
        resultField.setAttribute("value", response);
        var buttonField = document.getElementById(e.detail.resultTextId);
        buttonField.innerText = accounts[0];
    } catch (err) {
        console.error(err);
        document.getElementById(e.detail.resultTextId).innerText = `Error: ${err.message}`;
}});



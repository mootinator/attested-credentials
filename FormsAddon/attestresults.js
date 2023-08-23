'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const path = require('path');
const fs = require('fs');
const google = require('@googleapis/forms');
const {authenticate} = require('@google-cloud/local-auth');
const projectId = "attested-credentials";
process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../service-credentials.json"
const PRIVKEY = fs.readFileSync('../../privkey.txt','utf8');
const userFormID = 'e/1FAIpQLSfFadKE-_wGPr6xCdWFfd3KASwP8kHoYblI7Zplt9CbAtnZng';
const theFormId = '16-Pnx7p6qnmhBOvXCLPPgObM354UQ-7q62I3F4V7jwY';
const EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // Base Goerli v0.27
const { EAS, SchemaEncoder, Offchain } = require("@ethereum-attestation-service/eas-sdk");
const { Network, ethers } = require('ethers');

const eas = new EAS(EASContractAddress);
let provider = new ethers.JsonRpcProvider('https://goerli.base.org');
const signer = new ethers.Wallet(PRIVKEY, provider);
eas.connect(signer);

async function listenForMessages(subscriptionNameOrId, timeout) {
  // References an existing subscription
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const pubSubClient = new PubSub({projectId});
  const forms = google.forms({
    version: 'v1',
    auth: authClient,
  });

  // Debug to get the important part (attestation) working.
  const res = await forms.forms.responses.list({
    formId: theFormId,
  });

  res.data.responses.sort((a,b) => (a.createTime < b.createTime) ? 1 : ((b.createTime < a.createTime) ? -1 : 0));
  var attestation = res.data.responses[0].answers["0535db7d"].textAnswers.answers[0].value;
  var attestationObj = JSON.parse(attestation);
  var score = res.data.responses[0].totalScore;
  console.log(res.data.responses[0]);
  console.log("Score: " + score);
  console.log("Signer:" + attestationObj.message.recipient);

  
  const EAS_CONFIG = {
    address: attestationObj.domain.verifyingContract,
    version: attestationObj.domain.version,
    chainId: attestationObj.domain.chainId,
  };
  const offchain = new Offchain(EAS_CONFIG, 1);
  const isValidAttestation = offchain.verifyOffchainAttestationSignature(
    attestationObj.message.recipient,
    attestationObj
  );
  console.log("IsValid: " + isValidAttestation);

  if (isValidAttestation) {
    const schemaEncoder = new SchemaEncoder("string form_id, uint32 total_score");
    const encodedData = schemaEncoder.encodeData([
      { name: "form_id", value: theFormId, type: "string" },
      { name: "total_score", value: score, type: "uint32" }
    ]);

    const schemaUID = "0x03b5cecfe0fe3ca23c2e8e4b5037e752531114522e4bb679287df41cc8956ff7";

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: attestationObj.message.recipient,
      expirationTime: 0,
      revocable: true, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
}
  //'0535db7d' or '515aa696'"
/*
  const subscription = pubSubClient.subscription(subscriptionNameOrId);

  // Create an event handler to handle messages
  
  let messageCount = 0;
  const messageHandler = async message => {
    var theFormId = message.attributes.formId;
    messageCount += 1;

    const res = await forms.forms.responses.list({
      formId: theFormId,
    });

    console.log(res.data);

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  // Wait a while for the subscription to run. (Part of the sample only.)
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);*/
}

async function run() {
    var timeout = Number(6000);
    listenForMessages("projects/attested-credentials/subscriptions/submittedforms-sub", timeout);
  }


if (module === require.main) {
    run().catch(console.error);
}
module.exports = run;
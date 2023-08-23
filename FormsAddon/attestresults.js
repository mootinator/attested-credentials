'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const path = require('path');
const google = require('@googleapis/forms');
const {authenticate} = require('@google-cloud/local-auth');
const projectId = "attested-credentials";
process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../service-credentials.json"
const userFormID = 'e/1FAIpQLSfFadKE-_wGPr6xCdWFfd3KASwP8kHoYblI7Zplt9CbAtnZng';
const theFormId = '16-Pnx7p6qnmhBOvXCLPPgObM354UQ-7q62I3F4V7jwY';

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
  var score = res.data.responses[0].totalScore;
  console.log(res.data.responses[0]);
  console.log("Score: " + score);
  console.log("Attestation: " + attestation);
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
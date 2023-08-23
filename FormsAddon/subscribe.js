'use strict';

const path = require('path');
const google = require('@googleapis/forms');
const {authenticate} = require('@google-cloud/local-auth');

const formID = '16-Pnx7p6qnmhBOvXCLPPgObM354UQ-7q62I3F4V7jwY';

async function run(query) {
    const authClient = await authenticate({
      keyfilePath: path.join(__dirname, 'credentials.json'),
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const forms = google.forms({
      version: 'v1',
      auth: authClient,
    });
    const watchRequest = {
      watch: {
        target: {
          topic: {
            topicName: 'projects/attested-credentials/topics/submittedforms',
          },
        },
        eventType: 'RESPONSES',
      },
    };
    const res = await forms.forms.watches.create({
      formId: formID,
      requestBody: watchRequest,
    });
    console.log(res.data);
    return res.data;
  }


if (module === require.main) {
    run().catch(console.error);
}
module.exports = run;
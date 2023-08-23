# attested-credentials

To test the chrome extension:
-----------------------------

1. Navigate to the ChromeExtension folder.
2. Install dependencies
    npm install
3. Build the extension
    npm run build
4. Install the unpacked extension into Chrome.
5. Create a quiz in google forms.
6. In order to activate the extension, the quiz must have a "Short Answer" question where the question is exactly "Attest Using EAS".
7. Make the "Attest Using EAS" question required.
8. Fill out the form, and view the off-chain attestation in the form responses.

*NOTE:* Ideally you could validate the off-chain attestation manually, the output format differs from that accepted by https://base-goerli.easscan.org/tools

Adding the missing context around the attestation appears to invalidate the signature.
    {"sig":<paste here>,
    "signer":"<paste here>"}

The signatures do validate correctly using the configuration in attestresults.js, i.e.:
```
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
```

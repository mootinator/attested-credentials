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


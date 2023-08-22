export async function eas(actionButton, inputField, addressField) {
  const recipient = document.getElementById(addressField).getAttribute("value");
  var loginEvent = new CustomEvent("attested_forms_create_attestation", {
    detail: { 
      writeToId: inputField.getAttribute("id"),
      resultTextId: actionButton.getAttribute("id"),
      recipient: recipient
    }
  });
  await document.dispatchEvent(loginEvent);
}
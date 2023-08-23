export async function eas(actionButton, inputField, addressField) {
  var loginEvent = new CustomEvent("attested_forms_create_attestation", {
    detail: { 
      writeToJsName: inputField.getAttribute("jsname"),
      resultTextId: actionButton.getAttribute("id"),
    }
  });
  await document.dispatchEvent(loginEvent);
}

export async function metamask(actionButton, inputField, addressField) {
  const domain = window.location.host;
  const from = document.getElementById(addressField).getAttribute("value");
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: ${array[0]}\nIssued At: ${new Date().toISOString()}`;
  await siweSign(siweMessage, actionButton, inputField, from);
}

String.prototype.hexEncode = function(){
  var utfstr = new TextEncoder().encode(this);
  return utfstr.reduce((output, elem) => 
    (output + ('0' + elem.toString(16)).slice(-2)),
    '');
}

const siweSign = async (siweMessage, actionButton, inputField, account) => {
    const from = account;
    const msg = `0x${siweMessage.hexEncode()}`;

    var loginEvent = new CustomEvent("attested_forms_sign_message", {
      detail: { 
        writeToJsName: inputField.getAttribute("jsname"),
        resultTextId: actionButton.getAttribute("id"),
        message: msg
      }
    });
    await document.dispatchEvent(loginEvent);

    var event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    inputField.dispatchEvent(event);
    actionButton.innerText = account;
}




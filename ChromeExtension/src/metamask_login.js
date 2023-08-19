
export async function metamask(actionButton, inputField) {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const domain = window.location.host;
  const from = accounts[0];
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: ${array[0]}\nIssued At: ${new Date().toISOString()}`;
  await siweSign(siweMessage, actionButton, inputField, accounts);
}

String.prototype.hexEncode = function(){
  var utfstr = new TextEncoder().encode(this);
  return utfstr.reduce((output, elem) => 
    (output + ('0' + elem.toString(16)).slice(-2)),
    '');
}

const siweSign = async (siweMessage, actionButton, inputField, accounts) => {
  try {
    const from = accounts[0];
    const msg = `0x${siweMessage.hexEncode()}`;
    const sign = await ethereum.request({
      method: 'personal_sign',
      params: [msg, from],
    });
    inputField.value = sign;
    var event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    inputField.dispatchEvent(event);
    actionButton.innerText = accounts[0];
  } catch (err) {
    console.error(err);
    actionButton.innerText = `Error: ${err.message}`;
  }
}




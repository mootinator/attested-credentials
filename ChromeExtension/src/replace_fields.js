import {eas} from './form_attestation';
import {metamask} from './metamask_login';



async function process_page() {
	console.log("Called process_page");
	const METAMASK_XPATH = "//span[text()='Verify your Ethereum Address']";
	const EAS_XPATH = "//span[text()='Attest Using EAS']";
	const question_types = [{xpath: METAMASK_XPATH, buttonText: "Sign in with Ethereum", func: metamask }, {xpath: EAS_XPATH, buttonText:"Attest This Form", func: eas }];
	var doConnect = false;
	var matchingElement = null;
	var address = null;
	var i = 0;
	question_types.forEach(
		async function(question) {
				i++;
				matchingElement = document.evaluate(question.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (matchingElement) {
					var questionRoot = matchingElement.closest("[role='listitem']");
					var inputContainer = questionRoot.querySelectorAll("div[jscontroller]")[1];
					let inputField = inputContainer.querySelector("input[type='text']");
					inputContainer.style.display="none";
					let siwe = document.createElement('BUTTON');
					siwe.setAttribute("id", "attested_button_" + i);
					let text = document.createTextNode(question.buttonText);
					siwe.appendChild(text);
					if (!doConnect) {
						address = document.createElement("INPUT");
						address.setAttribute("type", "hidden");
						address.setAttribute("name", "attested_plugin_response");
						address.setAttribute("id", "attested_plugin_response");
						inputContainer.insertAdjacentElement("beforebegin",address);
						var connectEvent = new CustomEvent("attested_forms_connect", {
							detail: { writeToId: "attested_plugin_response" },
							});
						await document.dispatchEvent(connectEvent);
					}
					inputContainer.insertAdjacentElement("beforebegin",siwe);
					doConnect = true;	
					siwe.onclick = question.func.bind(this, siwe, inputField, "attested_plugin_response");
				}
		}
	);
}

function embed() {
	var s = document.createElement('script');
	s.src = chrome.runtime.getURL('dist/in_page.js');
	s.onload = async function() { await process_page(); this.remove(); };
	// see also "Dynamic values in the injected code" section in this answer
	(document.head || document.documentElement).appendChild(s);
}

embed();


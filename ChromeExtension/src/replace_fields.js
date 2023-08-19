import {eas} from './form_attestation';
import {metamask} from './metamask_login';

function process_page() {
	console.log("Called process_page");
	const METAMASK_XPATH = "//span[text()='Verify your Ethereum Address']";
	const EAS_XPATH = "//span[text()='Attest Using EAS']";
	const question_types = [{xpath: METAMASK_XPATH, buttonText: "Sign in with Ethereum", func: metamask }, {xpath: EAS_XPATH, buttonText:"Attest This Form", func: eas }];
	question_types.forEach(
		function(question) {
				var matchingElement = document.evaluate(question.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (matchingElement) {
					var questionRoot = matchingElement.closest("[role='listitem']");
					var inputContainer = questionRoot.querySelectorAll("div[jscontroller]")[1];
					let inputField = inputContainer.querySelector("input[type='text']");
					inputContainer.style.display="none";
					let siwe = document.createElement('BUTTON');
					let text = document.createTextNode(question.buttonText);
					siwe.appendChild(text);
					inputContainer.insertAdjacentElement("beforebegin",siwe);
					siwe.onclick = question.func.bind(question, siwe, inputField);
				}
		}
	);
}

process_page();

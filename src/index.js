import "./styles.css";
import { stateUnit } from "./lib";
import { htmlToJustCs } from "./htmlToJustCs";

// State Units
const [getSourceHtml, setSourceHtml, onSourceHtmlChange] = stateUnit("");
const [getTargetJustCs, setTargetJustCs, onTargetJustCsChange] = stateUnit("");

// Elements
const sourceHtml = document.getElementById("sourceHtml");
const convertButton = document.getElementById("convertButton");
const targetJustCs = document
  .getElementById("targetJustCs")
  .querySelector("code");
const copyToClipboardButton = document.getElementById("copyToClipboardButton");
const clearButton = document.getElementById("clearButton");

// DOM event Listeners
sourceHtml.addEventListener("change", (e) => setSourceHtml(e.target.value));
sourceHtml.addEventListener("paste", (e) => setSourceHtml(e.clipboardData));
convertButton.addEventListener("click", () =>
  setTargetJustCs(htmlToJustCs(getSourceHtml()))
);
copyToClipboardButton.addEventListener("click", () =>
  navigator.clipboard.writeText(getTargetJustCs())
);
clearButton.addEventListener("click", () => {
  sourceHtml.value = "";
  setSourceHtml("");
  setTargetJustCs("");
});

// State Event Listeners
onSourceHtmlChange((newValue) =>
  newValue.length === 0
    ? convertButton.setAttribute("disabled", true)
    : convertButton.removeAttribute("disabled")
);
onTargetJustCsChange((newValue) => {
  targetJustCs.innerText = newValue;
  if (newValue.length === 0) {
    copyToClipboardButton.setAttribute("disabled", true);
  } else {
    copyToClipboardButton.removeAttribute("disabled");
  }
});

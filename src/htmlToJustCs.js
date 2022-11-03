import { upperCaseFirst } from "./lib";

const spacingTextExpression = /^\n( |\t)*$/;

const knownBooleanAttrs = [
  "Async",
  "Autofocus",
  "Autoplay",
  "Checked",
  "Contenteditable",
  "Controls",
  "Default",
  "Defer",
  "Disabled",
  "Download",
  "Hidden",
  "Ismap",
  "Loop",
  "Multiple",
  "Muted",
  "Novalidate",
  "Open",
  "Readonly",
  "Required",
  "Reversed",
  "Sandbox",
  "Selected"
];

function processAttribute({ nodeName, nodeValue }) {
  const firstIndexOfDash = nodeName.indexOf("-");
  const attributeName = upperCaseFirst(
    nodeName.slice(firstIndexOfDash + 1).replaceAll("-", "")
  );
  const isBoolean = knownBooleanAttrs.includes(attributeName);
  const stringValue = isBoolean ? "true" : `"${nodeValue}"`;
  return `${attributeName} = ${stringValue}`;
}

function printTag(node, depth = 0) {
  const tabs = `\n${" ".repeat(depth * 2)}`;

  if (node.nodeType === 3) {
    const { wholeText } = node;
    const isFormattingText = spacingTextExpression.test(wholeText);
    return isFormattingText ? "" : `${tabs}@"${wholeText}"`;
  }

  const { tagName, attributes, childNodes } = node;

  const allAttributes = [...attributes];

  const regularAttributes = allAttributes
    .filter(({ nodeName }) => !nodeName.includes("-"))
    .map(processAttribute);

  const ariaAttributes = allAttributes
    .filter(({ nodeName }) => nodeName.startsWith("aria-"))
    .map(processAttribute)
    .join(", ");

  const dataAttributes = allAttributes
    .filter(({ nodeName }) => nodeName.startsWith("data-"))
    .map(processAttribute)
    .join(", ");

  const attrs = [
    ...regularAttributes,
    ...(ariaAttributes.length > 0
      ? [`Aria = new AriaAttrs { ${ariaAttributes} }`]
      : []),
    ...(dataAttributes.length > 0
      ? [`DataSet = new { ${dataAttributes} }`]
      : [])
  ].join(", ");

  const children = [...childNodes]
    .map((child) => printTag(child, depth + 1))
    .filter((entry) => entry.length > 0)
    .join(",");

  const selfClosed = children.length === 0;

  return `${tabs}_<${tagName[0]}${tagName
    .slice(1)
    .toLowerCase()}>(new Attrs{ ${attrs} }${selfClosed ? "" : ","}${children}${
    selfClosed ? "" : tabs
  })`;
}

export function htmlToJustCs(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return [...doc.body.childNodes].map(printTag).join("\n");
}

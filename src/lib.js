export function stateUnit(initialState) {
  let current = initialState;
  const listeners = [];

  return [
    () => current,
    (newValue) => {
      listeners.forEach((listener) => listener(newValue, current));
      current = newValue;
    },
    (newListener) => listeners.push(newListener)
  ];
}

export function upperCaseFirst(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

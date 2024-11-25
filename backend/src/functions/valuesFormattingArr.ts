//TODO rename later to be more descriptive/readable
export function valuesFormattingArr(inputs: (string | number)[]) {
  return inputs
    .map((input) => {
      if (typeof input === 'string') {
        return { userEnteredValue: { stringValue: input } };
      } else if (typeof input === 'number') {
        return { userEnteredValue: { numberValue: input } };
      } else {
        return null;
      }
    })
    .filter((value) => value !== null);
}

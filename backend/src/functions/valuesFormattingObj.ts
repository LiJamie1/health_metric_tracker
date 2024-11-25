import { SheetOption } from '../interfaces';

//TODO refactor to allow formatting
//TODO rename later to be more descriptive/readable
export function valuesFormattingObj(
  inputs: { [key: string]: string },
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  sheetOptions: Partial<SheetOption>
) {
  console.log('valuesFormattingObj');
  const { sheetId, ...rangeOptions } = sheetOptions;
  const filteredInputs = Object.keys(inputs)
    .filter((key) => inputs[key] !== '')
    .reduce(
      (acc, key) => {
        acc[key] = inputs[key];
        return acc;
      },
      {} as { [key: string]: string }
    );

  console.log('filteredInputs', filteredInputs);

  return Object.keys(filteredInputs).map((key) => ({
    updateCells: {
      range: { sheetId, ...rangeOptions, ...mealColumnRanges[key] },
      rows: [
        {
          values: [
            {
              userEnteredValue: { stringValue: filteredInputs[key] },
            },
          ],
        },
      ],
      fields: 'userEnteredValue',
    },
  }));
}

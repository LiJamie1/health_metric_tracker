import { SheetOption } from '../../interfaces';

export function insertRowWithDate(
  sheetId: number,
  dateString: string
) {
  return [
    {
      insertDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 1,
          endIndex: 2,
        },
        inheritFromBefore: true,
      },
    },
    {
      updateCells: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        rows: [
          {
            values: [
              {
                userEnteredValue: { stringValue: dateString },
              },
            ],
          },
        ],
        fields: 'userEnteredValue',
      },
    },
  ];
}

//TODO Bug - only sorts col a and does not move related cells
//TODO Current behaviour - only sorts col A
//TODO Unexpected result - sorts col A in z-a fashion but does not relocate relevant cells
//TODO Fix - the request object to also move the cells relevant to col A
//? Look into documentation to read how to also move relevant rows
//TODO Expected outcome - move all related cells in the row along with col A
export function sortDateCol(sheetId: number) {
  return [
    {
      sortRange: {
        range: {
          sheetId: sheetId,
          startRowIndex: 1,
          endRowIndex: 32,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        sortSpecs: [
          {
            dimensionIndex: 0,
            sortOrder: 'DESCENDING',
          },
        ],
      },
    },
  ];
}

//TODO rename later to be more descriptive/readable
export function formatValues(inputs: (string | number)[]) {
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

//TODO refactor to allow formatting
//TODO rename later to be more descriptive/readable
export function formatMealValues(
  inputs: { [key: string]: string },
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  sheetOptions: Partial<SheetOption>
) {
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

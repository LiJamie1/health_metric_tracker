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

export function sortDateCol(sheetId: number) {
  return [
    {
      sortRange: {
        range: {
          sheetId: sheetId,
          startRowIndex: 1,
          endRowIndex: 32,
          startColumnIndex: 0,
          endColumnIndex: 5,
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

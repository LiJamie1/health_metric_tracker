import { format } from 'path';
import { SheetOption } from '../../interfaces';
import { MealColumnRange } from '../../types';

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

export function formatMealValues(
  inputs: { [key: string]: { [key: string]: string } },
  mealColumnRanges: MealColumnRange,
  { sheetId, ...rangeOptions }: Partial<SheetOption>
) {
  const filteredInputs = Object.fromEntries(
    Object.entries(inputs).filter(([_, value]) => value['1'])
  );

  return Object.keys(filteredInputs).map((key) => {
    const inputData = filteredInputs.key.stringInput;
    const rgbColor = filteredInputs.key.format
      ? { red: 1, green: 1, blue: 0 }
      : { red: 1, green: 1, blue: 1 };

    const range = {
      sheetId,
      ...rangeOptions,
      ...mealColumnRanges[key],
    };

    return {
      updateCells: {
        range,
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: inputData,
                },
                userEnteredFormat: {
                  backgroundColorStyle: {
                    rgbColor,
                  },
                },
              },
            ],
          },
        ],
        fields:
          'userEnteredValue,userEnteredFormat.backgroundColorStyle',
      },
    };
  });
}

//* Sheet Options - range options for individual sheets
export const weightSheetOptions = {
  sheetId: 1606005094,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 1,
  endColumnIndex: 3,
};

export const bpSheetOptions = {
  sheetId: 2094284245,
  am: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 1,
    endColumnIndex: 5,
  },
  pm: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 5,
    endColumnIndex: 9,
  },
};

export const mealSheetOptions = {
  sheetId: 427283826,
  startRowIndex: 1,
  endRowIndex: 2,
};

export const mealColumnRanges = {
  breakfast: { startColumnIndex: 1, endColumnIndex: 2 },
  lunch: { startColumnIndex: 2, endColumnIndex: 3 },
  dinner: { startColumnIndex: 3, endColumnIndex: 4 },
  snack: { startColumnIndex: 4, endColumnIndex: 5 },
};

export const bpColumnRanges = {
  am: {
    startColumnIndex: 1,
    endColumnIndex: 5,
  },
  pm: {
    startColumnIndex: 5,
    endColumnIndex: 9,
  },
};

//* Test Sheet Options - range options for individual sheets on test document
//! remove and replace with relevant sheetOptions later
export const testWeightSheetOptions = {
  sheetId: 306586463,
  startRowIndex: 1,
  endRowIndex: 2,
};

export const testBpSheetOptions = {
  sheetId: 0,
  startRowIndex: 1,
  endRowIndex: 2,
};

export const testMealSheetOptions = {
  sheetId: 956974682,
  startRowIndex: 1,
  endRowIndex: 2,
};

const test = [
  {
    insertDimension: {
      range: {
        sheetId: 0,
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
        sheetId: 0,
        startRowIndex: 1,
        endRowIndex: 2,
        startColumnIndex: 0,
        endColumnIndex: 1,
      },
      rows: [
        {
          values: [
            {
              userEnteredValue: { numberValue: 45629 },
              userEnteredFormat: {
                numberFormat: { type: 'DATE', pattern: 'dd/MM/yy' },
              },
            },
          ],
        },
      ],
      fields: 'userEnteredValue,userEnteredFormat.numberFormat',
    },
  },
  {
    updateCells: {
      range: { sheetId: 0, startRowIndex: 1, endRowIndex: 2 },
      rows: [
        {
          values: [
            { userEnteredValue: { stringValue: '04:32' } },
            { userEnteredValue: { numberValue: 2 } },
            { userEnteredValue: { numberValue: 5 } },
            { userEnteredValue: { numberValue: 8 } },
          ],
        },
      ],
      fields: 'userEnteredValue',
    },
  },
];

export function createInsertRowAndDateRequest(
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

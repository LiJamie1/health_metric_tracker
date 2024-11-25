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

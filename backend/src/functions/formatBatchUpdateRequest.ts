import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import { createInsertRowAndDateRequest } from './createInsertRowAndDateRequest';
import { valuesFormattingArr } from './valuesFormattingArr';

export async function formatBatchUpdateRequest(
  inputsArr: (string | number)[],
  spreadsheetId: string,
  { sheetId, ...rangeOptions }: SheetOption,
  dateFound: boolean
) {
  const createUpdateCellsRequest = () => ({
    updateCells: {
      range: { sheetId, ...rangeOptions },
      rows: [
        {
          values: valuesFormattingArr(inputsArr),
        },
      ],
      fields: 'userEnteredValue',
    },
  });

  const updateCellsRequest = createUpdateCellsRequest();

  const requests = dateFound
    ? [updateCellsRequest]
    : [
        ...createInsertRowAndDateRequest(sheetId, formattedDate),
        updateCellsRequest,
      ];

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests,
    },
  };

  return finalRequest;
}

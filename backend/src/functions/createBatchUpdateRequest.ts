import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import {
  insertRowWithDate,
  formatValues,
} from './helpers/sheetRequests';

export async function createBatchUpdateRequest(
  userInputs: (string | number)[],
  spreadsheetId: string,
  { sheetId, ...rangeOptions }: SheetOption,
  dateFound: boolean
) {
  const createUpdateCellsRequest = () => ({
    updateCells: {
      range: { sheetId, ...rangeOptions },
      rows: [
        {
          values: formatValues(userInputs),
        },
      ],
      fields: 'userEnteredValue',
    },
  });

  const updateCellsRequest = createUpdateCellsRequest();

  const requests = dateFound
    ? [updateCellsRequest]
    : [
        ...insertRowWithDate(sheetId, formattedDate),
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

import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import {
  insertRowWithDate,
  formatValues,
} from './helpers/sheetRequests';

//! Bug - adds new rows
//TODO Current behaviour - adds new rows with each submission
//TODO Unexpected result - creates multiple rows with the same date if called multiple times
//TODO Fix - properly integrate findDate to stop this behaviour
//TODO Expected outcome - replace data instead of creating new row if date is found
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

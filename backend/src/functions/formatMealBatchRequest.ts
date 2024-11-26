import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import { createInsertRowAndDateRequest } from './createInsertRowAndDateRequest';
import { sortDateCol } from './sortDateCol';
import { valuesFormattingObj } from './valuesFormattingObj';

export async function formatMealBatchRequest(
  inputsObj: { [key: string]: string },
  spreadsheetId: string,
  sheetOptions: Partial<SheetOption>,
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  dateFound: boolean
) {
  if (!sheetOptions.sheetId) {
    throw new Error('sheetId is required in sheetOptions');
  }

  const { sheetId } = sheetOptions;
  const { date, ...inputs } = inputsObj;
  const dateString = date === '' ? formattedDate : date;

  const newRowAndDate = createInsertRowAndDateRequest(
    sheetId,
    dateString
  );

  const updateCellsRequest = valuesFormattingObj(
    inputs,
    mealColumnRanges,
    sheetOptions
  );

  const sortRequest = sortDateCol(sheetId);

  const requests = dateFound
    ? [...updateCellsRequest]
    : [...newRowAndDate, ...updateCellsRequest, ...sortRequest];

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests,
    },
  };

  return finalRequest;
}

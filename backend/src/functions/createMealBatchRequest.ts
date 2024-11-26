import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import {
  formatMealValues,
  insertRowWithDate,
  sortDateCol,
} from './helpers/sheetRequests';

export async function createMealBatchRequest(
  { date, ...inputs }: { [key: string]: string },
  spreadsheetId: string,
  sheetOptions: Partial<SheetOption>,
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  dateFound: boolean
) {
  if (!sheetOptions.sheetId) {
    throw new Error('sheetId is required in sheetOptions');
  }

  const { sheetId } = sheetOptions;
  const dateString = date === '' ? formattedDate : date;

  const updateCellsRequest = formatMealValues(
    inputs,
    mealColumnRanges,
    sheetOptions
  );

  const requests = dateFound
    ? [...updateCellsRequest]
    : [
        ...insertRowWithDate(sheetId, dateString),
        ...updateCellsRequest,
        ...sortDateCol(sheetId),
      ];

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests,
    },
  };

  return finalRequest;
}

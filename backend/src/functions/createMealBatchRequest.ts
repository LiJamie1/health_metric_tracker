import { formattedDate } from '../constants';
import { SheetOption } from '../interfaces';
import { MealColumnRange } from '../types';
import {
  formatMealValues,
  insertRowWithDate,
  sortDateCol,
} from './helpers/sheetRequests';

export async function createMealBatchRequest(
  { date, ...inputs }: { [key: string]: string },
  formatting: { [key: string]: boolean },
  spreadsheetId: string,
  sheetOptions: Partial<SheetOption>,
  mealColumnRanges: MealColumnRange,
  dateFound: boolean
) {
  if (!sheetOptions.sheetId) {
    throw new Error('sheetId is required in sheetOptions');
  }

  const { sheetId } = sheetOptions;
  const dateString = date === '' ? formattedDate : date;

  const updateCellsRequest = formatMealValues(
    inputs,
    formatting,
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

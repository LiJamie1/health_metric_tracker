import { SheetOption } from '../interfaces';
import { MealColumnRange } from '../types';
import {
  formatMealValues,
  insertRowWithDate,
  sortDateCol,
} from './helpers/sheetRequests';

export async function createMealBatchRequest(
  date: string,
  inputs: { [key: string]: { [key: string]: string } },
  spreadsheetId: string,
  sheetOptions: Partial<SheetOption>,
  mealColumnRanges: MealColumnRange,
  dateFound: boolean
) {
  if (!sheetOptions.sheetId) {
    throw new Error('sheetId is required in sheetOptions');
  }

  const { sheetId } = sheetOptions;

  const updateCellsRequest = formatMealValues(
    inputs,
    mealColumnRanges,
    sheetOptions
  );

  const requests = dateFound
    ? [...updateCellsRequest]
    : [
        ...insertRowWithDate(sheetId, date),
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

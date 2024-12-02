import { formattedDate } from '../constants';
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
  const dateString = date === '' ? formattedDate : date;

  const updateCellsRequest = formatMealValues(
    inputs,
    mealColumnRanges,
    sheetOptions
  );

  //! Issue with date being input as string, sort z-a won't sort correctly
  //? Read Documentation to figure out how to solve
  //* Everthing gets input no problem
  //* Sort Date z-a makes it so 02/12/24 gets placed after 19/11/24
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

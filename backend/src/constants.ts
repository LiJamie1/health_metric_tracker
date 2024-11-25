//* Global Vars
const currentDate: Date = new Date();
// Date in dd/mm/yy format
export const formattedDate: string = currentDate.toLocaleDateString(
  'en-GB',
  {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }
);
// Time in 12hr clock, 00:00 AM format
const localTime: string = currentDate.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
//TODO Remove dayPeriod if left unused
export const [formattedTime, dayPeriod] = localTime.split(' ');

//* Sheet Options - range options for individual sheets
export const weightSheetOptions = {
  sheetId: 1606005094,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 1,
  endColumnIndex: 3,
};

export const bpSheetOptions = {
  sheetId: 2094284245,
  AM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 1,
    endColumnIndex: 5,
  },
  PM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 5,
    endColumnIndex: 9,
  },
};

export const mealSheetOptions = {
  sheetId: 427283826,
  startRowIndex: 1,
  endRowIndex: 2,
};

export const mealColumnRanges = {
  breakfast: { startColumnIndex: 1, endColumnIndex: 2 },
  lunch: { startColumnIndex: 2, endColumnIndex: 3 },
  dinner: { startColumnIndex: 3, endColumnIndex: 4 },
  snack: { startColumnIndex: 4, endColumnIndex: 5 },
};

//* Test SHeet Options - range options for individual sheets on test document
//! remove and replace with relevant sheetOptions later
export const testWeightSheetOptions = {
  sheetId: 306586463,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 1,
  endColumnIndex: 3,
};

export const testBpSheetOptions = {
  sheetId: 0,
  AM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 1,
    endColumnIndex: 5,
  },
  PM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 5,
    endColumnIndex: 9,
  },
};

export const testMealSheetOptions = {
  sheetId: 956974682,
  startRowIndex: 1,
  endRowIndex: 2,
};

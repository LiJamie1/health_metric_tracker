import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { oAuth2Client } from '../index'; // Importing oAuth2C
import { testMealSheetOptions, mealColumnRanges } from '../constants';
import { findDate, createMealBatchRequest } from '../functions';

const router = express.Router();

//! Using testMealSheetOptions
//TODO Replace testMealSheetOptions
//* Set Up - delete rows from previous tests
//* Set Up - create a row and add a random past date in (dd/mm/yy) that is relatively close
//*          eg. if current date is 20/11/24 put in 15/11/24
//* Test - make update request with all but the date input filled
//* Expcted Result - new row with current date and all relevant cells filled
//* Test - make another request with lunch/dinner as empty strings with the previously set random date
//* Expected Result - no new row, random date has breakfast and snack cells filled
//* Test - make another request same date, lunch/dinner inputs filled, breakfast/snack inputs empty
//* Expected Result - row with random date now has all cells filled
//* Test - make another request with another random date, any or no inputs
//*        eg. if 20/11/24 and 15/11/24 were used before, use 16/11/24
//* Expected Result - new row with the date and relevant fields should be filled
//*                   new row is sorted to be inbetween the 15th and 20th
//*                   top to bottom should be 20th, 16th, 15th
router.post(
  '/tracking/meals',
  async (req: Request, res: Response) => {
    //! change to use actual spreadsheet later
    const spreadsheetId = process.env.TEST_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('spreadsheetId is missing');
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: oAuth2Client,
    });

    const inputs = req.body;
    const { date } = inputs;

    //TODO replace 'Sheet3' with correct sheetName
    const { dateFound, rowIndex } = await findDate(
      spreadsheetId,
      'Sheet3',
      date,
      oAuth2Client
    );

    //TODO replace testMealSheetOptions with mealSheetOptions
    const finalMealSheetOptions = {
      ...testMealSheetOptions,
      startRowIndex: dateFound
        ? rowIndex
        : testMealSheetOptions.startRowIndex,
      endRowIndex: dateFound
        ? rowIndex + 1
        : testMealSheetOptions.endRowIndex,
    };

    const mealsBatchRequest = await createMealBatchRequest(
      inputs,
      spreadsheetId,
      finalMealSheetOptions,
      mealColumnRanges,
      dateFound
    );

    try {
      await sheets.spreadsheets.batchUpdate(mealsBatchRequest);
      res.status(200).send('Meals data updated successfully!');
    } catch (e: unknown) {
      console.error('Error during batch update', e);
      res.status(500).send('Error updating meals data');
    }
  }
);

export default router;

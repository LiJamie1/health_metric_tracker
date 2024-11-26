import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { oAuth2Client } from '../index'; // Importing oAuth2Client from index.ts
import { formattedDate, testWeightSheetOptions } from '../constants';
import { createBatchUpdateRequest, findDate } from '../functions';

const router = express.Router();

//! Using testWeightSheetOptions
//* Test - make a request to record data
//* Expected Result - Sheet 2 has new row with date, lbs and f% data
//* Test - make new request to record data
//* Expected Result - Sheet 2 does not have a new row, but values of lbs and f% have changed
router.post(
  '/tracking/weight',
  async (req: Request, res: Response) => {
    //! change to use actual spreadsheet later
    const spreadsheetId = process.env.TEST_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is missing in tracking/weight');
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: oAuth2Client, // Using the oAuth2Client here
    });

    const inputs = req.body;

    //TODO replace 'Sheet2' with correct sheetName
    const { dateFound } = await findDate(
      spreadsheetId,
      'Sheet2',
      formattedDate,
      oAuth2Client
    );

    try {
      const weightBatchRequest = await createBatchUpdateRequest(
        inputs,
        spreadsheetId,
        testWeightSheetOptions,
        dateFound
      );

      await sheets.spreadsheets.batchUpdate(weightBatchRequest);
      res.status(200).send('Weight data updated successfully!');
    } catch (e: unknown) {
      console.error('Error during batch update', e);
      res.status(500).send('Error updating weight data');
    }
  }
);

export default router;

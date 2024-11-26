import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { oAuth2Client } from '../index'; // Importing oAuth2Client from index.ts
import { testWeightSheetOptions } from '../constants';
import { createBatchUpdateRequest } from '../functions';

const router = express.Router();

//! Using testWeightSheetOptions
//TODO Replace testWeightSheetOptions
//TODO Current behaviour - force create new row on entry
//TODO Fix - use findDate to instead overwrite data if date is found
//* Test - make a request to record data
//* Expected Result - Sheet 2 has new row with date, lbs and f% data
//* Test - make new request to record data
//* Expected Result - Sheet 2 does not have a new row, but values of lbs and f% have changed
router.post(
  '/tracking/weight',
  async (req: Request, res: Response) => {
    const sheets = google.sheets({
      version: 'v4',
      auth: oAuth2Client, // Using the oAuth2Client here
    });

    const inputs = req.body;

    //* dateCorrect param false - force a new row and date
    //* realistically this route is only used once a day max standardizing data
    //* ie. checked twice a week on wednesday and sunday at 9am
    try {
      const weightBatchRequest = await createBatchUpdateRequest(
        inputs,
        process.env.TEST_SPREADSHEET_ID!,
        testWeightSheetOptions,
        false
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

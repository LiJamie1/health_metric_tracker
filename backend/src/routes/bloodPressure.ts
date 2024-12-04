import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { oAuth2Client } from '../index'; // Importing oAuth2C
import { bpColumnRanges, testBpSheetOptions } from '../constants';
import { findDate, createBatchUpdateRequest } from '../functions';

const router = express.Router();

//! Using testBpSheetOptions
//TODO Replace testBpSheetOptions
//* Test - make request where night is toggled
//* Expected Result - Sheet 1 has a new row, date and cells F2-I2 are filled while B2-E2 are empty
//* Test - make another request where day is toggled
//* Expected Result - Sheet 1 cells B2-E2 which were previously empty are now filled
//* Test - change the values and make another request where day is toggled
//* Expected Result - Sheet 1 cells B2-E2 should have changed to new values
router.post(
  '/tracking/blood-pressure',
  async (req: Request, res: Response) => {
    //! change to use actual spreadsheet later
    const spreadsheetId = process.env.TEST_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is missing in tracking/bp');
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: oAuth2Client,
    });

    const { finalResultsArray, date } = req.body;

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      timeZone: 'UTC',
    });

    const currentTime = new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    //* Normalizing time to get the required outputs
    const normalizedTime = currentTime.replace(/\s+/g, ' ');
    const timeParts = normalizedTime.split(' ');
    if (timeParts.length !== 2)
      throw new Error('Unexpected format of timeParts');
    const [time, dayPeriod] = timeParts;
    const normalizedDayPeriod = dayPeriod
      .toLowerCase()
      .replace(/\./g, '')
      .trim() as 'am' | 'pm';

    //TODO replace 'Sheet1' with correct sheetName
    const { dateFound } = await findDate(
      spreadsheetId,
      'Sheet1',
      formattedDate,
      oAuth2Client
    );

    const finalSheetOptions = {
      ...testBpSheetOptions,
      ...bpColumnRanges[normalizedDayPeriod],
    };

    const bpBatchRequest = await createBatchUpdateRequest(
      date,
      [time, ...finalResultsArray],
      spreadsheetId,
      finalSheetOptions,
      dateFound
    );

    try {
      await sheets.spreadsheets.batchUpdate(bpBatchRequest);
      res
        .status(200)
        .send('Blood Pressure data updated successfully!');
    } catch (e: unknown) {
      console.error('Error during batch update', e);
      res.status(500).send('Error updating blood pressure data');
    }
  }
);

export default router;

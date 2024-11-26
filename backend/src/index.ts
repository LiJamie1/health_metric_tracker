import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { google } from 'googleapis';
import {
  formatBatchUpdateRequest,
  formatMealBatchRequest,
  findDate,
} from './functions';
import {
  testWeightSheetOptions,
  testBpSheetOptions,
  testMealSheetOptions,
  mealColumnRanges,
  formattedDate,
  formattedTime,
} from './constants';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//* Env Vars
export const client_id = process.env.CLIENT_ID!;
export const client_secret = process.env.CLIENT_SECRET!;
export const redirect_uri = 'http://localhost:5000/api/auth/google';
//! change to use actual spreadsheet later
export const spreadsheetId = process.env.TEST_SPREADSHEET_ID!;

//* OAuth
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

app.post('/api/auth/google', async (req, res) => {
  const { serverAuthCode } = req.body;

  const params = {
    code: serverAuthCode,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code',
  };

  const tokenUrl = 'https://oauth2.googleapis.com/token';

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const { access_token, refresh_token } = response.data;

    oAuth2Client.setCredentials({
      access_token,
      refresh_token,
    });

    res.status(200).json({
      message: 'Successfully requested token',
    });
  } catch (e: unknown) {
    console.log('Auth failed', e);
    res.status(500).json({
      message: 'Internal server error, tokenRequest',
    });
  }
});

//* Weight
//! Using testWeightSheetOptions
//TODO Replace testWeightSheetOptions
//* Test - make a request to record data
//* Expected Result - Sheet 2 has new row with date, lbs and f% data
app.post('/tracking/weight', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  const inputs = [...req.body];

  //* dateCorrect param false - force a new row and date
  //* realistically this route is only used once a day max standardizing data
  //* ie. checked twice a week on wednesday and sunday at 9am
  const weightBatchRequest = await formatBatchUpdateRequest(
    inputs,
    spreadsheetId,
    testWeightSheetOptions,
    false
  );

  try {
    await sheets.spreadsheets.batchUpdate(weightBatchRequest);
    res.status(200).send('Weight data updated successfully!');
  } catch (e: unknown) {
    console.error('Error during batch update', e);
    res.status(500).send('Error updating weight data');
  }
});

//* Blood Pressure
//! Using testBpSheetOptions
//TODO Replace testBpSheetOptions
//* Test - make request where night is toggled
//* Expected Result - Sheet 1 has a new row, date and cells F2-I2 are filled while B2-E2 are empty
//* Test - make another request where day is toggled
//* Expected Result - Sheet 1 cells B2-E2 which were previously empty are now filled
app.post('/tracking/blood-pressure', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  const { finalResultsArray, isDay } = req.body;

  const finalSheetOptions = {
    sheetId: testBpSheetOptions.sheetId,
    ...testBpSheetOptions[isDay ? 'AM' : 'PM'],
  };
  //TODO replace 'Sheet1' with correct sheetName
  const { dateFound } = await findDate(
    spreadsheetId,
    'Sheet1',
    formattedDate,
    oAuth2Client
  );

  const bpBatchRequest = await formatBatchUpdateRequest(
    [formattedTime, ...finalResultsArray],
    spreadsheetId,
    finalSheetOptions,
    dateFound
  );

  try {
    await sheets.spreadsheets.batchUpdate(bpBatchRequest);
    res.status(200).send('Blood Pressure data updated successfully!');
  } catch (e: unknown) {
    console.error('Error during batch update', e);
    res.status(500).send('Error updating blood pressure data');
  }
});

//* Meals
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
app.post('/tracking/meals', async (req, res) => {
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

  const mealsBatchRequest = await formatMealBatchRequest(
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
});

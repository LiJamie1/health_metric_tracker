import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { google, sheets_v4 } from 'googleapis';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//* Global Vars
const currentDate: Date = new Date();
const formattedDate: string = currentDate.toLocaleDateString(
  'en-GB',
  {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }
);
const localTime: string = currentDate.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
const [formattedTime, dayPeriod] = localTime.split(' ');

const client_id = process.env.CLIENT_ID!;
const client_secret = process.env.CLIENT_SECRET!;
const redirect_uri = 'http://localhost:5000/api/auth/google';
//! change to use actual spreadsheet later
const spreadsheetId = process.env.TEST_SPREADSHEET_ID;

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

//* Sheet Options - range options for individual sheets
//TODO create meals sheetOptions
interface SheetOption {
  sheetId: number;
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
}

const weightSheetOptions = {
  sheetId: 1606005094,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 0,
  endColumnIndex: 3,
};

const bpSheetOptions = {
  sheetId: 2094284245,
  AM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 1,
    endColumnIndex: 6,
  },
  PM: {
    startRowIndex: 1,
    endRowIndex: 2,
    startColumnIndex: 6,
    endColumnIndex: 10,
  },
};

//! remove and replace with relevant sheetOptions later
const testSheetOptions = {
  sheetId: 0,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 0,
  endColumnIndex: 3,
};

//* Functions
//TODO Refactor to make more readable
const dateCheck = async (
  spreadsheetId: string | undefined,
  sheetName: string
) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2`,
    });
    const newArray: any[] | undefined = response.data.values?.flat();
    if (newArray === undefined) {
      console.log('dateChecked undefined');
      throw new Error('dateCheck newArray returned undefined');
    } else if (newArray && newArray[0] === formattedDate) {
      console.log(
        'dateCheck True, Cell A2:',
        newArray[0],
        'Current Date:',
        formattedDate
      );
      return true;
    } else {
      console.log(
        'dateCheck False, Cell A2:',
        newArray[0],
        'Current Date:',
        formattedDate
      );
      return false;
    }
  } catch (e: unknown) {
    console.log('dateCheck error');
    if (e instanceof Error) {
      throw new Error('Something went wrong: ' + e.message);
    } else {
      throw new Error('Something went wrong: Unknown error');
    }
  }
};

// Function to generate a values array for sheets updateCells method
//TODO Refactor to only allow array of string and number
//TODO At a later date refactor to allow formatting of cells
const valuesFormatting = (inputs: any[]) => {
  return inputs.map((input) => ({
    userEnteredValue: { stringValue: input },
  }));
};

// Only used with batchUpdates for the following consecutive actions insert row above, insert data
const formatBatchUpdateRequest = async (
  inputs: any[],
  sheetOptions: SheetOption
) => {
  const { sheetId, ...rangeOptions } = sheetOptions;
  const insertDimensionRequest = {
    insertDimension: {
      range: {
        sheetId,
        dimension: 'ROWS',
        startIndex: 1,
        endIndex: 2,
      },
      inheritFromBefore: true,
    },
  };

  const updateCellsRequest = {
    updateCells: {
      range: rangeOptions,
      rows: [
        {
          values: valuesFormatting(inputs),
        },
      ],
      fields: 'userEnteredValue',
    },
  };

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests: [insertDimensionRequest, updateCellsRequest],
    },
  };

  return finalRequest;
};

//* Weight
//! Using testSheetOptions
//TODO Replace testSheetOptions with weightSheetOptions in weightBatchRequest
app.post('/tracking/weight', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  // Add formatted Date to inputs array for formatBatchUpdateRequest
  const inputs = [formattedDate, ...req.body];

  const weightBatchRequest = await formatBatchUpdateRequest(
    inputs,
    testSheetOptions
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
app.post('/tracking/blood-pressure', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  const { finalResultsArray, isDay } = req.body;
  const timeOfDay = isDay ? 'AM' : 'PM';
  const finalSheetOptions = {
    sheetId: bpSheetOptions.sheetId,
    ...bpSheetOptions[timeOfDay],
  };
  //TODO replace 'Sheet1' with correct sheetName
  const dateCorrect = await dateCheck(spreadsheetId, 'Sheet1');
  let inputs: any[] = [];
  if (dateCorrect) {
    inputs = [formattedDate, formattedTime, ...finalResultsArray];
  } else if (!dateCorrect) {
    inputs = [formattedTime, ...finalResultsArray];
  } else {
    res.status(500).json({
      message: 'Internal server error, dateCorrect is not bool',
    });
  }

  const bpBatchRequest = await formatBatchUpdateRequest(
    inputs,
    finalSheetOptions
  );

  try {
    await sheets.spreadsheets.batchUpdate(bpBatchRequest);
    res.status(200).send('Blood Pressure data updated successfully!');
  } catch (e: unknown) {
    console.error('Error during batch update', e);
    res.status(500).send('Error updating weight data');
  }
});

//* Meals

//* Tests
app.post('/dateCheckTest', async (req, res) => {
  await dateCheck(spreadsheetId, 'Sheet1');
});

//* Initialize sheets - Goes in each route, avoid stale state etc
// const sheets = google.sheets({
//   version: 'v4',
//   auth: oAuth2Client,
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

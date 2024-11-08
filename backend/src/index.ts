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

// global vars
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
const spreadsheetId = process.env.TEST_SPREADSHEET_ID;

// OAuth
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
  } catch (error: unknown) {
    console.error('Unknown error:', error);
  }
});

// Funciton to check date of cell A2 in a provided google sheet
const dateCheck = async (
  spreadsheetId: string | undefined,
  sheetName: string,
  sheets: sheets_v4.Sheets
) => {
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
  } catch (error: unknown) {
    console.log('dateCheck error');
    console.error('Unknown error:', error);
  }
};

// Sheet configs
// range options for individual sheets
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

// Note - Using weight configurations
const testSheetOptions = {
  sheetId: 0,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 0,
  endColumnIndex: 3,
};

// Templates
// BatchUpdate: to use push object into batchUpdateRequest.requestBody.requests
// insertDimension needs sheetId - batchUpdateRequest.requestBody.requests[0].insertDimension.range.sheetId = xOptions.sheetId
// Push in order of operations
const batchUpdateRequest = {
  spreadsheetId: spreadsheetId,
  requestBody: {
    requests: [
      {
        insertDimension: {
          range: {
            sheetId: -1,
            dimension: 'ROWS',
            startIndex: 1,
            endIndex: 2,
          },
          inheritFromBefore: true,
        },
      },
    ],
  },
};

const updateCellsRequest = {
  updateCells: {
    range: {},
    rows: [
      {
        values: [] as { userEnteredValue: { stringValue: string } }[],
      },
    ],
    fields: 'userEnteredValue',
  },
};

// Function to generate a values array for sheets updateCells method
// replaces updateCellsRequest.updateCells.rows[0].values
const valuesFormatting = (inputs: any[]) => {
  const newArray = [];

  for (let i = 0; i < inputs.length; i++) {
    newArray.push({
      userEnteredValue: {
        stringValue: inputs[i],
      },
    });
  }

  return newArray;
};

// currently using testSheetOptions
// TODO add new param for xSheetOptions
const formatBatchUpdateRequest = async (inputs: any[]) => {
  let finalRequest = JSON.parse(JSON.stringify(batchUpdateRequest)); // deep copy batchUpdateRequest
  // insert row above in batchUpdate
  finalRequest.requestBody.requests[0].insertDimension.range.sheetId =
    testSheetOptions.sheetId; // reassign sheetId from -1 to weightSheetOptions sheetId
  // create/format/insert updateCells object
  let finalUpdateCellsRequest = updateCellsRequest; // copy updateCellsRequest
  finalUpdateCellsRequest.updateCells.range = testSheetOptions; // reassign range to weightSheetOptions
  const inputsFormatted = valuesFormatting(inputs); // format inputs array for cellsUpdate in batchUpdate
  finalUpdateCellsRequest.updateCells.rows[0].values =
    inputsFormatted; // reassign values to inputsFormatted
  // add finalUpdateCellsRequest to finalRequest
  finalRequest.requestBody.requests.push(finalUpdateCellsRequest);
  // finalRequest should now contain, spreadsheetId, insert row above, insert inputs
  return finalRequest;
};

// Weight
// NOTE /tracking/weight is currently using testSheetOptions so it is being written to a test document
// TODO refactor to use weightSheetOptions
app.post('/tracking/weight', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  // Add formatted Date to inputs array for formatBatchUpdateRequest
  const inputs = [formattedDate, ...req.body];

  const weightBatchRequest = await formatBatchUpdateRequest(inputs);

  try {
    await sheets.spreadsheets.batchUpdate(weightBatchRequest);
    res.status(200).send('Weight data updated successfully!');
  } catch (error: unknown) {
    console.error('Error during batch update', error);
    res.status(500).send('Error updating weight data');
  }
});

// Blood Pressure

// Meals

// Tests
app.post('/dateCheckTest', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });
  await dateCheck(spreadsheetId, 'Sheet1', sheets);
});

// Initialize sheets - Goes in each route, avoid stale state etc
// const sheets = google.sheets({
//   version: 'v4',
//   auth: oAuth2Client,
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

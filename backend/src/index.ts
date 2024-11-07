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

// Time and Date related constants
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

// global vars
const client_id = process.env.CLIENT_ID!;
const client_secret = process.env.CLIENT_SECRET!;
const redirect_uri = 'http://localhost:5000/api/auth/google';

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

// OAuth
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
//
const dateCheck = async (
  spreadsheetId: string | undefined,
  sheetName: string,
  sheets: sheets_v4.Sheets
) => {
  console.log('dateCheck called');
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

const spreadsheetId = process.env.TEST_SPREADSHEET_ID;

// Sheet configs
// range options for individual sheets
const weightSheetConfigOptions = {
  sheetId: 1606005094,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 0,
  endColumnIndex: 3,
};

const bpSheetConfigOptions = {
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

// Templates
// BatchUpdate: to use push object into insertRequest.requestBody.requests
// Push in order of operations
const insertRequest = {
  spreadsheetId: spreadsheetId,
  requestBody: {
    requests: [],
  },
};

// Add sheetId to range: {}
const insertRowAboveRequest = {
  insertDimension: {
    range: {
      dimension: 'ROWS',
      startIndex: 1,
      endIndex: 2,
    },
    inheritFromBefore: true,
  },
};

// Weight
app.post('/tracking/weight', async (req, res) => {});

// Blood Pressure

// Meals

// Tests
app.post('/dateCheckTest', async (req, res) => {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });
  const dateIsCorrect: boolean | undefined = await dateCheck(
    spreadsheetId,
    'Sheet1',
    sheets
  );
  if (dateIsCorrect === undefined) {
    console.log('dateCheck is undefined');
  } else if (dateIsCorrect === true) {
    console.log('dateCheck true');
  } else if (dateIsCorrect === false) {
    console.log('dateCheck false');
  }
});

// Initialize sheets - Goes in each route, avoid stale state etc
// const sheets = google.sheets({
//   version: 'v4',
//   auth: oAuth2Client,
// });

// request to update cells/insert data
// const insertDataRequest = {
//   updateCells: {
//     range: {},
//     rows: [
//       {
//         values: [
//           {
//             userEnteredValue: {
//               stringValue: testInput,
//             },
//           },
//         ],
//       },
//     ],
//     fields: 'userEnteredValue',
//   },
// };

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

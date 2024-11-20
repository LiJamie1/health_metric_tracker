import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { google } from 'googleapis';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
//TODO Remove dayPeriod if left unused
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
//TODO Add sheetName to sheetOptions
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
  startColumnIndex: 1,
  endColumnIndex: 3,
};

const bpSheetOptions = {
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

const mealSheetOptions = {
  sheetId: 427283826,
  startRowIndex: 1,
  endRowIndex: 2,
};

const mealColumnRanges = {
  breakfast: { startColumnIndex: 1, endColumnIndex: 2 },
  lunch: { startColumnIndex: 2, endColumnIndex: 3 },
  dinner: { startColumnIndex: 3, endColumnIndex: 4 },
  snack: { startColumnIndex: 4, endColumnIndex: 5 },
};

//! remove and replace with relevant sheetOptions later
const testWeightSheetOptions = {
  sheetId: 306586463,
  startRowIndex: 1,
  endRowIndex: 2,
  startColumnIndex: 1,
  endColumnIndex: 3,
};

const testBpSheetOptions = {
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

const testMealSheetOptions = {
  sheetId: 956974682,
  startRowIndex: 1,
  endRowIndex: 2,
};

//* Functions
const dateCheck = async (
  spreadsheetId: string | undefined,
  sheetName: string
) => {
  if (!spreadsheetId)
    throw new Error('Spreadsheet ID is required, dateCheck');

  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2`,
    });

    const values = response.data.values?.flat();

    if (!values || values.length === 0) {
      const errorMessage = 'Cell A2 is empty or not found.';
      console.error(`dateCheck: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    const isDateCorrect = values[0] === formattedDate;

    console.log(
      `dateCheck: Cell A2 contains "${values[0]}" - ${isDateCorrect ? 'Match' : 'No match'} with current date (${formattedDate})`
    );

    return isDateCorrect;
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : 'Unknown error';
    console.error('dateCheck: Error occurred:', errorMessage);
    throw new Error(`Something went wrong: ${errorMessage}`);
  }
};

const findDate = async (
  spreadsheetId: string | undefined,
  sheetName: string,
  inputDate: string
) => {
  if (!spreadsheetId)
    throw new Error('Spreadsheet ID is required, findDate function');

  if (inputDate === '') return { dateFound: false, rowIndex: 0 };

  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client,
  });

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:A16`,
    });

    const values = data.values;

    if (!values)
      throw new Error(
        'Response Data Values invalid, findDate function'
      );

    if (values.length === 0 || values.every((row) => row[0] === ''))
      return { dateFound: false, rowIndex: 0 };

    const dateIndexFound = values
      .map((row) => row[0])
      .findIndex((cell) => cell === inputDate);

    return {
      dateFound: dateIndexFound !== -1,
      rowIndex: dateIndexFound !== -1 ? dateIndexFound + 1 : 0,
    };
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : 'Unknown error';
    console.error('findDate: Error occurred:', errorMessage);
    throw new Error(
      `Something went wrong in findDate: ${errorMessage}`
    );
  }
};

const createInsertRowAndDateRequest = (
  sheetId: number,
  dateString: string
) => {
  return [
    {
      insertDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 1,
          endIndex: 2,
        },
        inheritFromBefore: true,
      },
    },
    {
      updateCells: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        rows: [
          {
            values: [
              {
                userEnteredValue: { stringValue: dateString },
              },
            ],
          },
        ],
        fields: 'userEnteredValue',
      },
    },
  ];
};

const valuesFormattingArr = (inputs: (string | number)[]) => {
  return inputs
    .map((input) => {
      if (typeof input === 'string') {
        return { userEnteredValue: { stringValue: input } };
      } else if (typeof input === 'number') {
        return { userEnteredValue: { numberValue: input } };
      } else {
        return null;
      }
    })
    .filter((value) => value !== null);
};

//TODO At a later date refactor to allow formatting of cells, cell colours yellow
const valuesFormattingObj = (
  inputs: { [key: string]: string },
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  sheetOptions: Partial<SheetOption>
) => {
  const { sheetId, ...rangeOptions } = sheetOptions;
  const filteredInputs = Object.keys(inputs)
    .filter((key) => inputs[key] !== '')
    .reduce(
      (acc, key) => {
        acc[key] = inputs[key];
        return acc;
      },
      {} as { [key: string]: string }
    );

  return Object.keys(filteredInputs).map((key) => ({
    updateCells: {
      range: { sheetId, ...rangeOptions, ...mealColumnRanges[key] },
      rows: [
        {
          values: [
            {
              userEnteredValue: { stringValue: filteredInputs[key] },
            },
          ],
        },
      ],
      fields: 'userEnteredValue',
    },
  }));
};

//* batchUpdates for weight and blood pressure
const formatBatchUpdateRequest = async (
  inputsArr: (string | number)[],
  sheetOptions: SheetOption,
  dateCorrect: boolean
) => {
  const { sheetId, ...rangeOptions } = sheetOptions;
  const newRowAndDate = createInsertRowAndDateRequest(
    sheetId,
    formattedDate
  );

  const updateCellsRequest = {
    updateCells: {
      range: { sheetId, ...rangeOptions },
      rows: [
        {
          values: valuesFormattingArr(inputsArr),
        },
      ],
      fields: 'userEnteredValue',
    },
  };

  const requests = dateCorrect
    ? [updateCellsRequest]
    : [...newRowAndDate, updateCellsRequest];

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests,
    },
  };

  return finalRequest;
};

//* batchUpdates for meals
//TODO add a sort request if inputDate !== currentDate && dateFound === false
const formatMealBatchRequest = async (
  inputsObj: { [key: string]: string },
  sheetOptions: Partial<SheetOption>,
  mealColumnRanges: { [key: string]: { [key: string]: number } },
  dateFound: boolean
) => {
  if (!sheetOptions.sheetId) {
    throw new Error('sheetId is required in sheetOptions');
  }

  const { sheetId } = sheetOptions;
  const { inputDate, ...inputs } = inputsObj;
  const dateString = inputDate === '' ? formattedDate : inputDate;

  const newRowAndDate = createInsertRowAndDateRequest(
    sheetId,
    dateString
  );

  const updateCellsRequest = valuesFormattingObj(
    inputs,
    mealColumnRanges,
    sheetOptions
  );

  const requests = dateFound
    ? updateCellsRequest
    : [...newRowAndDate, ...updateCellsRequest];

  const finalRequest = {
    spreadsheetId,
    requestBody: {
      requests,
    },
  };

  return finalRequest;
};

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

  //* dateCorrect param false - force a new row and date - only 1 input perday max
  const weightBatchRequest = await formatBatchUpdateRequest(
    inputs,
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
  const dateCorrect = await dateCheck(spreadsheetId, 'Sheet1');

  const bpBatchRequest = await formatBatchUpdateRequest(
    [formattedTime, ...finalResultsArray],
    finalSheetOptions,
    dateCorrect
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
  // const dateCorrect = await dateCheck(spreadsheetId, 'Sheet3');
  const { dateFound, rowIndex } = await findDate(
    spreadsheetId,
    'Sheet3',
    date
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

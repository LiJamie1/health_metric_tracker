import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export async function findDate(
  spreadsheetId: string | undefined,
  sheetName: string,
  inputDate: string,
  oAuth2Client: OAuth2Client
) {
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
}

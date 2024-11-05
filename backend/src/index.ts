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
    if (axios.isAxiosError(error)) {
      console.error('Error message:', error.message);
      console.error('Response data:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
  }
});

// Sheets
const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client,
});

// TEST route to get spread sheet value
app.get('/test', async (req, res) => {
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1',
    },
    (err, res) => {
      if (err) {
        console.error('API returned an error', err);
        return;
      }
      const rows = res?.data.values;
      if (rows?.length) {
        console.log('Data:', rows);
      } else {
        console.log('No Data');
      }
    }
  );
});

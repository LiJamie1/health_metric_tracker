import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { URLSearchParams } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/api/auth/google', async (req, res) => {
  const client_id = process.env.CLIENT_ID!;
  const client_secret = process.env.CLIENT_SECRET!;
  const redirect_uri = 'http://localhost:5000/api/auth/google';
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
    const { access_token, refresh_token, id_token } = response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error message:', error.message);
      console.error('Response data:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
  }
});

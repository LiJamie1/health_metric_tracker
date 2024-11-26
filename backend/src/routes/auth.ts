import axios from 'axios';
import express, { Request, Response } from 'express';
import { oAuth2Client } from '..';

const router = express.Router();

router.post(
  '/api/auth/google',
  async (req: Request, res: Response) => {
    const client_id = process.env.CLIENT_ID!;
    const client_secret = process.env.CLIENT_SECRET!;
    const redirect_uri = process.env.REDIRECT_URI!;

    if (!client_id || !client_secret || !redirect_uri)
      throw new Error('env variable missing in auth');

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
  }
);

export default router;

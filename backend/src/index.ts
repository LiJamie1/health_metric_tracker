import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { google } from 'googleapis';
import authRoutes from './routes/auth';
import mealRoutes from './routes/meals';
import bloodPressureRoutes from './routes/bloodPressure';
import weightRoutes from './routes/weight';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//* Env Vars
const client_id = process.env.CLIENT_ID!;
const client_secret = process.env.CLIENT_SECRET!;
const redirect_uri = process.env.REDIRECT_URI!;

//* OAuth
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

// app.post('/api/auth/google', async (req, res) => {
//   const { serverAuthCode } = req.body;

//   const params = {
//     code: serverAuthCode,
//     client_id,
//     client_secret,
//     redirect_uri,
//     grant_type: 'authorization_code',
//   };

//   const tokenUrl = 'https://oauth2.googleapis.com/token';

//   try {
//     const response = await axios.post(
//       tokenUrl,
//       new URLSearchParams(params),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
//     const { access_token, refresh_token } = response.data;

//     oAuth2Client.setCredentials({
//       access_token,
//       refresh_token,
//     });

//     res.status(200).json({
//       message: 'Successfully requested token',
//     });
//   } catch (e: unknown) {
//     console.log('Auth failed', e);
//     res.status(500).json({
//       message: 'Internal server error, tokenRequest',
//     });
//   }
// });

export { oAuth2Client };

app.use(authRoutes);

app.use(weightRoutes);
app.use(bloodPressureRoutes);
app.use(mealRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

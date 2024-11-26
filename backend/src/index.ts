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

export { oAuth2Client };

app.use(authRoutes);

app.use(weightRoutes);
app.use(bloodPressureRoutes);
app.use(mealRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

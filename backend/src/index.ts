import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

let gEmail = '';

//change to api/auth/google later
app.post('/receive', (req, res) => {
  const { serverAuthCode, idToken, email } = req.body;

  gEmail = email;

  res.send('sendDataToBackend Received');
});

app.get('/emailFromBack', (req, res) => {
  res.send({ email: gEmail });
});

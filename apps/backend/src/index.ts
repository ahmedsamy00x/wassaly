import 'dotenv/config'
import express from "express";
import { prisma } from "@wassaly/database";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.get('/health', async (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

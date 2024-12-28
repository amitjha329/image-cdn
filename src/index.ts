import express, { Request, Response } from 'express';
// import sharp from 'sharp';
// import fs from 'fs';
// import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const rootDir: string = process.env.ROOT_DIR || __dirname;

app.get('/*', (req: Request, res: Response) => {
  const options = {
    root: rootDir,
  };
  res.sendFile(req.params[0], options);
});

app.listen(6543, () => {
  console.log('Server is running on port 6543');
});

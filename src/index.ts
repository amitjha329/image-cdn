import express, { Request, Response } from 'express';
import { MongoClient, GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const rootDir: string = process.env.ROOT_DIR || __dirname;
const mongoUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName: string = process.env.DB_NAME || 'image-cdn';

let bucket: GridFSBucket;

MongoClient.connect(mongoUri, {  })
  .then(client => {
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: 'images' });
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.get('/*', (req: Request, res: Response) => {
  const options = {
    root: rootDir,
  };
  res.sendFile(req.params[0], options);
});

app.get('/gridfs/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  bucket.openDownloadStreamByName(filename)
    .on('error', () => res.status(404).send('File not found'))
    .pipe(res);
});

app.listen(6543, () => {
  console.log('Server is running on port 6543');
});

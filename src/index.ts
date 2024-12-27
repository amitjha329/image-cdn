import express, { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const rootDir: string = process.env.ROOT_DIR || __dirname;

const compressImage = async (imagePath: string): Promise<void> => {
  const outputDir = path.dirname(imagePath);
  const outputFilePath = path.join(outputDir, `compressed-${path.basename(imagePath)}`);
  await sharp(imagePath)
    .jpeg({ quality: 85 })
    .toFile(outputFilePath);
};

app.post('/compress_images', async (req: Request, res: Response) => {
  const walkDir = async (dir: string): Promise<void> => {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isDirectory()) {
        await walkDir(filePath);
      } else if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
        await compressImage(filePath);
      }
    }
  };

  await walkDir(rootDir);
  res.send('Images compressed successfully');
});

app.get('/images/:filename', (req: Request, res: Response) => {
  const options = {
    root: rootDir,
  };
  res.sendFile(req.params.filename, options);
});

app.listen(6543, () => {
  console.log('Server is running on port 3000');
});

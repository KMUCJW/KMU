import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: false,
      uploadDir: path.join(process.cwd(), 'public/images/projects'),
    });

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Upload main image
    const mainImageFile = files.mainImage;
    let mainImageUrl = '';
    if (mainImageFile && Array.isArray(mainImageFile) && mainImageFile[0]?.filepath) {
      const oldPath = mainImageFile[0].filepath;
      const newPath = path.join(process.cwd(), 'public/images/projects', mainImageFile[0].originalFilename || 'main.jpg');
      fs.renameSync(oldPath, newPath);
      mainImageUrl = `/images/projects/${mainImageFile[0].originalFilename}`;
    }

    // Upload sub images
    const subImages = [];
    if (files.subImages) {
      const subImageFiles = Array.isArray(files.subImages) 
        ? files.subImages 
        : [files.subImages];

      for (const file of subImageFiles) {
        if (Array.isArray(file) && file[0]?.filepath) {
          const oldPath = file[0].filepath;
          const newPath = path.join(process.cwd(), 'public/images/projects', file[0].originalFilename || 'sub.jpg');
          fs.renameSync(oldPath, newPath);
          subImages.push({
            url: `/images/projects/${file[0].originalFilename}`,
            caption: fields[`subImageCaption${subImages.length}`] || '',
            captionEng: fields[`subImageCaptionEng${subImages.length}`] || '',
          });
        }
      }
    }

    // Create response with uploaded URLs
    const response = {
      mainImage: mainImageUrl,
      subImages,
      fields,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files' });
  }
} 
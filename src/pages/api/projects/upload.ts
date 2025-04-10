import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FormidableFile {
  filepath: string;
  originalFilename?: string;
}

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
    });

    const [fields, files]: [Fields, Files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const mainImageFile = files.mainImage as FormidableFile | FormidableFile[];
    let mainImageUrl = '';

    if (mainImageFile) {
      const file = Array.isArray(mainImageFile) ? mainImageFile[0] : mainImageFile;
      if (file?.filepath) {
        const blob = await put(file.originalFilename || 'image.jpg', file.filepath, {
          access: 'public',
        });
        mainImageUrl = blob.url;
      }
    }

    // Upload sub images
    const subImages = [];
    const subImageFiles = files.subImages as FormidableFile | FormidableFile[];
    
    if (subImageFiles) {
      const filesArray = Array.isArray(subImageFiles) ? subImageFiles : [subImageFiles];
      
      for (const file of filesArray) {
        if (file?.filepath) {
          const blob = await put(file.originalFilename || 'image.jpg', file.filepath, {
            access: 'public',
          });
          subImages.push({
            url: blob.url,
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
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import cloudinary from '../../../lib/cloudinary';

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
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Upload main image to Cloudinary
    const mainImageFile = files.mainImage;
    let mainImageUrl = '';
    if (mainImageFile && mainImageFile.filepath) {
      const mainImageResult = await cloudinary.uploader.upload(mainImageFile.filepath, {
        folder: 'projects',
      });
      mainImageUrl = mainImageResult.secure_url;
    }

    // Upload sub images to Cloudinary
    const subImages = [];
    if (files.subImages) {
      const subImageFiles = Array.isArray(files.subImages) 
        ? files.subImages 
        : [files.subImages];

      for (const file of subImageFiles) {
        if (file.filepath) {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'projects',
          });
          subImages.push({
            url: result.secure_url,
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
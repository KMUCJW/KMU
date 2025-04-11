import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method not allowed' });
    }

    const file = request.body;
    if (!file) {
      return response.status(400).json({ error: 'No file provided' });
    }

    const filename = request.query.filename as string;
    if (!filename) {
      return response.status(400).json({ error: 'No filename provided' });
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return response.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    return response.status(500).json({ error: 'Error uploading file' });
  }
} 
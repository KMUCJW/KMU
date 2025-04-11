import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { projects } from '../../data/projects';

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

    const form = formidable({});
    const [fields, files] = await form.parse(request);
    
    const file = files.file?.[0];
    if (!file) {
      return response.status(400).json({ error: 'No file provided' });
    }

    const projectId = fields.projectId?.[0];
    if (!projectId) {
      return response.status(400).json({ error: 'No project ID provided' });
    }

    const filename = fields.filename?.[0] || file.originalFilename || 'upload';
    const blob = await put(filename, file.filepath, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Update project data
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].imageUrl = blob.url;
    }

    return response.json({ ...blob, projectId });
  } catch (error) {
    console.error('Error uploading file:', error);
    return response.status(500).json({ error: 'Error uploading file' });
  }
} 